/**
 * Content-shaped skeletons. Uses the `.skeleton` shimmer class from index.css.
 * These replace centered spinners for list/table/card/chart loading.
 */

export default function Skeleton({ className = "", style }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

export function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function SkeletonCircle({ size = 36, className = "" }) {
  return (
    <Skeleton
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function StatStripSkeleton({ count = 4, className = "" }) {
  return (
    <div
      className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-4 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-[10px] border border-[var(--border)] bg-[var(--card)] p-4"
        >
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-6 w-16" />
          <Skeleton className="mt-2 h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ className = "" }) {
  return (
    <div
      className={`rounded-[10px] border border-[var(--border)] bg-[var(--card)] p-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <SkeletonCircle size={40} />
        <div className="flex-1">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={2} className="mt-4" />
    </div>
  );
}

export function ListSkeleton({ rows = 5, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--card)] p-3"
        >
          <SkeletonCircle size={36} />
          <div className="flex-1">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>
          <Skeleton className="h-7 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 4, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-[10px] border border-[var(--border)] ${className}`}
    >
      <div className="flex gap-4 border-b border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex gap-4 border-b border-[var(--border-subtle)] px-4 py-3 last:border-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className="h-3.5 flex-1"
              style={{ maxWidth: c === 0 ? "none" : "70%" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 240, className = "" }) {
  return (
    <div
      className={`rounded-[10px] border border-[var(--border)] bg-[var(--card)] p-4 ${className}`}
      style={{ height }}
    >
      <Skeleton className="h-3 w-32" />
      <div className="mt-4 flex h-[calc(100%-2.5rem)] items-end gap-2">
        {[60, 80, 45, 90, 70, 55, 85, 65].map((h, i) => (
          <Skeleton key={i} className="flex-1" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}