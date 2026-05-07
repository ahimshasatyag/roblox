 "use client"
 
 import ForgotPasswordForm from "@/features/auth/forgotPassword/forgot-password-form"
 
 export default function ForgotPassword() {
   return (
     <div
       className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
       style={{
         backgroundImage:
           "linear-gradient(rgba(0,0,0,0.40), rgba(0,0,0,0.40)), url('/images/roblox_background.jpg')",
       }}
     >
       <ForgotPasswordForm />
     </div>
   )
 }
