 "use client"
 
 import { useRef, useState } from "react"
 import Image from "next/image"
import Button from "@/components/ui/button"
 
 type Props = {
   name: string
   avatarUrl?: string
   onPickImage?: (file: File) => void
  editing?: boolean
 }
 
export default function AvatarCard({ name, avatarUrl, onPickImage, editing = true }: Props) {
   const inputRef = useRef<HTMLInputElement | null>(null)
   const [preview, setPreview] = useState<string | undefined>(avatarUrl)
 
   const openFilePicker = () => {
     inputRef.current?.click()
   }
 
   const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0]
     if (!file) return
     const url = URL.createObjectURL(file)
     setPreview(url)
     onPickImage?.(file)
   }
 
   const initial = name?.trim()?.charAt(0)?.toUpperCase() || "U"
 
   return (
     <div className="rounded-2xl border border-[var(--color-muted)] bg-[var(--background)] p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
       <div className="flex flex-col items-center">
         <div className="relative h-28 w-28 overflow-hidden rounded-full ring-2 ring-[var(--color-primary)] shadow-sm">
          {preview ? (
            <Image
              src={preview}
              alt="Avatar"
              width={112}
              height={112}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
             <div className="flex h-full w-full items-center justify-center bg-[var(--color-secondary)] text-4xl font-semibold text-white">
               {initial}
             </div>
           )}
         </div>
         <p className="mt-4 text-base font-medium text-[var(--foreground)]">{name}</p>
        {editing && (
          <div className="mt-4">
            <Button text={preview ? "Ganti Foto" : "Upload Foto"} onClick={openFilePicker} />
          </div>
        )}
         <input
           ref={inputRef}
           type="file"
           accept="image/*"
           className="hidden"
           onChange={onChangeFile}
         />
       </div>
     </div>
   )
 }
