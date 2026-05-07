 "use client"
 
 import Link from "next/link"
 import Image from "next/image"
 import SocialLinks from "@/components/shared/layout/SocialLinks"
 
 export default function Footer() {
   return (
     <footer className="mt-10 border-t border-[var(--color-muted)] bg-[var(--background)]">
       <div className="container mx-auto px-4 py-6">
         <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
           <div className="flex items-center gap-2">
             <Link href="/" aria-label="Home">
               <Image
                 src="/next.svg"
                 alt="Logo"
                 width={80}
                 height={20}
                 className="dark:invert"
                 priority
               />
             </Link>
           </div>
 
           <div className="text-center text-sm text-[var(--foreground)]/80">
             <div>© 2026 Roblox. All rights reserved.</div>
             <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
               <Link href="/about" className="hover:text-[var(--color-primary)] transition-colors duration-300">
                 Tentang Kami
               </Link>
               <span className="text-[var(--foreground)]/40">•</span>
               <Link href="/contact" className="hover:text-[var(--color-primary)] transition-colors duration-300">
                 Kontak
               </Link>
               <span className="text-[var(--foreground)]/40">•</span>
               <Link href="/terms" className="hover:text-[var(--color-primary)] transition-colors duration-300">
                 Syarat & Ketentuan
               </Link>
               <span className="text-[var(--foreground)]/40">•</span>
               <Link href="/privacy" className="hover:text-[var(--color-primary)] transition-colors duration-300">
                 Kebijakan Privasi
               </Link>
             </div>
           </div>
 
           <div className="flex md:justify-end">
             <SocialLinks />
           </div>
         </div>
       </div>
     </footer>
   )
 }
