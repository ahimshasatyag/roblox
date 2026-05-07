"use client"

import { ReactNode } from "react"

type Props = {
  text: string
  loading?: boolean
  disabled?: boolean
  iconLeft?: ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  variant?: "primary" | "secondary" | "ghost"
}

export default function Button({
  text,
  loading,
  disabled,
  iconLeft,
  onClick,
  type = "submit",
  variant = "primary",
}: Props) {
  const base =
    "flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2"
  const variantClass =
    variant === "primary"
      ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)] focus-visible:outline-[var(--color-primary)]"
      : variant === "secondary"
      ? "bg-transparent text-[var(--foreground)] border border-[var(--color-muted)] hover:border-[var(--color-primary)] focus-visible:outline-[var(--color-primary)]"
      : "bg-transparent text-[var(--foreground)] hover:text-[var(--color-primary)] focus-visible:outline-[var(--color-primary)]"
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${variantClass}`}>
      {iconLeft}
      {loading ? "Processing..." : text}
    </button>
  )
}
