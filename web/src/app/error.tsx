"use client"

import Link from "next/link"
import { useEffect } from "react"
import { applyTheme, themeColors } from "@/helper/theme"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    applyTheme(themeColors)
  }, [])

  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-[var(--color-primary)]">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        {error?.digest && (
          <p className="mt-2 text-sm text-gray-400">Ref: {error.digest}</p>
        )}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-[var(--color-primary)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            Go back home
          </Link>
          <button
            type="button"
            onClick={() => reset()}
            className="text-sm font-semibold text-gray-900"
          >
            Try again <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </main>
  )
}
