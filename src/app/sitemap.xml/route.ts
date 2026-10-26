import { siteUrl } from '@/sanity/env'
import { getAuthorSlugs, getCategorySlugs, getPostSlugs } from '@/sanity/fetch'

// Route handler comum em vez de app/sitemap.ts: na Vercel o sitemap.ts era servido como
// arquivo estático e não acompanhava o revalidateTag do webhook.
type Entry = { url: string; lastModified?: string; changeFrequency: string; priority: number }

export async function GET() {
  const [posts, categories, authors] = await Promise.all([getPostSlugs(), getCategorySlugs(), getAuthorSlugs()])

  const entries: Entry[] = [
    { url: siteUrl, lastModified: posts[0]?.updatedAt ?? posts[0]?.publishedAt, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/arquivo`, lastModified: posts[0]?.updatedAt ?? posts[0]?.publishedAt, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/sobre`, changeFrequency: 'monthly', priority: 0.5 },
    ...posts.map((p) => ({
      url: `${siteUrl}/posts/${p.slug}`,
      lastModified: p.updatedAt ?? p.publishedAt,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    ...categories.map((c) => ({ url: `${siteUrl}/categorias/${c.slug}`, changeFrequency: 'weekly', priority: 0.5 })),
    ...authors.map((a) => ({ url: `${siteUrl}/autores/${a.slug}`, changeFrequency: 'monthly', priority: 0.4 })),
  ]

  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${encodeURI(e.url)}</loc>${e.lastModified ? `\n    <lastmod>${new Date(e.lastModified).toISOString()}</lastmod>` : ''}
    <changefreq>${e.changeFrequency}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
