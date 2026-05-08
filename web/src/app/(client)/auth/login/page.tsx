 "use client"
 
import LoginForm from "@/features/auth/login/login-form"
import { useEffect } from "react"
import { useAuth } from "@/stores/auth/auth"
import { useRouter } from "next/navigation"
import { applyTheme, themeColors } from "@/helper/theme"

export default function Login() {
  const { token, setToken } = useAuth()
  const router = useRouter()
  useEffect(() => {
    applyTheme(themeColors)
  }, [])
  useEffect(() => {
    if (token) {
      router.replace("/home")
    }
  }, [token, router])
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.40), rgba(0,0,0,0.40)), url('/images/roblox_background.jpg')",
      }}
    >
      <LoginForm />
    </div>
  )
}
