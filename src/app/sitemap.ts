import type { MetadataRoute } from 'next'
import { siteUrl } from '@/sanity/env'
import { getAuthorSlugs, getCategorySlugs, getPostSlugs } from '@/sanity/fetch'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, authors] = await Promise.all([getPostSlugs(), getCategorySlugs(), getAuthorSlugs()])

  return [
    { url: siteUrl, lastModified: posts[0]?.updatedAt ?? posts[0]?.publishedAt, changeFrequency: 'daily', priority: 1 },
    ...posts.map((p) => ({
      url: `${siteUrl}/posts/${p.slug}`,
      lastModified: p.updatedAt ?? p.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...categories.map((c) => ({ url: `${siteUrl}/categorias/${c.slug}`, changeFrequency: 'weekly' as const, priority: 0.5 })),
    ...authors.map((a) => ({ url: `${siteUrl}/autores/${a.slug}`, changeFrequency: 'monthly' as const, priority: 0.4 })),
  ]
}
