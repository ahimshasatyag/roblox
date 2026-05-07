 "use client"
 
 import Input from "@/components/ui/input"
 import Button from "@/components/ui/button"
 import { UserRound, Lock } from "lucide-react"
 
 type Props = {
   username: string
   setUsername: (v: string) => void
   password: string
   setPassword: (v: string) => void
   onBack: () => void
   onNext: () => void
   canNext: boolean
 }
 
 export default function AccountForm({
   username,
   setUsername,
   password,
   setPassword,
   onBack,
   onNext,
   canNext,
 }: Props) {
   return (
     <div className="space-y-4">
       <Input
         label="Username Roblox"
         name="username"
         placeholder="Masukkan username Roblox"
         value={username}
         onChange={(e) => setUsername(e.target.value)}
         icon={<UserRound size={18} />}
       />
       <Input
         type="password"
         label="Password Roblox"
         name="password"
         placeholder="Masukkan password Roblox"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         icon={<Lock size={18} />}
       />
       <p className="text-xs text-[var(--foreground)]/70">
         Data akun hanya digunakan untuk proses top up dan tidak disimpan.
       </p>
       <div className="mt-4 flex items-center justify-between">
         <div className="w-40">
           <Button text="Kembali" type="button" variant="secondary" onClick={onBack} />
         </div>
         <div className="w-40">
           <Button text="Lanjut" type="button" variant="primary" onClick={onNext} disabled={!canNext} />
         </div>
       </div>
     </div>
   )
 }
