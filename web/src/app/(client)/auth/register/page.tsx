import RegisterForm from "@/features/auth/register/register-form"

export default function Register() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.40), rgba(0,0,0,0.40)), url('/images/roblox_background.jpg')",
      }}
    >
      <RegisterForm />
    </div>
  )
}
