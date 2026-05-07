import Hero from "@/features/home/hero"
import Features from "@/features/home/features"
import Steps from "@/features/home/steps"
import PopularPackages from "@/features/home/popular-packages-section"
 
 export default function Home() {
   return (
     <main className="space-y-16">
       <Hero />
       <Features />
       <Steps />
       <PopularPackages />
     </main>
   )
 }
