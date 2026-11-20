const INTRO_SEEN_KEY = 'df-intro-seen';

export function isIntroSeen(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, '1');
  } catch {
    // Ignore storage access errors in restricted privacy contexts
  }
}

export function clearIntroSeen(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(INTRO_SEEN_KEY);
  } catch {
    // Ignore storage access errors
  }
}

export function isInitialRootUrl(): boolean {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash;
  return hash === '' || hash === '#' || hash === '#/';
}

let cachedWebGLSupported: boolean | null = null;

export function isWebGLSupported(): boolean {
  if (cachedWebGLSupported !== null) return cachedWebGLSupported;
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'));
    cachedWebGLSupported = Boolean(gl);
    return cachedWebGLSupported;
  } catch {
    cachedWebGLSupported = false;
    return false;
  }
}
