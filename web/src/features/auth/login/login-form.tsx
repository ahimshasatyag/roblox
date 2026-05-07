"use client"

import AppLogo from "@/components/ui/app-logo"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import FormCard from "@/components/ui/form-card"
import { Mail, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { applyTheme, themeColors } from "@/helper/theme"
import { useEffect } from "react"
import { useLogin } from "./use-login"
import AuthLinks from "@/components/shared/auth/login/auth-links"

export default function LoginForm() {
  const router = useRouter()
  const { user, errors, showLoader, handleChange, handleSubmit } = useLogin(() => router.push("/home"))

  useEffect(() => {
    applyTheme(themeColors)
  }, [])

  return (
    <FormCard>
      <AppLogo />
      <h2 className="mb-8 text-center text-2xl font-semibold text-[var(--color-dark)]">
        Login to Flexy UI
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="group">
          <Input
            type="email"
            label="Email"
            name="email"
            placeholder="Please enter your email"
            value={user.email}
            onChange={handleChange}
            error={errors.email}
            icon={
              <Mail
                size={20}
                className="transition-transform duration-300 group-focus-within:rotate-12 group-hover:scale-110 group-hover:text-[var(--color-primary)]"
              />
            }
          />
        </div>
        <div className="group">
          <Input
            type="password"
            label="Password"
            name="password"
            placeholder="Please enter your password"
            value={user.password}
            onChange={handleChange}
            error={errors.password}
            icon={
              <Lock
                size={20}
                className="transition-transform duration-300 group-focus-within:-rotate-12 group-hover:scale-110 group-hover:text-[var(--color-primary)]"
              />
            }
          />
          <AuthLinks />
        </div>
        <div className="mt-2">
          <Button text="Sign in" loading={showLoader} disabled={showLoader} />
        </div>
      </form>
    </FormCard>
  )
}
