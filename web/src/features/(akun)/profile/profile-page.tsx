 "use client"
 
 import { useEffect, useMemo, useState } from "react"
 import { Mail, Phone } from "lucide-react"
 import Input from "@/components/ui/input"
 import Button from "@/components/ui/button"
 import AvatarCard from "@/components/shared/(akun)/profile/AvatarCard"
import { applyTheme, themeColors } from "@/helper/theme"
import { isEmailVerified, isPhoneVerified } from "@/lib/validation"
 import { notifyError, notifySuccess } from "@/components/ui"
 import { useRouter } from "next/navigation"
import { meClient, updateClientMe, uploadClientAvatar } from "@/services/auth/auth"
import { useAuth } from "@/stores/auth/auth"
import type { UserAccount } from "@/types/auth/auth"
import { API_URL } from "@/config"
 
const VerificationBadge = ({ ok }: { ok: boolean }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
      ok
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200"
        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200"
    }`}
  >
    {ok ? "Verified" : "Belum Verifikasi"}
  </span>
)
 
export default function ProfilePage() {
   const router = useRouter()
  const { token, setUserPic } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
   const [editing, setEditing] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | undefined>()
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
  const [initialEmail, setInitialEmail] = useState("")
  const [initialPhone, setInitialPhone] = useState("")
  const [initialAvatarUrl, setInitialAvatarUrl] = useState<string | undefined>(undefined)
  const toPicUrl = (p?: string | null) => {
    if (!p) return undefined
    if (p.startsWith("http")) return p
    const path = p.startsWith("/") ? p : `/uploads/avatars/${p}`
    return `${API_URL}${path}`
  }
 
   useEffect(() => {
     applyTheme(themeColors)
   }, [])
 
  useEffect(() => {
    let cancelled = false
    async function fetchProfile() {
      if (!token) return
      try {
        const mc = await meClient(token)
        if (cancelled) return
        const ua: UserAccount = mc.user_account
        setName(ua?.full_name ?? "")
        setEmail(ua?.email ?? "")
        setPhone(ua?.no_hp ?? "")
        const picUrl = toPicUrl(ua?.pic)
        setAvatarUrl(picUrl)
        setInitialEmail(ua?.email ?? "")
        setInitialPhone(ua?.no_hp ?? "")
        setInitialAvatarUrl(picUrl)
      } catch {
      }
    }
    fetchProfile()
    return () => {
      cancelled = true
    }
  }, [token])

  const emailVerified = useMemo(() => isEmailVerified(email), [email])
  const phoneVerified = useMemo(() => isPhoneVerified(phone), [phone])
 
   const handleSave = async () => {
    if (!isEmailVerified(email)) {
       notifyError("Gagal", "Email tidak valid")
       return
     }
    if (!isPhoneVerified(phone)) {
       notifyError("Gagal", "Nomor HP tidak valid")
       return
     }
     try {
      if (avatarFile) {
        const up = await uploadClientAvatar(token!, avatarFile)
        const newUrl = toPicUrl(up.user_account.pic ?? null)
        setAvatarUrl(newUrl)
        setInitialAvatarUrl(newUrl)
        setUserPic(newUrl ?? null)
      }
      const updated = await updateClientMe(token!, { email, no_hp: phone || null })
      const ua2: UserAccount = updated.user_account
      setEmail(ua2?.email ?? email)
      setPhone(ua2?.no_hp ?? phone)
      setInitialEmail(ua2?.email ?? email)
      setInitialPhone(ua2?.no_hp ?? phone)
       notifySuccess("Berhasil", "Perubahan profil tersimpan")
       setEditing(false)
     } catch {
       notifyError("Gagal", "Terjadi kesalahan saat menyimpan")
     }
   }
 
   return (
     <main className="mx-auto max-w-5xl px-6 py-10">
       <AvatarCard
        key={avatarUrl || "no-avatar"}
        name={name}
        avatarUrl={avatarUrl}
         editing={editing}
         onPickImage={(f) => setAvatarFile(f)}
       />
 
       <section className="mt-6 rounded-2xl border border-[var(--color-muted)] bg-[var(--background)] p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
         <div className="mb-6 flex items-center justify-between">
           <h3 className="text-lg font-semibold text-[var(--foreground)]">Data Akun</h3>
           <div className="flex items-center gap-2">
             <VerificationBadge ok={emailVerified} />
             <VerificationBadge ok={phoneVerified} />
           </div>
         </div>
         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
           <div>
             <Input
               type="email"
               label="Email"
               name="email"
               placeholder="Masukkan email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
             disabled={!editing}
               icon={<Mail size={20} />}
             />
           </div>
           <div>
             <Input
              type="tel"
               label="Nomor HP"
               name="phone"
               placeholder="Masukkan nomor HP"
               value={phone}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "")
                const limited = onlyDigits.slice(0, 12)
                setPhone(limited)
              }}
              maxLength={12}
             disabled={!editing}
               icon={<Phone size={20} />}
             />
           </div>
         </div>
 
         <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
           {editing ? (
             <>
               <Button text="Simpan Perubahan" onClick={handleSave} />
               <Button
                 text="Kembali"
                 variant="secondary"
                 type="button"
              onClick={() => {
                setEmail(initialEmail)
                setPhone(initialPhone)
                setAvatarUrl(initialAvatarUrl)
                setAvatarFile(undefined)
                setEditing(false)
              }}
               />
             </>
           ) : (
             <>
               <Button
                 text="Kembali"
                 variant="secondary"
               type="button"
               onClick={() => router.back()}
               />
               <Button text="Edit" onClick={() => setEditing(true)} />
             </>
           )}
         </div>
       </section>
     </main>
   )
 }
