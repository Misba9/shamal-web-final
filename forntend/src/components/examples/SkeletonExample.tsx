import { useState, useEffect } from 'react';
import { ServiceCardSkeleton } from '@/components/ui/skeleton';

/**
 * Example component demonstrating skeleton loaders
 * This shows how to use skeleton loaders while data is loading
 */
export function ServicesSectionWithSkeleton() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-4">
            {[...Array(6)].map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Render actual content when loaded
  return null; // Replace with actual ServicesSection
}
