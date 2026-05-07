 "use client"
 
 import AppLogo from "@/components/ui/app-logo"
 import Button from "@/components/ui/button"
 import Input from "@/components/ui/input"
 import FormCard from "@/components/ui/form-card"
 import { Mail } from "lucide-react"
 import { useEffect } from "react"
 import { applyTheme, themeColors } from "@/helper/theme"
 import { useForgotPassword } from "./use-forgot-password"
 import ForgotPasswordLinks from "@/components/shared/auth/forgotPassword/links"
 
 export default function ForgotPasswordForm() {
   const { email, error, loading, success, handleChange, handleSubmit } = useForgotPassword()
 
   useEffect(() => {
     applyTheme(themeColors)
   }, [])
 
   return (
     <FormCard>
       <AppLogo />
       <h2 className="mb-12 text-center text-2xl font-semibold text-[var(--color-dark)]">Forgot Password?</h2>
       {success ? (
         <p className="mb-6 text-center text-green-600">Email has been sent. Please check your inbox.</p>
       ) : (
         <form onSubmit={handleSubmit}>
           <Input
             type="email"
             label="Email Address"
             name="email"
             placeholder="Enter your email"
             value={email}
             onChange={handleChange}
             error={error}
             icon={<Mail size={20} />}
           />
           <Button text="Reset Password" loading={loading} disabled={loading} />
         </form>
       )}
       <ForgotPasswordLinks />
     </FormCard>
   )
 }
