 "use client"
 
 import { useRouter } from "next/navigation"
 import { useState } from "react"
 
 export default function ForgotPasswordLinks() {
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
       <div className="mt-4 text-center">
         <a
           href="/auth/login"
           onClick={(e) => {
             e.preventDefault()
             smoothNavigate("/auth/login")
           }}
           className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:underline transition-transform duration-300 hover:translate-x-0.5"
         >
           Back to Login
         </a>
       </div>
       <div
         className={`fixed inset-0 pointer-events-none z-40 bg-[var(--background)] backdrop-blur-[2px] transition-opacity duration-300 ${transitioning ? "opacity-50" : "opacity-0"}`}
       />
     </>
   )
 }
