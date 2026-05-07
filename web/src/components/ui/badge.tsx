 "use client"
 
 type Props = {
   text: string
   color?: "gray" | "red" | "green"
 }
 
 export default function Badge({ text, color = "gray" }: Props) {
   const cls =
     color === "red"
       ? "bg-red-100 text-red-700 border-red-200"
       : color === "green"
       ? "bg-green-100 text-green-700 border-green-200"
       : "bg-gray-100 text-gray-700 border-gray-200"
   return (
     <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>
       {text}
     </span>
   )
 }
