 type Props = {
   title: string
   description?: string
 }
 
 export default function SectionHeader({ title, description }: Props) {
   return (
     <div className="mx-auto max-w-2xl text-center">
       <h2 className="text-3xl font-bold tracking-tight text-[var(--color-dark)]">{title}</h2>
       {description ? <p className="mt-4 text-[var(--color-dark)]/70">{description}</p> : null}
     </div>
   )
 }
