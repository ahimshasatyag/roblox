 export type RobuxDTO = {
   id: number
   robux_amount: number
   price: number
   created_at?: string
   updated_at?: string
 }
 
 export type Robux = {
   id: number
   amount: number
   price: number
 }
 
 export function mapDTOToRobux(dto: RobuxDTO): Robux {
   return {
     id: dto.id,
     amount: dto.robux_amount,
     price: dto.price,
   }
 }
