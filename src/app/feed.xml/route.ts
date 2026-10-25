import { siteUrl } from '@/sanity/env'
import { getPosts, getSettings } from '@/sanity/fetch'

const escapeXml = (s: string) =>
  s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!)

export async function GET() {
  const [settings, posts] = await Promise.all([getSettings(), getPosts(50)])

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/posts/${post.slug}`
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>${
        post.author ? `\n      <dc:creator>${escapeXml(post.author.name)}</dc:creator>` : ''
      }${(post.categories ?? []).map((c) => `\n      <category>${escapeXml(c.title)}</category>`).join('')}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(settings.title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(settings.description)}</description>
    <language>pt-BR</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
