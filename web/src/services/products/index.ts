import { http } from "@/lib/http"
import { Product, ProductDTO, mapDTOToProduct } from "@/types/products"

export async function getProducts(): Promise<Product[]> {
  const res = await http<{ products: ProductDTO[] }>("/products")
  return (res.products ?? []).map(mapDTOToProduct)
}
