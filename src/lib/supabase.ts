import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const PORTFOLIO_BUCKET = 'portfolio-media';
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? '';
const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ?? '';

function isValidHttpUrl(value: string): boolean {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function isSupabaseConfigured(): boolean {
  return isValidHttpUrl(SUPABASE_URL) && SUPABASE_ANON_KEY.length > 0;
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!cachedClient) {
    cachedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
        storageKey: 'df-admin-auth',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
  }
  return cachedClient;
}

export function getPortfolioImageUrl(imagePath: string | null | undefined): string | null {
  const trimmed = (imagePath ?? '').trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return isValidHttpUrl(trimmed) ? trimmed : null;
  }

  // Reject unsafe schemes or path traversal tokens
  if (/^(javascript|data|vbscript|file):/i.test(trimmed) || trimmed.includes('..')) {
    return null;
  }

  const client = getSupabaseClient();
  if (!client) return null;

  const cleanPath = trimmed.replace(/^\/+/, '');
  const { data } = client.storage.from(PORTFOLIO_BUCKET).getPublicUrl(cleanPath);
  return data?.publicUrl && isValidHttpUrl(data.publicUrl) ? data.publicUrl : null;
}

export type ImageValidationResult =
  | { ok: true; mimeType: (typeof ALLOWED_IMAGE_MIME_TYPES)[number]; extension: 'jpg' | 'png' | 'webp' }
  | { ok: false; error: string };

export async function validateImageFile(file: File): Promise<ImageValidationResult> {
  if (!file) {
    return { ok: false, error: 'Please select an image file.' };
  }

  if (file.size <= 0) {
    return { ok: false, error: 'The selected file is empty.' };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: 'Image must be 5 MB or smaller.' };
  }

  const mime = file.type.toLowerCase();
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(mime as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
    return { ok: false, error: 'Only JPEG, PNG, and WebP images are supported.' };
  }

  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isJpeg = header.length >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const isPng =
    header.length >= 8 &&
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47 &&
    header[4] === 0x0d &&
    header[5] === 0x0a &&
    header[6] === 0x1a &&
    header[7] === 0x0a;
  const isWebp =
    header.length >= 12 &&
    header[0] === 0x52 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x46 &&
    header[8] === 0x57 &&
    header[9] === 0x45 &&
    header[10] === 0x42 &&
    header[11] === 0x50;

  if (mime === 'image/jpeg' && isJpeg) {
    return { ok: true, mimeType: 'image/jpeg', extension: 'jpg' };
  }
  if (mime === 'image/png' && isPng) {
    return { ok: true, mimeType: 'image/png', extension: 'png' };
  }
  if (mime === 'image/webp' && isWebp) {
    return { ok: true, mimeType: 'image/webp', extension: 'webp' };
  }

  return {
    ok: false,
    error: 'File content does not match a valid JPEG, PNG, or WebP image.',
  };
}

export function buildPortfolioStoragePath(extension: 'jpg' | 'png' | 'webp'): string {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `work/${Date.now()}-${randomPart}.${extension}`;
}
