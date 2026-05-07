 "use client"
 
 import Link from "next/link"
 import { Instagram, MessageCircle, Music2 } from "lucide-react"
 
 export default function SocialLinks() {
   const iconClass =
     "h-5 w-5 text-[var(--foreground)]/80 transition-colors duration-300 hover:text-[var(--color-primary)]"
   return (
     <div className="flex items-center gap-3">
       <Link href="https://instagram.com" aria-label="Instagram" className="inline-flex">
         <Instagram className={iconClass} />
       </Link>
       <Link href="https://discord.com" aria-label="Discord" className="inline-flex">
         <MessageCircle className={iconClass} />
       </Link>
       <Link href="https://tiktok.com" aria-label="TikTok" className="inline-flex">
         <Music2 className={iconClass} />
       </Link>
     </div>
   )
 }
