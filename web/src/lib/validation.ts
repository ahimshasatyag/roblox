export function validateEmail(email: string) {
  if (!email.trim()) return "Please enter a valid email."
  return ""
}

export function validatePassword(password: string) {
  if (!password.trim()) return "Password cannot be empty."
  return ""
}

export function validateFullName(name: string) {
  if (!name.trim()) return "Please enter your name."
  return ""
}

export function isEmailVerified(email: string) {
  return !!email && email.includes("@")
}
 
export function isPhoneVerified(phone: string) {
  return phone.replace(/\D/g, "").length >= 10
}
