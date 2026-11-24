import { useCallback, useEffect, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  ArrowLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PortfolioManager } from '../components/admin/PortfolioManager';
import { TypedModuleEditor } from '../components/admin/TypedModuleEditor';
import { TridiMark } from '../components/brand/TridiMark';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Button, LinkButton } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { InlineStatus } from '../components/ui/InlineStatus';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useContent } from '../context/ContentContext';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  mapPortfolioRow,
  normalizeIndustries,
  normalizePerformanceMarketing,
  normalizeSearchIntelligence,
  normalizeSiteSettings,
  normalizeStudio,
} from '../lib/cmsValidation';
import { MODULE_SCHEMAS } from '../lib/contentSchemas';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type {
  ContentKey,
  ContentStatus,
  IndustriesContent,
  PerformanceMarketingContent,
  PortfolioItem,
  SearchIntelligenceContent,
  SiteContentRecord,
  SiteSettingsContent,
  StudioContent,
} from '../types/cms';

type AdminTab = ContentKey | 'portfolio';

const ADMIN_TABS: Array<{ id: AdminTab; label: string }> = [
  { id: 'site_settings', label: 'Site Settings & Contact' },
  { id: 'portfolio', label: 'Selected Work (Portfolio)' },
  { id: 'performance_marketing', label: 'Performance Marketing' },
  { id: 'search_intelligence', label: 'Search Intelligence' },
  { id: 'studio', label: 'DF. Studio' },
  { id: 'industries', label: 'Industries' },
];

const SESSION_IDLE_TIMEOUT_MS = 60 * 60 * 1000; // 60 minutes
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 hours
const LOGIN_TS_STORAGE_KEY = 'df-admin-login-at';

const INPUT_CLASS =
  'w-full min-h-[44px] border border-[var(--border-strong)] bg-[var(--input-bg)] px-3.5 py-2.5 text-sm text-[var(--input-text)] placeholder:text-[var(--text-subtle)] df-input-focus focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-2';

interface AdminContentMap {
  site_settings: {
    published: SiteContentRecord<SiteSettingsContent> | null;
    draft: SiteContentRecord<SiteSettingsContent> | null;
  };
  performance_marketing: {
    published: SiteContentRecord<PerformanceMarketingContent> | null;
    draft: SiteContentRecord<PerformanceMarketingContent> | null;
  };
  search_intelligence: {
    published: SiteContentRecord<SearchIntelligenceContent> | null;
    draft: SiteContentRecord<SearchIntelligenceContent> | null;
  };
  studio: {
    published: SiteContentRecord<StudioContent> | null;
    draft: SiteContentRecord<StudioContent> | null;
  };
  industries: {
    published: SiteContentRecord<IndustriesContent> | null;
    draft: SiteContentRecord<IndustriesContent> | null;
  };
}

function makeEmptyRecordMap(): AdminContentMap {
  return {
    site_settings: { published: null, draft: null },
    performance_marketing: { published: null, draft: null },
    search_intelligence: { published: null, draft: null },
    studio: { published: null, draft: null },
    industries: { published: null, draft: null },
  };
}

export default function AdminPage() {
  usePageMeta('/admin');
  const configured = isSupabaseConfigured();
  const { defaults, refreshPublishedContent } = useContent();

  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!configured);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('site_settings');
  const [pendingTab, setPendingTab] = useState<AdminTab | 'logout' | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [savingModule, setSavingModule] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [records, setRecords] = useState<AdminContentMap>(() => makeEmptyRecordMap());
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  const handleSignOut = useCallback(async (notice?: string) => {
    const supabase = getSupabaseClient();
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(LOGIN_TS_STORAGE_KEY);
      } catch {
        // ignore storage errors
      }
    }
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setIsAdmin(null);
    setIsDirty(false);
    setPendingTab(null);
    setHasLoadedOnce(false);
    setRecords(makeEmptyRecordMap());
    setPortfolioItems([]);
    if (notice) setSessionNotice(notice);
  }, []);

  const checkAdminRole = useCallback(async (activeSession: Session | null): Promise<boolean> => {
    if (!activeSession) {
      setIsAdmin(null);
      return false;
    }

    const appRole = activeSession.user.app_metadata?.role;
    if (appRole === 'admin') {
      setIsAdmin(true);
      return true;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setIsAdmin(false);
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', activeSession.user.id)
        .maybeSingle();

      const allowed = !error && Boolean(data?.user_id);
      setIsAdmin(allowed);
      return allowed;
    } catch {
      setIsAdmin(false);
      return false;
    }
  }, []);

  const loadAdminWorkspace = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setLoadingRecords(true);
    setLoadError(null);

    try {
      const [contentRes, portfolioRes] = await Promise.all([
        supabase.from('site_content').select('id, key, value, status, updated_at, updated_by'),
        supabase
          .from('portfolio_items')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
      ]);

      if (contentRes.error) throw contentRes.error;
      if (portfolioRes.error) throw portfolioRes.error;

      const nextMap = makeEmptyRecordMap();
      for (const row of contentRes.data ?? []) {
        const key = row.key as ContentKey;
        const status = row.status as ContentStatus;
        const baseMeta = {
          id: String(row.id),
          key,
          status,
          updatedAt: String(row.updated_at ?? ''),
          updatedBy: row.updated_by ? String(row.updated_by) : null,
        };

        if (key === 'site_settings') {
          nextMap.site_settings[status] = {
            ...baseMeta,
            value: normalizeSiteSettings(row.value, defaults.siteSettings),
          };
        } else if (key === 'performance_marketing') {
          nextMap.performance_marketing[status] = {
            ...baseMeta,
            value: normalizePerformanceMarketing(row.value, defaults.performanceMarketing),
          };
        } else if (key === 'search_intelligence') {
          nextMap.search_intelligence[status] = {
            ...baseMeta,
            value: normalizeSearchIntelligence(row.value, defaults.searchIntelligence),
          };
        } else if (key === 'studio') {
          nextMap.studio[status] = {
            ...baseMeta,
            value: normalizeStudio(row.value, defaults.studio),
          };
        } else if (key === 'industries') {
          nextMap.industries[status] = {
            ...baseMeta,
            value: normalizeIndustries(row.value, defaults.industries),
          };
        }
      }
      setRecords(nextMap);

      setPortfolioItems(
        (portfolioRes.data ?? []).map((row) => mapPortfolioRow(row as Record<string, unknown>))
      );
      setHasLoadedOnce(true);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : 'Unable to load saved content from Supabase.'
      );
      setHasLoadedOnce(true);
    } finally {
      setLoadingRecords(false);
    }
  }, [defaults]);

  // Initialize Supabase session listener
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    let mounted = true;
    void supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      const initialSession = data.session;
      if (initialSession && typeof window !== 'undefined') {
        const loginAtRaw = window.sessionStorage.getItem(LOGIN_TS_STORAGE_KEY);
        const loginAt = loginAtRaw ? Number(loginAtRaw) : 0;
        if (loginAt > 0 && Date.now() - loginAt > SESSION_MAX_AGE_MS) {
          await handleSignOut('Your admin session expired. Please sign in again.');
          if (mounted) setAuthReady(true);
          return;
        }
        if (!loginAt) {
          window.sessionStorage.setItem(LOGIN_TS_STORAGE_KEY, String(Date.now()));
        }
      }
      setSession(initialSession);
      const allowed = await checkAdminRole(initialSession);
      if (mounted && allowed) {
        await loadAdminWorkspace();
      }
      if (mounted) setAuthReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      if (!nextSession) {
        setIsAdmin(null);
        return;
      }
      void checkAdminRole(nextSession).then((allowed) => {
        if (allowed) {
          void loadAdminWorkspace();
        }
      });
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [checkAdminRole, handleSignOut, loadAdminWorkspace]);

  // Enforce idle timeout + max session age for authenticated admin sessions
  useEffect(() => {
    if (!session) return;

    let idleTimer = window.setTimeout(() => {
      void handleSignOut('Signed out after 60 minutes of inactivity.');
    }, SESSION_IDLE_TIMEOUT_MS);

    const resetIdleTimer = () => {
      window.clearTimeout(idleTimer);
      try {
        const loginAtRaw = window.sessionStorage.getItem(LOGIN_TS_STORAGE_KEY);
        if (loginAtRaw && Date.now() - Number(loginAtRaw) > SESSION_MAX_AGE_MS) {
          void handleSignOut('Your 8-hour admin session expired. Please sign in again.');
          return;
        }
      } catch {
        // ignore storage errors
      }
      idleTimer = window.setTimeout(() => {
        void handleSignOut('Signed out after 60 minutes of inactivity.');
      }, SESSION_IDLE_TIMEOUT_MS);
    };

    const events: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'scroll'];
    for (const ev of events) {
      window.addEventListener(ev, resetIdleTimer, { passive: true });
    }

    return () => {
      window.clearTimeout(idleTimer);
      for (const ev of events) {
        window.removeEventListener(ev, resetIdleTimer);
      }
    };
  }, [session, handleSignOut]);

  // Warn browser tab close/refresh when unsaved changes exist
  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail || !passwordInput) {
      setAuthError('Enter both your admin email and password.');
      return;
    }

    setAuthBusy(true);
    setAuthError(null);
    setSessionNotice(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: passwordInput,
      });
      if (error) throw error;
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(LOGIN_TS_STORAGE_KEY, String(Date.now()));
      }
      setPasswordInput('');
      setSession(data.session);
      const allowed = await checkAdminRole(data.session);
      if (allowed) {
        await loadAdminWorkspace();
      }
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Unable to sign in with those credentials.'
      );
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSaveModule = async (
    key: ContentKey,
    status: ContentStatus,
    value: unknown
  ) => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase is not configured.');

    setSavingModule(true);
    try {
      const { error } = await supabase.from('site_content').upsert(
        {
          key,
          status,
          value,
        },
        { onConflict: 'key,status' }
      );
      if (error) throw error;

      // When publishing, remove any older draft row so the panel shows Published status cleanly
      if (status === 'published') {
        await supabase.from('site_content').delete().eq('key', key).eq('status', 'draft');
        await refreshPublishedContent();
      }

      await loadAdminWorkspace();
    } finally {
      setSavingModule(false);
    }
  };

  const requestTabChange = (nextTab: AdminTab) => {
    if (nextTab === activeTab) return;
    if (isDirty) {
      setPendingTab(nextTab);
      return;
    }
    setActiveTab(nextTab);
  };

  const requestLogout = () => {
    if (isDirty) {
      setPendingTab('logout');
      return;
    }
    void handleSignOut();
  };

  const confirmPendingNavigation = () => {
    if (!pendingTab) return;
    const target = pendingTab;
    setPendingTab(null);
    setIsDirty(false);
    if (target === 'logout') {
      void handleSignOut();
    } else {
      setActiveTab(target);
    }
  };

  const handleRefreshPortfolio = async () => {
    await Promise.all([loadAdminWorkspace(), refreshPublishedContent()]);
  };

  // STATE 1: Setup Needed (missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY)
  if (!configured) {
    return (
      <Section surface="hero-adaptive" withPattern className="py-12 sm:py-20">
        <Container className="max-w-3xl space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <TridiMark size={26} tone="auto" />
              <Eyebrow number="01">Content Admin · Setup Needed</Eyebrow>
            </div>
            <SectionHeading as="h1" size="h1" slanted>
              Connect Supabase to enable content editing.
            </SectionHeading>
            <p className="text-base leading-relaxed text-[var(--text-muted)]">
              This site is currently serving its built-in default content safely with zero
              external dependencies. To sign in and edit site copy, contact details, and portfolio
              work, configure the two public Supabase environment variables.
            </p>
          </div>

          <div className="df-card-surface df-ambient df-frame-l p-5 sm:p-8 space-y-5">
            <h2 className="text-lg font-extrabold text-[var(--text-primary)]">
              Owner Setup Checklist
            </h2>
            <ol className="space-y-3 text-sm text-[var(--text-muted)]">
              <li className="flex gap-3">
                <span className="font-bold tabular-nums text-[var(--eyebrow-magenta)]">01</span>
                <span>Create a Supabase project and run the SQL in <code>supabase/schema.sql</code>.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold tabular-nums text-[var(--eyebrow-magenta)]">02</span>
                <span>
                  Create your admin account in Supabase Authentication (Users) and add its user ID
                  to <code>public.admins</code>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold tabular-nums text-[var(--eyebrow-magenta)]">03</span>
                <span>
                  Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your
                  hosting environment and add your site URL to Supabase Redirect URLs.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold tabular-nums text-[var(--eyebrow-magenta)]">04</span>
                <span>
                  Full plain-language walkthrough is documented in <code>docs/ADMIN_SETUP.md</code>.
                </span>
              </li>
            </ol>

            <div className="pt-2">
              <LinkButton to="/" variant="primary">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                <span>Return to public site</span>
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  // Loading auth session check
  if (!authReady) {
    return (
      <Section surface="off-white" className="py-16">
        <Container className="max-w-md">
          <div className="df-card-surface p-6 text-center text-sm text-[var(--text-muted)]">
            Verifying admin session...
          </div>
        </Container>
      </Section>
    );
  }

  // STATE 2: Login Screen (no public sign-up)
  if (!session) {
    return (
      <Section surface="hero-adaptive" withPattern className="py-12 sm:py-20">
        <Container className="max-w-md space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TridiMark size={24} tone="auto" />
              <Eyebrow number="01">Private Access</Eyebrow>
            </div>
            <SectionHeading as="h1" size="h1">
              DF. Content Admin
            </SectionHeading>
            <p className="text-sm text-[var(--text-muted)]">
              Sign in with an authorized administrator account. Public registration is disabled.
            </p>
          </div>

          {sessionNotice && (
            <InlineStatus variant="info" title="Session ended">
              {sessionNotice}
            </InlineStatus>
          )}

          {authError && (
            <InlineStatus variant="error" title="Sign in unsuccessful">
              {authError}
            </InlineStatus>
          )}

          <form
            onSubmit={handleLoginSubmit}
            noValidate
            className="df-card-surface df-ambient df-frame-l p-5 sm:p-7 space-y-5"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)]"
              >
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)]"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`${INPUT_CLASS} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1 inline-flex h-10 w-10 items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Eye aria-hidden="true" className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              disabled={authBusy}
              className="w-full"
            >
              <Lock aria-hidden="true" className="h-4 w-4" />
              <span>{authBusy ? 'Signing in...' : 'Sign In'}</span>
            </Button>
          </form>

          <div>
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--link-accent)] df-link-sweep"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              <span>Back to Digital Field.</span>
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  // Verifying admin table membership
  if (isAdmin === null) {
    return (
      <Section surface="off-white" className="py-16">
        <Container className="max-w-md">
          <div className="df-card-surface p-6 text-center text-sm text-[var(--text-muted)]">
            Checking administrator authorization...
          </div>
        </Container>
      </Section>
    );
  }

  // STATE 3: Signed in, but NOT in public.admins / app_metadata admin
  if (!isAdmin) {
    return (
      <Section surface="off-white" className="py-12 sm:py-20">
        <Container className="max-w-xl space-y-6">
          <div className="df-card-surface df-frame-l p-5 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-[var(--eyebrow-magenta)]">
              <ShieldAlert aria-hidden="true" className="h-6 w-6 shrink-0" />
              <p className="text-xs font-bold uppercase tracking-[0.16em]">Access Restricted</p>
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">
              This account is not listed as an administrator.
            </h1>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              Database Row Level Security blocks non-admin accounts from saving content or uploading
              media. Ask the project owner to add user ID{' '}
              <code className="break-all">{session.user.id}</code> to{' '}
              <code>public.admins</code> in Supabase.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="button" variant="primary" onClick={() => void handleSignOut()}>
                <LogOut aria-hidden="true" className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
              <LinkButton to="/" variant="secondary">
                <span>View Public Site</span>
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  // STATE 4: Authorized Admin Dashboard
  return (
    <Section surface="off-white" className="py-8 sm:py-12">
      <Container className="space-y-6">
        {/* Top Bar */}
        <div className="df-card-surface p-4 sm:p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1 min-w-0">
            <Eyebrow number="DF.">Content Admin</Eyebrow>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Manage Published Site Content
            </h1>
            <p className="text-xs text-[var(--text-muted)] break-all">
              Signed in as <strong className="text-[var(--text-primary)]">{session.user.email}</strong>
              <span aria-hidden="true"> · </span>
              <span>Session auto-expires after 60m idle or 8h</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center gap-2 border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)] hover:border-[var(--link-accent)]"
            >
              <span>View Live Site</span>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Button type="button" variant="secondary" onClick={requestLogout}>
              <LogOut aria-hidden="true" className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Scope & Guidance */}
        <div className="df-card-surface bg-[var(--bg-tint)] px-4 py-3 text-xs leading-relaxed text-[var(--text-muted)]">
          <strong className="text-[var(--text-primary)]">Editor Scope:</strong> Update contact
          settings, Selected Work portfolio items, and text/lists for Performance Marketing, Search
          Intelligence, DF. Studio, and Industries. New page layouts, new interactive features, and
          code editing remain outside the scope of this panel.
        </div>

        {/* Unsaved Changes Prompt */}
        {isDirty && (
          <InlineStatus variant="info" title="Unsaved changes">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span>
                {pendingTab
                  ? 'You have unsaved edits in the current section. Discard them and continue?'
                  : 'You have unsaved edits in this section. Save Draft or Publish Live before leaving.'}
              </span>
              {pendingTab && (
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={confirmPendingNavigation}
                    className="min-h-[40px] border border-[var(--magenta)] bg-[var(--magenta)] px-3 text-xs font-bold text-[var(--near-black)] cursor-pointer"
                  >
                    Discard &amp; Continue
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingTab(null)}
                    className="min-h-[40px] border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3 text-xs font-semibold text-[var(--text-primary)] cursor-pointer"
                  >
                    Keep Editing
                  </button>
                </div>
              )}
            </div>
          </InlineStatus>
        )}

        {loadError && (
          <InlineStatus variant="error" title="Could not load saved records">
            {loadError}
          </InlineStatus>
        )}

        {/* Responsive Navigation + Active Workspace */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <nav
            aria-label="Content modules"
            className="lg:col-span-3 lg:sticky lg:top-24 df-card-surface p-2 sm:p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5"
          >
            {ADMIN_TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => requestTabChange(tab.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`min-h-[44px] w-full px-3.5 py-2.5 text-left text-xs font-bold tracking-[0.04em] border cursor-pointer transition-colors ${
                    active
                      ? 'bg-[var(--bg-card-active)] text-[var(--text-on-card-active)] border-[var(--magenta)]'
                      : 'bg-transparent text-[var(--text-primary)] border-transparent hover:border-[var(--border-strong)]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="lg:col-span-9 min-w-0">
            {!hasLoadedOnce && loadingRecords ? (
              <div className="df-card-surface p-8 text-center text-sm text-[var(--text-muted)]">
                Loading saved content...
              </div>
            ) : activeTab === 'portfolio' ? (
              <PortfolioManager
                items={portfolioItems}
                disciplines={
                  records.studio.published?.value.disciplines ?? defaults.studio.disciplines
                }
                onRefresh={handleRefreshPortfolio}
                onDirtyChange={setIsDirty}
              />
            ) : activeTab === 'site_settings' ? (
              <TypedModuleEditor
                key="site_settings"
                schema={MODULE_SCHEMAS.site_settings}
                defaultValue={defaults.siteSettings}
                publishedRecord={records.site_settings.published}
                draftRecord={records.site_settings.draft}
                saving={savingModule}
                onSaveDraft={(val) => handleSaveModule('site_settings', 'draft', val)}
                onPublish={(val) => handleSaveModule('site_settings', 'published', val)}
                onDirtyChange={setIsDirty}
              />
            ) : activeTab === 'performance_marketing' ? (
              <TypedModuleEditor
                key="performance_marketing"
                schema={MODULE_SCHEMAS.performance_marketing}
                defaultValue={defaults.performanceMarketing}
                publishedRecord={records.performance_marketing.published}
                draftRecord={records.performance_marketing.draft}
                saving={savingModule}
                onSaveDraft={(val) => handleSaveModule('performance_marketing', 'draft', val)}
                onPublish={(val) => handleSaveModule('performance_marketing', 'published', val)}
                onDirtyChange={setIsDirty}
              />
            ) : activeTab === 'search_intelligence' ? (
              <TypedModuleEditor
                key="search_intelligence"
                schema={MODULE_SCHEMAS.search_intelligence}
                defaultValue={defaults.searchIntelligence}
                publishedRecord={records.search_intelligence.published}
                draftRecord={records.search_intelligence.draft}
                saving={savingModule}
                onSaveDraft={(val) => handleSaveModule('search_intelligence', 'draft', val)}
                onPublish={(val) => handleSaveModule('search_intelligence', 'published', val)}
                onDirtyChange={setIsDirty}
              />
            ) : activeTab === 'studio' ? (
              <TypedModuleEditor
                key="studio"
                schema={MODULE_SCHEMAS.studio}
                defaultValue={defaults.studio}
                publishedRecord={records.studio.published}
                draftRecord={records.studio.draft}
                saving={savingModule}
                onSaveDraft={(val) => handleSaveModule('studio', 'draft', val)}
                onPublish={(val) => handleSaveModule('studio', 'published', val)}
                onDirtyChange={setIsDirty}
              />
            ) : (
              <TypedModuleEditor
                key="industries"
                schema={MODULE_SCHEMAS.industries}
                defaultValue={defaults.industries}
                publishedRecord={records.industries.published}
                draftRecord={records.industries.draft}
                saving={savingModule}
                onSaveDraft={(val) => handleSaveModule('industries', 'draft', val)}
                onPublish={(val) => handleSaveModule('industries', 'published', val)}
                onDirtyChange={setIsDirty}
              />
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
