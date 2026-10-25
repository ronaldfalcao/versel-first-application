import Link from 'next/link'
import { formatDate } from '@/lib/format'
import type { PostSummary } from '@/sanity/types'
import { SanityImage } from './SanityImage'

export function PostCard({ post, priority = false }: { post: PostSummary; priority?: boolean }) {
  return (
    <article className="flex flex-col gap-3">
      {post.mainImage && (
        <Link href={`/posts/${post.slug}`} tabIndex={-1} aria-hidden>
          <SanityImage
            image={post.mainImage}
            sizes="(min-width: 768px) 360px, 100vw"
            priority={priority}
            className="aspect-[16/9] w-full rounded-lg object-cover"
          />
        </Link>
      )}
      <h2 className="text-xl font-semibold leading-snug">
        <Link href={`/posts/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>
      <p className="text-[var(--muted)]">{post.excerpt}</p>
      <p className="text-sm text-[var(--muted)]">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        {post.author && <> · {post.author.name}</>}
      </p>
    </article>
  )
}

export function PostGrid({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return <p className="text-[var(--muted)]">Nenhum post publicado ainda.</p>
  return (
    <div className="grid gap-10 sm:grid-cols-2">
      {posts.map((post, i) => (
        <PostCard key={post.slug} post={post} priority={i < 2} />
      ))}
    </div>
  )
}
