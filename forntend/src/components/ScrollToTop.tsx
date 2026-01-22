import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that scrolls to top on route changes and page refresh
 * Works with both regular scrolling and Lenis smooth scroll
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    // Using instant behavior to ensure immediate scroll
    window.scrollTo(0, 0);
    
    // Also try to reset scroll position on document element and body
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  // Scroll to top on initial page load/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return null;
}
