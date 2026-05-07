"use client"

import AppLogo from "@/components/ui/app-logo"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import FormCard from "@/components/ui/form-card"
import { UserRound, Mail, Lock } from "lucide-react"
import { useEffect } from "react"
import { applyTheme, themeColors } from "@/helper/theme"
import { useRegister } from "./use-register"
import RegisterLinks from "@/components/shared/auth/register/links"
import { useRouter } from "next/navigation"

export default function RegisterForm() {
  const router = useRouter()
  const { user, errors, showLoader, handleChange, handleSubmit } = useRegister(() => router.push("/auth/login"))

  useEffect(() => {
    applyTheme(themeColors)
  }, [])

  return (
    <FormCard>
      <AppLogo />
      <h2 className="mb-8 text-center text-2xl font-semibold text-[var(--color-dark)]">
        Sign up to Flexy UI
      </h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          label="Full Name"
          name="name"
          placeholder="Please enter your full name"
          value={user.name}
          onChange={handleChange}
          error={errors.name}
          icon={<UserRound size={20} className="transition-transform duration-300 group-hover:scale-110 group-focus-within:rotate-6 group-focus-within:text-[var(--color-primary)]" />}
        />
        <Input
          type="email"
          label="Email"
          name="email"
          placeholder="Please enter your email"
          value={user.email}
          onChange={handleChange}
          error={errors.email}
          icon={<Mail size={20} className="transition-transform duration-300 group-hover:scale-110 group-focus-within:rotate-12 group-focus-within:text-[var(--color-primary)]" />}
        />
        <Input
          type="password"
          label="Password"
          name="password"
          placeholder="Please enter your password"
          value={user.password}
          onChange={handleChange}
          error={errors.password}
          icon={<Lock size={20} className="transition-transform duration-300 group-hover:scale-110 group-focus-within:-rotate-12 group-focus-within:text-[var(--color-primary)]" />}
        />
        <div className="mt-10">
          <Button text="Create an account" loading={showLoader} disabled={showLoader} />
        </div>
      </form>
      <RegisterLinks />
    </FormCard>
  )
}
