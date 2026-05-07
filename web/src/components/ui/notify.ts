 "use client"
 
 import Swal from "sweetalert2"
 
 export function notifySuccess(title: string, text?: string) {
   return Swal.fire({
     icon: "success",
     title,
     text,
     background: "var(--background)",
     color: "var(--foreground)",
     confirmButtonColor: "var(--color-primary)",
     showConfirmButton: true,
   })
 }
 
 export function notifyError(title: string, text?: string) {
   return Swal.fire({
     icon: "error",
     title,
     text,
     background: "var(--background)",
     color: "var(--foreground)",
     confirmButtonColor: "var(--color-primary)",
     showConfirmButton: true,
   })
 }

export function confirmLoginRequired(text = "Anda perlu login untuk melanjutkan.") {
  return Swal.fire({
    icon: "warning",
    title: "Butuh Login",
    text,
    background: "var(--background)",
    color: "var(--foreground)",
    confirmButtonColor: "var(--color-primary)",
    cancelButtonColor: "var(--color-accent)",
    showCancelButton: true,
    confirmButtonText: "Login sekarang",
    cancelButtonText: "Batal",
  })
}
