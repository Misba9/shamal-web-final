import { useEffect, useRef, RefObject } from 'react';

interface UseIntersectionAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  animationClass?: string;
  delay?: number;
}

/**
 * Lightweight hook for scroll animations using Intersection Observer
 * More performant than GSAP ScrollTrigger for simple fade/slide animations
 */
export function useIntersectionAnimation<T extends HTMLElement>(
  options: UseIntersectionAnimationOptions = {}
): RefObject<T> {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    animationClass = 'animate-fade-in-up-sm',
    delay = 0,
  } = options;

  const ref = useRef<T>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Apply animation immediately without scroll trigger
      element.classList.add(animationClass);
      element.classList.remove('opacity-0');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => {
                entry.target.classList.add(animationClass);
                entry.target.classList.remove('opacity-0');
              }, delay);
            } else {
              entry.target.classList.add(animationClass);
              entry.target.classList.remove('opacity-0');
            }

            if (triggerOnce && !hasAnimated.current) {
              hasAnimated.current = true;
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove(animationClass);
            entry.target.classList.add('opacity-0');
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, animationClass, delay]);

  return ref;
}

/**
 * Hook for animating children elements with stagger effect
 */
export function useStaggerChildren<T extends HTMLElement>(
  options: UseIntersectionAnimationOptions & { staggerDelay?: number } = {}
): RefObject<T> {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    animationClass = 'animate-fade-in-up-sm',
    staggerDelay = 100,
  } = options;

  const ref = useRef<T>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Apply animation immediately to all children
      const children = Array.from(container.children) as HTMLElement[];
      children.forEach((child) => {
        child.classList.add(animationClass);
        child.classList.remove('opacity-0');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!triggerOnce || !hasAnimated.current)) {
            const children = Array.from(container.children) as HTMLElement[];
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add(animationClass);
                child.classList.remove('opacity-0');
              }, index * staggerDelay);
            });

            if (triggerOnce) {
              hasAnimated.current = true;
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            const children = Array.from(container.children) as HTMLElement[];
            children.forEach((child) => {
              child.classList.remove(animationClass);
              child.classList.add('opacity-0');
            });
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, animationClass, staggerDelay]);

  return ref;
}
