"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import { registerClient } from "@/services/auth/auth"
import { validateEmail, validatePassword, validateFullName } from "@/lib/validation"

export function useRegister(onSuccess?: () => void) {
  const [user, setUser] = useState({ name: "", email: "", password: "" })
  const [errors, setErrors] = useState({ name: "", email: "", password: "" })
  const [showLoader, setShowLoader] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
    setErrors({ ...errors, [name]: "" })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const newErrors = {
      name: validateFullName(user.name),
      email: validateEmail(user.email),
      password: validatePassword(user.password),
    }
    if (newErrors.name || newErrors.email || newErrors.password) {
      setErrors(newErrors)
      return
    }
    try {
      setShowLoader(true)
      const payload = { full_name: user.name, email: user.email, password: user.password }
      await registerClient(payload)
      setShowLoader(false)
      onSuccess?.()
    } catch (e) {
      setShowLoader(false)
      const msg = e instanceof Error ? e.message : "Signup failed"
      alert(msg)
    }
  }

  return { user, errors, showLoader, handleChange, handleSubmit }
}
