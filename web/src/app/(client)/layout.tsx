import AppLayout from "@/components/layout/AppLayout"
import Footer from "@/components/layout/Footer"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AppLayout />
      <main>
        {children}
      </main>
      <Footer />
    </>
  )
}
