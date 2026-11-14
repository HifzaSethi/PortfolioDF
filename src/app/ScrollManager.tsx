import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTE_META } from '../config/seo';
import { scrollToTop } from '../lib/scroll';

export function ScrollManager() {
  const { pathname } = useLocation();
  const isFirstMount = useRef(true);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    scrollToTop();

    const meta = ROUTE_META[pathname] ?? ROUTE_META['/404'];
    setAnnouncement(`Navigated to ${meta.title}`);

    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    // Move focus to main heading (or main landmark) on route transitions for screen readers/keyboard
    const timer = window.setTimeout(() => {
      const h1 = document.querySelector<HTMLElement>('main h1');
      if (h1) {
        if (!h1.hasAttribute('tabindex')) {
          h1.setAttribute('tabindex', '-1');
        }
        h1.focus({ preventScroll: true });
      } else {
        document.getElementById('main-content')?.focus({ preventScroll: true });
      }
    }, 60);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {announcement}
    </div>
  );
}
