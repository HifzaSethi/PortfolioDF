import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { validatePortfolioDraft } from '../../lib/cmsValidation';
import {
  PORTFOLIO_BUCKET,
  buildPortfolioStoragePath,
  getPortfolioImageUrl,
  getSupabaseClient,
  validateImageFile,
} from '../../lib/supabase';
import type { PortfolioItem } from '../../types/cms';
import type { StudioDiscipline } from '../../types/content';
import { ImageSlot } from '../brand/ImageSlot';
import { Button } from '../ui/Button';
import { InlineStatus } from '../ui/InlineStatus';

interface PortfolioManagerProps {
  items: PortfolioItem[];
  disciplines: StudioDiscipline[];
  onRefresh: () => Promise<void>;
  onDirtyChange: (dirty: boolean) => void;
}

interface PortfolioFormState {
  id: string | null;
  title: string;
  client: string;
  discipline: string;
  description: string;
  imagePath: string;
  externalUrl: string;
  published: boolean;
}

const INPUT_CLASS =
  'w-full min-h-[44px] border border-[var(--border-strong)] bg-[var(--input-bg)] px-3.5 py-2.5 text-sm text-[var(--input-text)] placeholder:text-[var(--text-subtle)] df-input-focus focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-2';

const ACTION_BTN_CLASS =
  'inline-flex min-h-[40px] min-w-[40px] items-center justify-center border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--link-accent)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

function formatTimestamp(iso: string): string {
  if (!iso) return 'Not saved';
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function PortfolioManager({
  items,
  disciplines,
  onRefresh,
  onDirtyChange,
}: PortfolioManagerProps) {
  const defaultDiscipline = disciplines[0]?.id ?? 'photography';

  const makeEmptyForm = (): PortfolioFormState => ({
    id: null,
    title: '',
    client: '',
    discipline: defaultDiscipline,
    description: '',
    imagePath: '',
    externalUrl: '',
    published: true,
  });

  const [editing, setEditing] = useState<PortfolioFormState | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<{
    variant: 'success' | 'error' | 'info';
    title: string;
    message: string;
  } | null>(null);

  const disciplineOptions = [
    ...disciplines.map((d) => ({ value: d.id, label: d.title })),
    { value: 'general', label: 'General / Multi-Discipline' },
  ];

  const startCreate = () => {
    setEditing(makeEmptyForm());
    setFormErrors({});
    setStatusBanner(null);
    onDirtyChange(true);
  };

  const startEdit = (item: PortfolioItem) => {
    setEditing({
      id: item.id,
      title: item.title,
      client: item.client,
      discipline: item.discipline,
      description: item.description,
      imagePath: item.imagePath,
      externalUrl: item.externalUrl ?? '',
      published: item.published,
    });
    setFormErrors({});
    setStatusBanner(null);
    onDirtyChange(true);
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormErrors({});
    onDirtyChange(false);
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editing) return;

    const validation = await validateImageFile(file);
    if (!validation.ok) {
      setFormErrors((prev) => ({ ...prev, image: validation.error }));
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    setUploading(true);
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.image;
      return next;
    });

    try {
      const storagePath = buildPortfolioStoragePath(validation.extension);
      const { error } = await supabase.storage
        .from(PORTFOLIO_BUCKET)
        .upload(storagePath, file, {
          contentType: validation.mimeType,
          cacheControl: '3600',
          upsert: false,
        });
      if (error) throw error;

      setEditing((prev) => (prev ? { ...prev, imagePath: storagePath } : prev));
      onDirtyChange(true);
      setStatusBanner({
        variant: 'success',
        title: 'Image uploaded',
        message: 'Image stored in portfolio-media bucket. Save the item to persist changes.',
      });
    } catch (err) {
      setFormErrors((prev) => ({
        ...prev,
        image: err instanceof Error ? err.message : 'Unable to upload image.',
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleSaveItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const errors = validatePortfolioDraft({
      title: editing.title,
      discipline: editing.discipline,
      externalUrl: editing.externalUrl,
    });
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    setBusy(true);
    setStatusBanner(null);
    try {
      const payload = {
        title: editing.title.trim(),
        client: editing.client.trim(),
        discipline: editing.discipline,
        description: editing.description.trim(),
        image_path: editing.imagePath.trim(),
        external_url: editing.externalUrl.trim() || null,
        published: editing.published,
      };

      if (editing.id) {
        const { error } = await supabase
          .from('portfolio_items')
          .update(payload)
          .eq('id', editing.id);
        if (error) throw error;
      } else {
        const maxOrder = items.reduce((max, item) => Math.max(max, item.sortOrder), -1);
        const { error } = await supabase.from('portfolio_items').insert({
          ...payload,
          sort_order: maxOrder + 1,
        });
        if (error) throw error;
      }

      await onRefresh();
      setEditing(null);
      onDirtyChange(false);
      setStatusBanner({
        variant: 'success',
        title: 'Portfolio item saved',
        message: editing.published
          ? 'Published to DF. Studio Selected Work.'
          : 'Saved as unpublished (hidden from the public site).',
      });
    } catch (err) {
      setStatusBanner({
        variant: 'error',
        title: 'Save failed',
        message: err instanceof Error ? err.message : 'Unable to save portfolio item.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleTogglePublished = async (item: PortfolioItem) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setBusy(true);
    setStatusBanner(null);
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .update({ published: !item.published })
        .eq('id', item.id);
      if (error) throw error;
      await onRefresh();
    } catch (err) {
      setStatusBanner({
        variant: 'error',
        title: 'Update failed',
        message: err instanceof Error ? err.message : 'Unable to update publication status.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleReorder = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const current = items[index];
    const swap = items[targetIndex];
    const currentOrder = current.sortOrder === swap.sortOrder ? index : current.sortOrder;
    const swapOrder = current.sortOrder === swap.sortOrder ? targetIndex : swap.sortOrder;

    setBusy(true);
    setStatusBanner(null);
    try {
      const [r1, r2] = await Promise.all([
        supabase.from('portfolio_items').update({ sort_order: swapOrder }).eq('id', current.id),
        supabase.from('portfolio_items').update({ sort_order: currentOrder }).eq('id', swap.id),
      ]);
      if (r1.error) throw r1.error;
      if (r2.error) throw r2.error;
      await onRefresh();
    } catch (err) {
      setStatusBanner({
        variant: 'error',
        title: 'Reorder failed',
        message: err instanceof Error ? err.message : 'Unable to update item order.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (item: PortfolioItem) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setBusy(true);
    setStatusBanner(null);
    try {
      const { error } = await supabase.from('portfolio_items').delete().eq('id', item.id);
      if (error) throw error;

      if (item.imagePath && !item.imagePath.startsWith('http')) {
        await supabase.storage.from(PORTFOLIO_BUCKET).remove([item.imagePath]);
      }

      setConfirmDeleteId(null);
      if (editing?.id === item.id) {
        setEditing(null);
        onDirtyChange(false);
      }
      await onRefresh();
      setStatusBanner({
        variant: 'success',
        title: 'Deleted',
        message: `"${item.title}" has been removed.`,
      });
    } catch (err) {
      setStatusBanner({
        variant: 'error',
        title: 'Delete failed',
        message: err instanceof Error ? err.message : 'Unable to delete portfolio item.',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="df-card-surface df-frame-l p-4 sm:p-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Selected Work (Portfolio)
          </h2>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl">
            Add, reorder, publish, and upload visuals for client work. When at least one published
            item exists, DF. Studio displays the Selected Work gallery and populates matching
            discipline frames.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/studio"
            className="inline-flex min-h-[44px] items-center gap-2 border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)] hover:border-[var(--link-accent)]"
          >
            <span>View DF. Studio</span>
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>

          {!editing && (
            <Button type="button" variant="gradient" onClick={startCreate}>
              <Plus aria-hidden="true" className="h-4 w-4" />
              <span>Add Work Item</span>
            </Button>
          )}
        </div>
      </div>

      {statusBanner && (
        <InlineStatus variant={statusBanner.variant} title={statusBanner.title}>
          {statusBanner.message}
        </InlineStatus>
      )}

      {/* Create / Edit Drawer Form */}
      {editing && (
        <form onSubmit={handleSaveItem} noValidate className="df-card-surface p-4 sm:p-6 space-y-5">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-3">
            <h3 className="text-lg font-extrabold text-[var(--text-primary)]">
              {editing.id ? 'Edit Portfolio Item' : 'New Portfolio Item'}
            </h3>
            <button
              type="button"
              onClick={cancelEdit}
              className="min-h-[40px] px-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="pf-title" className="block text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)]">
                Title <span className="text-[var(--eyebrow-magenta)]">*</span>
              </label>
              <input
                id="pf-title"
                type="text"
                maxLength={160}
                value={editing.title}
                onChange={(e) => {
                  setEditing({ ...editing, title: e.target.value });
                  onDirtyChange(true);
                }}
                className={INPUT_CLASS}
              />
              {formErrors.title && (
                <p role="alert" className="text-xs font-semibold text-[var(--magenta)]">
                  {formErrors.title}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pf-client" className="block text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)]">
                Client / Brand
              </label>
              <input
                id="pf-client"
                type="text"
                maxLength={160}
                value={editing.client}
                onChange={(e) => {
                  setEditing({ ...editing, client: e.target.value });
                  onDirtyChange(true);
                }}
                className={INPUT_CLASS}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pf-discipline" className="block text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)]">
                Discipline <span className="text-[var(--eyebrow-magenta)]">*</span>
              </label>
              <select
                id="pf-discipline"
                value={editing.discipline}
                onChange={(e) => {
                  setEditing({ ...editing, discipline: e.target.value });
                  onDirtyChange(true);
                }}
                className={INPUT_CLASS}
              >
                {disciplineOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pf-url" className="block text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)]">
                External Link (Optional)
              </label>
              <input
                id="pf-url"
                type="url"
                placeholder="https://"
                value={editing.externalUrl}
                onChange={(e) => {
                  setEditing({ ...editing, externalUrl: e.target.value });
                  onDirtyChange(true);
                }}
                className={INPUT_CLASS}
              />
              {formErrors.externalUrl && (
                <p role="alert" className="text-xs font-semibold text-[var(--magenta)]">
                  {formErrors.externalUrl}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="pf-desc" className="block text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)]">
              Description
            </label>
            <textarea
              id="pf-desc"
              rows={3}
              maxLength={2000}
              value={editing.description}
              onChange={(e) => {
                setEditing({ ...editing, description: e.target.value });
                onDirtyChange(true);
              }}
              className="w-full border border-[var(--border-strong)] bg-[var(--input-bg)] px-3.5 py-2.5 text-sm text-[var(--input-text)] placeholder:text-[var(--text-subtle)] df-input-focus focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-2"
            />
          </div>

          {/* Image Upload */}
          <div className="grid gap-5 sm:grid-cols-12 items-start border-t border-[var(--border-subtle)] pt-4">
            <div className="sm:col-span-5">
              <ImageSlot
                src={getPortfolioImageUrl(editing.imagePath)}
                aspectRatio="4/3"
                shotDescription="Preview image"
                alt={editing.title || 'Portfolio preview'}
                tone="dark"
                badgeLabel=""
              />
            </div>

            <div className="sm:col-span-7 space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)]">
                Work Visual (JPEG, PNG, or WebP · Max 5 MB)
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex min-h-[44px] items-center gap-2 border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)] hover:border-[var(--link-accent)] cursor-pointer">
                  <Upload aria-hidden="true" className="h-4 w-4" />
                  <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploading || busy}
                    onChange={(e) => void handleImageUpload(e)}
                    className="sr-only"
                  />
                </label>

                {editing.imagePath && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing({ ...editing, imagePath: '' });
                      onDirtyChange(true);
                    }}
                    className="min-h-[44px] px-3 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    Clear image
                  </button>
                )}
              </div>

              {editing.imagePath && (
                <p className="text-xs text-[var(--text-muted)] break-all">
                  Stored path: <code>{editing.imagePath}</code>
                </p>
              )}

              {formErrors.image && (
                <p role="alert" className="text-xs font-semibold text-[var(--magenta)]">
                  {formErrors.image}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-4">
            <label className="flex min-h-[44px] items-center gap-3 text-sm font-semibold text-[var(--text-primary)] cursor-pointer">
              <input
                type="checkbox"
                checked={editing.published}
                onChange={(e) => {
                  setEditing({ ...editing, published: e.target.checked });
                  onDirtyChange(true);
                }}
                className="h-4 w-4 accent-[var(--electric-blue)]"
              />
              <span>Published on live DF. Studio page</span>
            </label>

            <div className="flex items-center gap-3">
              <Button type="button" variant="secondary" disabled={busy} onClick={cancelEdit}>
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={busy || uploading}>
                {busy ? 'Saving...' : editing.id ? 'Save Changes' : 'Create Work Item'}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Existing Portfolio List */}
      {items.length === 0 ? (
        <div className="df-card-surface p-6 text-center space-y-3">
          <p className="text-base font-bold text-[var(--text-primary)]">
            No portfolio items added yet.
          </p>
          <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
            DF. Studio shows its default framing until at least one portfolio item is published.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((item, idx) => {
            const imgUrl = getPortfolioImageUrl(item.imagePath);
            const discLabel =
              disciplineOptions.find((d) => d.value === item.discipline)?.label ?? item.discipline;

            return (
              <li key={item.id} className="df-card-surface p-4 sm:p-5 grid gap-4 sm:grid-cols-12 items-start">
                <div className="sm:col-span-3">
                  <ImageSlot
                    src={imgUrl}
                    aspectRatio="4/3"
                    shotDescription={item.title}
                    alt={item.title}
                    tone="dark"
                    badgeLabel=""
                  />
                </div>

                <div className="sm:col-span-9 flex flex-col justify-between gap-4 min-w-0">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-[var(--text-muted)] tabular-nums">
                      <span>{String(idx + 1).padStart(2, '0')}</span>
                      <span aria-hidden="true"> · </span>
                      <span className="uppercase tracking-[0.12em] text-[var(--eyebrow-magenta)]">
                        {discLabel}
                      </span>
                      {item.client && (
                        <>
                          <span aria-hidden="true"> · </span>
                          <span>{item.client}</span>
                        </>
                      )}
                      <span aria-hidden="true"> · </span>
                      <strong
                        className={
                          item.published
                            ? 'text-[var(--text-primary)]'
                            : 'text-[var(--text-muted)]'
                        }
                      >
                        {item.published ? 'Published' : 'Unpublished'}
                      </strong>
                    </p>

                    <h3 className="text-xl font-extrabold text-[var(--text-primary)] break-words">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <p className="text-xs text-[var(--text-muted)] tabular-nums">
                      Updated {formatTimestamp(item.updatedAt)}
                      {item.updatedBy ? ` · ${item.updatedBy}` : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
                    <button
                      type="button"
                      disabled={busy || idx === 0}
                      aria-label={`Move ${item.title} up`}
                      onClick={() => void handleReorder(idx, -1)}
                      className={ACTION_BTN_CLASS}
                    >
                      <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={busy || idx === items.length - 1}
                      aria-label={`Move ${item.title} down`}
                      onClick={() => void handleReorder(idx, 1)}
                      className={ACTION_BTN_CLASS}
                    >
                      <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleTogglePublished(item)}
                      className={ACTION_BTN_CLASS}
                    >
                      {item.published ? (
                        <>
                          <EyeOff aria-hidden="true" className="mr-1.5 h-3.5 w-3.5" />
                          <span>Unpublish</span>
                        </>
                      ) : (
                        <>
                          <Eye aria-hidden="true" className="mr-1.5 h-3.5 w-3.5" />
                          <span>Publish</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => startEdit(item)}
                      className={ACTION_BTN_CLASS}
                    >
                      <Pencil aria-hidden="true" className="mr-1.5 h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>

                    {confirmDeleteId !== item.id ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setConfirmDeleteId(item.id)}
                        className={ACTION_BTN_CLASS}
                      >
                        <Trash2 aria-hidden="true" className="mr-1.5 h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    ) : (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void handleDelete(item)}
                          className="min-h-[40px] border border-[var(--magenta)] bg-[var(--magenta)] px-3 text-xs font-bold text-[var(--near-black)] cursor-pointer"
                        >
                          Confirm Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="min-h-[40px] border border-[var(--border-strong)] px-3 text-xs font-semibold text-[var(--text-primary)] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
