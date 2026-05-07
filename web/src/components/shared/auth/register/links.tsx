"use client"

export default function RegisterLinks() {
  return (
    <div className="mt-4 text-center">
      <span className="text-sm text-[var(--color-dark)]/70">Already have an account? </span>
      <a href="/auth/login" className="inline-block text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:underline transition-transform duration-300 hover:translate-x-0.5">
        Log in
      </a>
    </div>
  )
}
