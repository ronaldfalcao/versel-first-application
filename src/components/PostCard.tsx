import Link from 'next/link'
import { formatShortDate, readingTime } from '@/lib/format'
import type { Category, PostSummary } from '@/sanity/types'
import { Art } from './Art'
import { SanityImage } from './SanityImage'

// Capa: imagem do post ou, na falta dela, a composição geométrica do slug
export function Cover({
  post,
  sizes,
  priority = false,
  cols = 4,
  rows = 3,
  className = '',
}: {
  post: Pick<PostSummary, 'slug' | 'mainImage'>
  sizes: string
  priority?: boolean
  cols?: number
  rows?: number
  className?: string
}) {
  return post.mainImage?.asset ? (
    <SanityImage image={post.mainImage} sizes={sizes} priority={priority} className={`object-cover ${className}`} />
  ) : (
    <Art seed={post.slug} cols={cols} rows={rows} className={className} />
  )
}

export function Chips({ categories }: { categories?: Category[] }) {
  if (!categories?.length) return null
  return (
    <ul className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/categorias/${c.slug}`}
            className="relative z-10 inline-block rounded-full bg-lilac px-3 py-1 text-xs font-semibold text-night transition-colors hover:bg-apricot"
          >
            {c.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function Meta({ post }: { post: PostSummary }) {
  return (
    <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
      <time dateTime={post.publishedAt}>{formatShortDate(post.publishedAt)}</time>
      <span aria-hidden className="h-1 w-1 rounded-full bg-tangerine" />
      <span>{readingTime(post.readingMinutes)}</span>
    </p>
  )
}

// O link do título cobre o cartão inteiro (::after), mantendo um único link acessível
const stretched = 'after:absolute after:inset-0 after:content-[""]'

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-surface transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(43,38,96,0.35)]">
      <Cover
        post={post}
        sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
        className="aspect-[4/3] w-full transition duration-500 group-hover:scale-[1.03]"
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Meta post={post} />
        <h3 className="font-display text-2xl font-bold leading-tight tracking-tight">
          <Link href={`/posts/${post.slug}`} className={stretched}>
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-muted">{post.excerpt}</p>
        <div className="mt-auto pt-2">
          <Chips categories={post.categories} />
        </div>
      </div>
    </article>
  )
}

export function FeaturedPost({ post }: { post: PostSummary }) {
  return (
    <article className="group relative grid overflow-hidden rounded-[2rem] bg-indigo text-on-indigo md:grid-cols-2">
      <Cover
        post={post}
        sizes="(min-width: 768px) 560px, 100vw"
        priority
        cols={4}
        rows={3}
        className="aspect-[4/3] h-full w-full transition duration-500 group-hover:scale-[1.02]"
      />
      <div className="flex flex-col justify-center gap-5 p-8 sm:p-12">
        <p className="label flex flex-wrap items-center gap-x-3 gap-y-2 whitespace-nowrap text-apricot">
          <span className="rounded-full bg-apricot px-2.5 py-1 text-night">Novo</span>
          <time dateTime={post.publishedAt}>{formatShortDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{readingTime(post.readingMinutes)}</span>
        </p>
        <h3 className="font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-[2.6rem]">
          <Link href={`/posts/${post.slug}`} className={stretched}>
            {post.title}
          </Link>
        </h3>
        <p className="text-lg text-on-indigo-muted">{post.excerpt}</p>
        <p className="font-medium text-apricot">
          Ler entrada <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </p>
      </div>
    </article>
  )
}

export function PostGrid({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return <p className="text-muted">Nenhuma entrada por aqui ainda.</p>
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
