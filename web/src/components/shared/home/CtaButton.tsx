 import Link from "next/link"
 
 type Props = {
   href: string
   children: React.ReactNode
   variant?: "primary" | "secondary"
   className?: string
 }
 
 export default function CtaButton({ href, children, variant = "primary", className = "" }: Props) {
   const base = "rounded-md px-6 py-3 transition-transform duration-300 hover:scale-[1.02]"
  const styles =
    variant === "primary"
      ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)]"
      : "bg-[var(--background)] text-[var(--color-dark)] hover:bg-[var(--background)]"
 
   return (
     <Link href={href} className={`${base} ${styles} ${className}`}>
       {children}
     </Link>
   )
 }
