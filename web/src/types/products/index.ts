export type ProductDTO = {
  id: number
  name: string
  starting_price: number
  image_url?: string | null
}

export type Product = {
  id: number
  title: string
  basePrice: number
  image?: string
}

function normalizeImage(u?: string | null): string | undefined {
  if (!u) return undefined
  const s = u.trim()
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/")) return s
  const publicMatch = s.match(/[/\\]public[/\\](.+)$/i)
  if (publicMatch && publicMatch[1]) {
    const rel = publicMatch[1].replace(/\\/g, "/")
    return `/${rel.replace(/^\/+/, "")}`
  }
  const imagesMatch = s.match(/images[\\/].+$/i)
  if (imagesMatch && imagesMatch[0]) {
    return `/${imagesMatch[0].replace(/\\/g, "/")}`
  }
  return undefined
}

export function mapDTOToProduct(dto: ProductDTO): Product {
  return {
    id: dto.id,
    title: dto.name,
    basePrice: dto.starting_price,
    image: normalizeImage(dto.image_url),
  }
}
