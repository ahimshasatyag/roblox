"use client"

export default function FormCard({ children, className = "max-w-md" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative z-50 w-full ${className} rounded-lg bg-[var(--background)] p-6 shadow border border-[var(--color-muted)]`}>
      {children}
    </div>
  )
}
