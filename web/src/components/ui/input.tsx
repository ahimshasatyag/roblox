"use client"

import { ReactNode, ChangeEvent, useState } from "react"
import { Eye, EyeOff } from "lucide-react"

type Props = {
  type?: "text" | "email" | "password" | "tel"
  label: string
  name: string
  placeholder?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  error?: string
  icon?: ReactNode
  disabled?: boolean
  maxLength?: number
}

export default function Input({
  type = "text",
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  maxLength,
}: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = type === "password" && showPassword ? "text" : type
  return (
    <div className="mb-4 group">
      <label className="mb-2 block text-sm font-medium text-[var(--foreground)] transition-all duration-300 group-focus-within:text-[var(--color-primary)] group-focus-within:translate-x-0.5 group-focus-within:tracking-wide">
        {label}
      </label>
      <div className={`flex items-center rounded-md border border-[var(--color-muted)] bg-[var(--background)] px-3 py-2 transition-colors duration-300 focus-within:border-[var(--color-primary)] hover:border-[var(--color-accent)] ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}>
        {icon && <span className="mr-2 text-[var(--color-muted)] transition-transform duration-300 group-hover:scale-110 group-focus-within:text-[var(--color-primary)]">{icon}</span>}
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          maxLength={maxLength}
          className="w-full bg-transparent outline-none text-[var(--foreground)] placeholder:text-[var(--color-muted)] transition-all duration-300 focus:tracking-wide"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="ml-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-transform duration-300 hover:scale-110"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-[var(--color-accent)]">{error}</p>}
    </div>
  )
}
