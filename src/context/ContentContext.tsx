import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getDefaultContentBundle,
  mapPortfolioRow,
  normalizeIndustries,
  normalizePerformanceMarketing,
  normalizeSearchIntelligence,
  normalizeSiteSettings,
  normalizeStudio,
} from '../lib/cmsValidation';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { ContentBundle, ContentKey, PortfolioItem } from '../types/cms';

interface ContentContextValue {
  content: ContentBundle;
  defaults: ContentBundle;
  portfolioItems: PortfolioItem[];
  supabaseConfigured: boolean;
  isHydrated: boolean;
  refreshPublishedContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const defaults = useMemo(() => getDefaultContentBundle(), []);
  const supabaseConfigured = isSupabaseConfigured();

  const [content, setContent] = useState<ContentBundle>(defaults);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(!supabaseConfigured);

  const refreshPublishedContent = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setIsHydrated(true);
      return;
    }

    try {
      const [contentRes, portfolioRes] = await Promise.all([
        supabase
          .from('site_content')
          .select('key, value, status, updated_at')
          .eq('status', 'published'),
        supabase
          .from('portfolio_items')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
      ]);

      if (!contentRes.error && Array.isArray(contentRes.data)) {
        const nextBundle = getDefaultContentBundle();
        for (const row of contentRes.data) {
          const key = row.key as ContentKey;
          if (key === 'site_settings') {
            nextBundle.siteSettings = normalizeSiteSettings(row.value, defaults.siteSettings);
          } else if (key === 'performance_marketing') {
            nextBundle.performanceMarketing = normalizePerformanceMarketing(
              row.value,
              defaults.performanceMarketing
            );
          } else if (key === 'search_intelligence') {
            nextBundle.searchIntelligence = normalizeSearchIntelligence(
              row.value,
              defaults.searchIntelligence
            );
          } else if (key === 'studio') {
            nextBundle.studio = normalizeStudio(row.value, defaults.studio);
          } else if (key === 'industries') {
            nextBundle.industries = normalizeIndustries(row.value, defaults.industries);
          }
        }
        setContent(nextBundle);
      }

      if (!portfolioRes.error && Array.isArray(portfolioRes.data)) {
        setPortfolioItems(
          portfolioRes.data.map((row) => mapPortfolioRow(row as Record<string, unknown>))
        );
      }
    } catch {
      // Fall back silently to built-in defaults if network/Supabase is unavailable
    } finally {
      setIsHydrated(true);
    }
  }, [defaults]);

  useEffect(() => {
    void refreshPublishedContent();
  }, [refreshPublishedContent]);

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      defaults,
      portfolioItems,
      supabaseConfigured,
      isHydrated,
      refreshPublishedContent,
    }),
    [content, defaults, portfolioItems, supabaseConfigured, isHydrated, refreshPublishedContent]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return ctx;
}
