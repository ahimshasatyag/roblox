"use client"

export default function TableSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="rounded-md border border-[var(--color-muted)] overflow-hidden">
        <div className="bg-[var(--background)] p-4 border-b border-[var(--color-muted)]">
          <div className="grid grid-cols-4 gap-4">
            <div className="h-4 bg-[var(--foreground)]/10 rounded"></div>
            <div className="h-4 bg-[var(--foreground)]/10 rounded"></div>
            <div className="h-4 bg-[var(--foreground)]/10 rounded"></div>
            <div className="h-4 bg-[var(--foreground)]/10 rounded"></div>
          </div>
        </div>
        <div className="divide-y divide-[var(--color-muted)]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-[var(--background)]/40">
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="h-4 w-8 bg-[var(--foreground)]/10 rounded"></div>
                <div className="h-4 w-32 bg-[var(--foreground)]/10 rounded"></div>
                <div className="h-4 w-24 bg-[var(--foreground)]/10 rounded"></div>
                <div className="h-8 w-20 bg-[var(--foreground)]/10 rounded-full ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
