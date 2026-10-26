import Link from 'next/link'
import { dateParts, readingTime } from '@/lib/format'
import type { PostSummary } from '@/sanity/types'
import { SanityImage } from './SanityImage'

// Data no formato de cabeçalho de diário: dia grande, mês e ano em versalete
function EntryDate({ iso, className = '' }: { iso: string; className?: string }) {
  const { day, month, year } = dateParts(iso)
  return (
    <time dateTime={iso} className={`flex items-baseline gap-2 sm:flex-col sm:gap-1 ${className}`}>
      <span className="font-display text-4xl font-medium leading-none text-accent sm:text-5xl">{day}</span>
      <span className="eyebrow text-muted">
        {month} {year}
      </span>
    </time>
  )
}

function Categories({ post }: { post: PostSummary }) {
  if (!post.categories?.length) return null
  return (
    <p className="eyebrow mb-2 text-accent">
      {post.categories.map((c, i) => (
        <span key={c.slug}>
          {i > 0 && ' · '}
          <Link href={`/categorias/${c.slug}`} className="hover:underline">
            {c.title}
          </Link>
        </span>
      ))}
    </p>
  )
}

function Meta({ post }: { post: PostSummary }) {
  return (
    <p className="mt-4 text-sm text-muted">
      {post.author && <>{post.author.name} · </>}
      {readingTime(post.readingMinutes)}
    </p>
  )
}

export function PostEntry({ post, priority = false }: { post: PostSummary; priority?: boolean }) {
  const href = `/posts/${post.slug}`
  return (
    <article className="group grid gap-x-10 gap-y-4 border-t border-line py-10 first:border-t-0 first:pt-0 sm:grid-cols-[6.5rem_1fr]">
      <EntryDate iso={post.publishedAt} />
      <div className={post.mainImage ? 'grid gap-6 md:grid-cols-[1fr_15rem]' : undefined}>
        <div>
          <Categories post={post} />
          <h2 className="font-display text-2xl font-semibold leading-snug tracking-tight sm:text-[1.75rem]">
            <Link
              href={href}
              className="decoration-accent-soft decoration-2 underline-offset-[0.18em] group-hover:underline"
            >
              {post.title}
            </Link>
          </h2>
          <p className="mt-3 max-w-[60ch] font-serif text-lg leading-relaxed text-muted">{post.excerpt}</p>
          <Meta post={post} />
        </div>
        {post.mainImage && (
          <Link href={href} tabIndex={-1} aria-hidden className="order-first md:order-none">
            <SanityImage
              image={post.mainImage}
              sizes="(min-width: 768px) 240px, 100vw"
              priority={priority}
              className="aspect-[4/3] w-full rounded-md object-cover"
            />
          </Link>
        )}
      </div>
    </article>
  )
}

export function PostList({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) {
    return <p className="font-serif text-lg italic text-muted">As primeiras páginas ainda estão em branco.</p>
  }
  return (
    <div>
      {posts.map((post, i) => (
        <PostEntry key={post.slug} post={post} priority={i === 0} />
      ))}
    </div>
  )
}
