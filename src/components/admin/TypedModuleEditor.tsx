import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Plus,
  RotateCcw,
  Save,
  Send,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FieldSchema, ModuleSchema } from '../../lib/contentSchemas';
import { sanitizeAppOrExternalPath, validateSiteSettingsInput } from '../../lib/cmsValidation';
import type { SiteContentRecord, SiteSettingsContent } from '../../types/cms';
import { Button } from '../ui/Button';
import { InlineStatus } from '../ui/InlineStatus';

interface TypedModuleEditorProps<T extends object> {
  schema: ModuleSchema;
  defaultValue: T;
  publishedRecord: SiteContentRecord<T> | null;
  draftRecord: SiteContentRecord<T> | null;
  saving: boolean;
  onSaveDraft: (value: T) => Promise<void>;
  onPublish: (value: T) => Promise<void>;
  onDirtyChange: (dirty: boolean) => void;
}

const INPUT_CLASS =
  'w-full min-h-[44px] border border-[var(--border-strong)] bg-[var(--input-bg)] px-3.5 py-2.5 text-sm text-[var(--input-text)] placeholder:text-[var(--text-subtle)] df-input-focus focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-2';

const TEXTAREA_CLASS =
  'w-full border border-[var(--border-strong)] bg-[var(--input-bg)] px-3.5 py-2.5 text-sm text-[var(--input-text)] placeholder:text-[var(--text-subtle)] df-input-focus focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-2';

const ACTION_BTN_CLASS =
  'inline-flex min-h-[40px] min-w-[40px] items-center justify-center border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--link-accent)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

function cloneDeep<V>(val: V): V {
  return JSON.parse(JSON.stringify(val)) as V;
}

function formatTimestamp(iso: string | undefined | null): string {
  if (!iso) return 'Not yet saved';
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

function getValueAtPath(root: unknown, path: string[]): unknown {
  let cursor: unknown = root;
  for (const seg of path) {
    if (cursor === null || typeof cursor !== 'object') return undefined;
    cursor = (cursor as Record<string, unknown>)[seg];
  }
  return cursor;
}

function setValueAtPath<T>(root: T, path: string[], nextValue: unknown): T {
  const copy = cloneDeep(root) as Record<string, unknown>;
  if (path.length === 0) return nextValue as T;
  let cursor: Record<string, unknown> = copy;
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i];
    const current = cursor[key];
    if (Array.isArray(current)) {
      cursor[key] = [...current];
    } else if (current && typeof current === 'object') {
      cursor[key] = { ...(current as Record<string, unknown>) };
    } else {
      cursor[key] = {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[path[path.length - 1]] = nextValue;
  return copy as T;
}

function validateAgainstSchema(
  fields: FieldSchema[],
  data: unknown,
  prefix: string[],
  errors: Record<string, string>
): void {
  if (!data || typeof data !== 'object') return;
  const obj = data as Record<string, unknown>;

  for (const field of fields) {
    const path = [...prefix, field.key];
    const pathKey = path.join('.');
    const val = obj[field.key];

    if (
      field.required &&
      (field.type === 'string' ||
        field.type === 'textarea' ||
        field.type === 'email' ||
        field.type === 'phone' ||
        field.type === 'url')
    ) {
      if (typeof val !== 'string' || !val.trim()) {
        errors[pathKey] = `${field.label} is required.`;
        continue;
      }
    }

    if (field.key === 'path' && typeof val === 'string' && val.trim()) {
      if (!sanitizeAppOrExternalPath(val)) {
        errors[pathKey] = `${field.label} must start with / or https://.`;
      }
    }

    if (field.type === 'object' && field.fields) {
      validateAgainstSchema(field.fields, val ?? {}, path, errors);
    } else if (field.type === 'objectList' && field.fields && Array.isArray(val)) {
      val.forEach((item, idx) => {
        validateAgainstSchema(field.fields ?? [], item, [...path, String(idx)], errors);
      });
    }
  }
}

export function TypedModuleEditor<T extends object>({
  schema,
  defaultValue,
  publishedRecord,
  draftRecord,
  saving,
  onSaveDraft,
  onPublish,
  onDirtyChange,
}: TypedModuleEditorProps<T>) {
  const initialSource = draftRecord?.value ?? publishedRecord?.value ?? defaultValue;
  const [formValue, setFormValue] = useState<T>(() => cloneDeep(initialSource));
  const [baselineJson, setBaselineJson] = useState<string>(() => JSON.stringify(initialSource));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [statusBanner, setStatusBanner] = useState<{
    variant: 'success' | 'error' | 'info';
    title: string;
    message: string;
  } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const nextSource = draftRecord?.value ?? publishedRecord?.value ?? defaultValue;
    setFormValue(cloneDeep(nextSource));
    setBaselineJson(JSON.stringify(nextSource));
    setFieldErrors({});
    setConfirmReset(false);
    onDirtyChange(false);
  }, [schema.key, draftRecord, publishedRecord, defaultValue, onDirtyChange]);

  const updateValue = (next: T) => {
    setFormValue(next);
    const dirty = JSON.stringify(next) !== baselineJson;
    onDirtyChange(dirty);
    if (statusBanner) setStatusBanner(null);
  };

  const runValidation = (candidate: T): Record<string, string> => {
    const errors: Record<string, string> = {};
    validateAgainstSchema(schema.fields, candidate, [], errors);
    if (schema.key === 'site_settings') {
      Object.assign(errors, validateSiteSettingsInput(candidate as unknown as SiteSettingsContent));
    }
    return errors;
  };

  const handleAction = async (mode: 'draft' | 'publish') => {
    const errors = runValidation(formValue);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatusBanner({
        variant: 'error',
        title: 'Check highlighted fields',
        message: 'Please fix the validation errors below before saving.',
      });
      return;
    }

    try {
      if (mode === 'draft') {
        await onSaveDraft(formValue);
        setStatusBanner({
          variant: 'success',
          title: 'Draft saved',
          message: 'Draft saved privately. Public visitors continue to see published content.',
        });
      } else {
        await onPublish(formValue);
        setStatusBanner({
          variant: 'success',
          title: 'Published live',
          message: 'Changes are now live on the public site.',
        });
      }
      setBaselineJson(JSON.stringify(formValue));
      onDirtyChange(false);
    } catch (err) {
      setStatusBanner({
        variant: 'error',
        title: 'Save failed',
        message: err instanceof Error ? err.message : 'Unable to save content to Supabase.',
      });
    }
  };

  const handleResetToDefault = () => {
    const resetVal = cloneDeep(defaultValue);
    updateValue(resetVal);
    setFieldErrors({});
    setConfirmReset(false);
    setStatusBanner({
      variant: 'info',
      title: 'Defaults loaded in editor',
      message:
        'Built-in defaults are loaded above. Click "Publish Live" or "Save Draft" to store this reset.',
    });
  };

  const toggleCollapse = (nodeKey: string) => {
    setCollapsedNodes((prev) => ({
      ...prev,
      [nodeKey]: prev[nodeKey] === undefined ? false : !prev[nodeKey],
    }));
  };

  const renderField = (field: FieldSchema, path: string[]) => {
    const pathKey = path.join('.');
    const error = fieldErrors[pathKey];
    const current = getValueAtPath(formValue, path);

    if (field.type === 'object' && field.fields) {
      return (
        <fieldset
          key={pathKey}
          className="df-card-surface df-ambient p-4 sm:p-6 space-y-5"
        >
          <legend className="px-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
            {field.label}
          </legend>
          <div className="space-y-5">
            {field.fields.map((child) => renderField(child, [...path, child.key]))}
          </div>
        </fieldset>
      );
    }

    if (field.type === 'stringList') {
      const items = Array.isArray(current) ? (current as string[]) : [];
      return (
        <div key={pathKey} className="space-y-3 border-t border-[var(--border-subtle)] pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                {field.label} ({items.length})
              </p>
              {field.hint && <p className="text-xs text-[var(--text-muted)]">{field.hint}</p>}
            </div>
            <button
              type="button"
              onClick={() => updateValue(setValueAtPath(formValue, path, [...items, '']))}
              className="inline-flex min-h-[40px] items-center gap-1.5 border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3 text-xs font-bold text-[var(--text-primary)] hover:border-[var(--link-accent)] cursor-pointer"
            >
              <Plus aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Add item</span>
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)]">No items in this list.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li key={`${pathKey}-${idx}`} className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="w-6 shrink-0 text-xs font-bold tabular-nums text-[var(--text-muted)]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <input
                      type="text"
                      aria-label={`${field.label} item ${idx + 1}`}
                      value={typeof item === 'string' ? item : ''}
                      onChange={(e) => {
                        const next = [...items];
                        next[idx] = e.target.value;
                        updateValue(setValueAtPath(formValue, path, next));
                      }}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 pl-8 sm:pl-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      aria-label={`Move ${field.label} item ${idx + 1} up`}
                      onClick={() => {
                        if (idx === 0) return;
                        const next = [...items];
                        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                        updateValue(setValueAtPath(formValue, path, next));
                      }}
                      className={ACTION_BTN_CLASS}
                    >
                      <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      aria-label={`Move ${field.label} item ${idx + 1} down`}
                      onClick={() => {
                        if (idx === items.length - 1) return;
                        const next = [...items];
                        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                        updateValue(setValueAtPath(formValue, path, next));
                      }}
                      className={ACTION_BTN_CLASS}
                    >
                      <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${field.label} item ${idx + 1}`}
                      onClick={() => {
                        const next = items.filter((_, i) => i !== idx);
                        updateValue(setValueAtPath(formValue, path, next));
                      }}
                      className={ACTION_BTN_CLASS}
                    >
                      <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    if (field.type === 'objectList' && field.fields) {
      const items = Array.isArray(current) ? (current as Array<Record<string, unknown>>) : [];
      return (
        <div key={pathKey} className="space-y-4 border-t border-[var(--border-subtle)] pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
                {field.label} ({items.length})
              </p>
              {field.hint && <p className="text-xs text-[var(--text-muted)]">{field.hint}</p>}
            </div>
            <button
              type="button"
              onClick={() => {
                const newItem = field.createEmptyItem ? field.createEmptyItem() : {};
                updateValue(setValueAtPath(formValue, path, [...items, newItem]));
              }}
              className="inline-flex min-h-[44px] items-center gap-2 border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 text-xs font-bold text-[var(--text-primary)] hover:border-[var(--link-accent)] cursor-pointer"
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              <span>Add Entry</span>
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No entries yet.</p>
          ) : (
            <div className="space-y-3">
              {items.map((item, idx) => {
                const itemNodeKey = `${pathKey}.${idx}`;
                // Collapse multi-field list cards by default when there are multiple items
                const isCollapsed =
                  collapsedNodes[itemNodeKey] ?? (items.length > 2 && field.key !== 'socialLinks');
                const headingText =
                  field.itemLabelKey && typeof item[field.itemLabelKey] === 'string'
                    ? (item[field.itemLabelKey] as string).trim() || `Item ${idx + 1}`
                    : `Item ${idx + 1}`;

                return (
                  <div
                    key={itemNodeKey}
                    className="df-card-surface p-3.5 sm:p-5 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCollapse(itemNodeKey)}
                        aria-expanded={!isCollapsed}
                        className="flex min-h-[40px] flex-1 min-w-0 items-center gap-2 text-left cursor-pointer"
                      >
                        {isCollapsed ? (
                          <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                        ) : (
                          <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                        )}
                        <span className="text-xs font-bold tabular-nums text-[var(--eyebrow-magenta)] shrink-0">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="truncate text-sm font-bold text-[var(--text-primary)]">
                          {headingText}
                        </span>
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          aria-label={`Move ${headingText} up`}
                          onClick={() => {
                            if (idx === 0) return;
                            const next = [...items];
                            [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                            updateValue(setValueAtPath(formValue, path, next));
                          }}
                          className={ACTION_BTN_CLASS}
                        >
                          <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === items.length - 1}
                          aria-label={`Move ${headingText} down`}
                          onClick={() => {
                            if (idx === items.length - 1) return;
                            const next = [...items];
                            [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                            updateValue(setValueAtPath(formValue, path, next));
                          }}
                          className={ACTION_BTN_CLASS}
                        >
                          <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove ${headingText}`}
                          onClick={() => {
                            const next = items.filter((_, i) => i !== idx);
                            updateValue(setValueAtPath(formValue, path, next));
                          }}
                          className={ACTION_BTN_CLASS}
                        >
                          <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {!isCollapsed && (
                      <div className="space-y-4 border-t border-[var(--border-subtle)] pt-4">
                        {field.fields?.map((subField) =>
                          renderField(subField, [...path, String(idx), subField.key])
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const inputId = `field-${pathKey.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

    if (field.type === 'boolean') {
      return (
        <label
          key={pathKey}
          htmlFor={inputId}
          className="flex min-h-[44px] items-center gap-3 text-sm font-semibold text-[var(--text-primary)] cursor-pointer"
        >
          <input
            id={inputId}
            type="checkbox"
            checked={Boolean(current)}
            onChange={(e) => updateValue(setValueAtPath(formValue, path, e.target.checked))}
            className="h-4 w-4 accent-[var(--electric-blue)]"
          />
          <span>{field.label}</span>
        </label>
      );
    }

    if (field.type === 'select' && field.options) {
      return (
        <div key={pathKey} className="space-y-1.5">
          <label htmlFor={inputId} className="block text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)]">
            {field.label}
          </label>
          <select
            id={inputId}
            value={typeof current === 'string' ? current : ''}
            onChange={(e) => updateValue(setValueAtPath(formValue, path, e.target.value))}
            className={INPUT_CLASS}
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    const strValue = typeof current === 'string' ? current : current === null ? '' : String(current ?? '');

    return (
      <div key={pathKey} className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)]"
        >
          {field.label}
          {field.required && (
            <span aria-hidden="true" className="ml-1 text-[var(--eyebrow-magenta)]">
              *
            </span>
          )}
        </label>

        {field.type === 'textarea' ? (
          <textarea
            id={inputId}
            rows={field.rows ?? 3}
            value={strValue}
            placeholder={field.placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            onChange={(e) => updateValue(setValueAtPath(formValue, path, e.target.value))}
            className={TEXTAREA_CLASS}
          />
        ) : (
          <input
            id={inputId}
            type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : field.type === 'phone' ? 'tel' : 'text'}
            value={strValue}
            placeholder={field.placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            onChange={(e) => {
              const nextVal =
                schema.key === 'site_settings' &&
                (field.key === 'email' || field.key === 'phone') &&
                e.target.value.trim() === ''
                  ? null
                  : e.target.value;
              updateValue(setValueAtPath(formValue, path, nextVal));
            }}
            className={INPUT_CLASS}
          />
        )}

        {field.hint && <p className="text-xs text-[var(--text-muted)]">{field.hint}</p>}
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs font-semibold text-[var(--magenta)]">
            {error}
          </p>
        )}
      </div>
    );
  };

  const activeAudit = draftRecord ?? publishedRecord;
  const statusLabel = draftRecord
    ? 'Draft saved (ahead of live)'
    : publishedRecord
      ? 'Published live'
      : 'Using built-in defaults';

  return (
    <div className="space-y-6">
      {/* Header & Metadata */}
      <div className="df-card-surface df-frame-l p-4 sm:p-6 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1.5 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {schema.title}
            </h2>
            <p className="text-sm text-[var(--text-muted)] max-w-2xl">{schema.description}</p>
          </div>
          <Link
            to={schema.livePath}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)] hover:border-[var(--link-accent)]"
          >
            <span>{schema.liveLabel}</span>
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--border-subtle)] pt-3 text-xs text-[var(--text-muted)] tabular-nums">
          <span>
            Status: <strong className="text-[var(--text-primary)]">{statusLabel}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>Last updated: {formatTimestamp(activeAudit?.updatedAt)}</span>
          {activeAudit?.updatedBy && (
            <>
              <span aria-hidden="true">·</span>
              <span>Updated by: {activeAudit.updatedBy}</span>
            </>
          )}
        </div>
      </div>

      {statusBanner && (
        <InlineStatus variant={statusBanner.variant} title={statusBanner.title}>
          {statusBanner.message}
        </InlineStatus>
      )}

      {/* Typed Fields */}
      <div className="space-y-6">
        {schema.fields.map((field) => renderField(field, [field.key]))}
      </div>

      {/* Action Bar */}
      <div className="df-card-surface p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="gradient"
            disabled={saving}
            onClick={() => void handleAction('publish')}
          >
            <Send aria-hidden="true" className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Publish Live'}</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            disabled={saving}
            onClick={() => void handleAction('draft')}
          >
            <Save aria-hidden="true" className="h-4 w-4" />
            <span>Save Draft</span>
          </Button>
        </div>

        <div>
          {!confirmReset ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => setConfirmReset(true)}
              className="inline-flex min-h-[44px] items-center gap-2 px-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Reset to Default</span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                Load built-in defaults?
              </span>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="min-h-[40px] border border-[var(--magenta)] bg-[var(--magenta)] px-3 text-xs font-bold text-[var(--near-black)] cursor-pointer"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-[40px] border border-[var(--border-strong)] px-3 text-xs font-semibold text-[var(--text-primary)] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
