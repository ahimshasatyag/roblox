 "use client"
 
 import ProfilePage from "@/features/(akun)/profile/profile-page"
 
 export default function Profile() {
   return (
     <div
       className="min-h-screen bg-cover bg-center bg-no-repeat"
       style={{
         backgroundImage:
           "linear-gradient(rgba(0,0,0,0.20), rgba(0,0,0,0.20)), url('/images/roblox_background.jpg')",
       }}
     >
       <div className="backdrop-blur-[1px]">
         <ProfilePage />
       </div>
     </div>
   )
 }
