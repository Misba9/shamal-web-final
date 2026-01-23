import { cn } from '@/lib/utils';
import * as React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('animate-pulse rounded-md bg-muted', className)}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

// Service Card Skeleton
export function ServiceCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-5">
        <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-5 w-5 rounded shrink-0" />
      </div>
    </div>
  );
}

// Blog Card Skeleton
export function BlogCardSkeleton() {
  return (
    <div className="h-full bg-card rounded-2xl border border-border overflow-hidden">
      <Skeleton className="aspect-[3/2] w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3 mt-4" />
      </div>
    </div>
  );
}

// Project Card Skeleton
export function ProjectCardSkeleton() {
  return (
    <div className="h-full bg-card rounded-2xl border border-border overflow-hidden">
      <Skeleton className="aspect-[3/2] w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-1/3 mt-4" />
      </div>
    </div>
  );
}

// Legacy alias for backward compatibility
export const PortfolioCardSkeleton = ProjectCardSkeleton;

export { Skeleton };
