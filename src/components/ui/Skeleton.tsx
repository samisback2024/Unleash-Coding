interface SkeletonProps {
  className?: string;
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#2a2d3e]/60", className)}
    />
  );
}

/** Pre-built skeleton for a learning path card */
export function PathCardSkeleton() {
  return (
    <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-20 h-5 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex gap-2 mt-auto pt-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#2a2d3e]">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

/** Pre-built skeleton for the path detail hero */
export function PathDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      <Skeleton className="h-4 w-32" />
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-8 space-y-6">
        <div className="flex gap-5">
          <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
