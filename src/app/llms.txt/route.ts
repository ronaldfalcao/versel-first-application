import { siteUrl } from '@/sanity/env'
import { getPosts, getSettings } from '@/sanity/fetch'

// Índice em Markdown para assistentes de IA (convenção llms.txt — https://llmstxt.org)
export async function GET() {
  const [settings, posts] = await Promise.all([getSettings(), getPosts()])
  const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim()

  const body = [
    `# ${oneLine(settings.title)}`,
    '',
    `> ${oneLine(settings.description)}`,
    '',
    '## Posts',
    '',
    ...posts.map((p) => `- [${oneLine(p.title)}](${siteUrl}/posts/${p.slug}): ${oneLine(p.excerpt)}`),
    '',
    '## Optional',
    '',
    `- [Feed RSS](${siteUrl}/feed.xml)`,
    `- [Sitemap](${siteUrl}/sitemap.xml)`,
    '',
  ].join('\n')

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
