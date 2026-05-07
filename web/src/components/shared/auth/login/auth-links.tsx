"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AuthLinks() {
  const router = useRouter()
  const [transitioning, setTransitioning] = useState(false)

  const smoothNavigate = (href: string) => {
    setTransitioning(true)
    router.prefetch?.(href)
    setTimeout(() => {
      router.push(href)
    }, 200)
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-left">
          <span className="text-sm text-[var(--color-dark)]/70">New here? </span>
          <a
            href="/auth/register"
            onClick={(e) => {
              e.preventDefault()
              smoothNavigate("/auth/register")
            }}
            className="inline-block text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:underline transition-transform duration-300 hover:translate-x-0.5"
          >
            Sign up
          </a>
        </div>
        <a
          href="/auth/forgotPassword"
          onClick={(e) => {
            e.preventDefault()
            smoothNavigate("/auth/forgotPassword")
          }}
          className="inline-block text-sm text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:underline transition-transform duration-300 hover:translate-x-0.5"
        >
          Forgot Password?
        </a>
      </div>
      <div
        className={`fixed inset-0 pointer-events-none z-40 bg-[var(--background)] backdrop-blur-[2px] transition-opacity duration-300 ${transitioning ? "opacity-50" : "opacity-0"}`}
      />
    </>
  )
}
