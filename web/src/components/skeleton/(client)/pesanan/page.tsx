"use client"

export default function PesananSkeleton() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-10 animate-pulse">
      <div className="h-10 w-64 bg-[var(--foreground)]/10 rounded mx-auto mb-8"></div>

      <div className="mx-auto max-w-4xl mb-8">
        <div className="rounded-md border border-[var(--color-muted)] p-4 bg-[var(--background)]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-[var(--foreground)]/10 rounded"></div>
              <div className="h-10 w-full bg-[var(--foreground)]/5 rounded border border-[var(--color-muted)]"></div>
            </div>
            <div className="md:w-40 h-10 bg-[var(--foreground)]/10 rounded"></div>
          </div>
        </div>
      </div>

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
          {[1, 2, 3, 4, 5].map((i) => (
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
