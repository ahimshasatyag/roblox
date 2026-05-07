"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"

type Props = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  maxWidth?: string
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleEscape)
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
    >
      <div
        className={`relative w-full ${maxWidth} transform rounded-xl bg-[var(--background)] p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-300 border border-[var(--color-muted)]`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-[var(--foreground)]">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[var(--foreground)]/50 hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}
