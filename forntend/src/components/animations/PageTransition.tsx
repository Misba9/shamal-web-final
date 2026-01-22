import { useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div
      className={cn(
        'page-transition-wrapper',
        isTransitioning && !prefersReducedMotion && 'page-transition-entering',
        !isTransitioning && !prefersReducedMotion && 'page-transition-entered',
        className
      )}
    >
      {children}
    </div>
  );
}
