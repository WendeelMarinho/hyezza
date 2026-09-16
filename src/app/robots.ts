import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

// Experiencia pessoal: nenhum buscador deve indexar.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', disallow: '/' } }
}
