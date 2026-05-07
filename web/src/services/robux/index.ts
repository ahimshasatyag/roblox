 import { http } from "@/lib/http"
 import type { Robux, RobuxDTO } from "@/types/robux"
 import { mapDTOToRobux } from "@/types/robux"
 
 export async function getRobuxes(): Promise<Robux[]> {
   const res = await http<{ robuxes: RobuxDTO[] }>("/robuxes")
   const items = Array.isArray(res.robuxes) ? res.robuxes : []
   return items.map(mapDTOToRobux)
 }
