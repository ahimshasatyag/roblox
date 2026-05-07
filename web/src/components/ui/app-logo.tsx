"use client"

import Image from "next/image"

export default function AppLogo() {
  return (
    <div className="mb-6 flex items-center justify-center">
      <Image
        src="/next.svg"
        alt="App Logo"
        width={64}
        height={16}
        className="dark:invert"
        priority
      />
    </div>
  )
}
