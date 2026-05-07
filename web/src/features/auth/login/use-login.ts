"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import { loginClient } from "@/services/auth/auth"
import { validateEmail, validatePassword } from "@/lib/validation"
import { useAuth } from "@/hooks/use-auth"

export function useLogin(onSuccess?: () => void) {
  const [user, setUser] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [showLoader, setShowLoader] = useState(false)
  const { setToken } = useAuth()

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
    setErrors({ ...errors, [name]: "" })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const newErrors = { email: validateEmail(user.email), password: validatePassword(user.password) }
    if (newErrors.email || newErrors.password) {
      setErrors(newErrors)
      return
    }
    try {
      setShowLoader(true)
      const token = await loginClient({ email: user.email, password: user.password })
      setToken(token)
      setShowLoader(false)
      onSuccess?.()
    } catch (e) {
      setShowLoader(false)
      const msg = e instanceof Error ? e.message : "Login failed"
      alert(msg)
    }
  }

  return { user, errors, showLoader, handleChange, handleSubmit }
}
