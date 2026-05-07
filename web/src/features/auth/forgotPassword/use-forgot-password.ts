 "use client"
 
 import { ChangeEvent, FormEvent, useState } from "react"
 import { validateEmail } from "@/lib/validation"
 
 export function useForgotPassword(onSuccess?: () => void) {
   const [email, setEmail] = useState("")
   const [error, setError] = useState("")
   const [loading, setLoading] = useState(false)
   const [success, setSuccess] = useState(false)
 
   const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
     setEmail(e.target.value)
     setError("")
   }
 
   const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
     event.preventDefault()
     const err = validateEmail(email)
     if (err) {
       setError(err)
       return
     }
     setLoading(true)
     setTimeout(() => {
       setLoading(false)
       setSuccess(true)
       onSuccess?.()
     }, 2000)
   }
 
   return { email, error, loading, success, handleChange, handleSubmit }
 }
