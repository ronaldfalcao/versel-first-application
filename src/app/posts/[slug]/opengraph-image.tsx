import { formatShortDate } from '@/lib/format'
import { OG_SIZE, ogImage } from '@/lib/og'
import { getPost, getSettings } from '@/sanity/fetch'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'Capa da entrada'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, settings] = await Promise.all([getPost(slug), getSettings()])
  return ogImage({
    eyebrow: settings.title,
    title: post?.title ?? settings.title,
    footer: post ? `${formatShortDate(post.publishedAt)}${post.author ? ` · ${post.author.name}` : ''}` : settings.description,
    seed: slug,
  })
}
