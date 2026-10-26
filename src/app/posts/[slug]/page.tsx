import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PostBody } from '@/components/PostBody'
import { SanityImage } from '@/components/SanityImage'
import { dateParts, formatDate, readingTime } from '@/lib/format'
import { JsonLd } from '@/lib/jsonld'
import { siteUrl } from '@/sanity/env'
import { getPost, getPostSlugs, getSettings } from '@/sanity/fetch'
import { urlFor } from '@/sanity/image'

// Cache Components exige ao menos um parâmetro; o marcador resolve para 404.
const PLACEHOLDER = '__sem-posts__'

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.length ? slugs.map(({ slug }) => ({ slug })) : [{ slug: PLACEHOLDER }]
}

export async function generateMetadata({ params }: PageProps<'/posts/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.excerpt
  const image = post.mainImage?.asset
    ? [{ url: urlFor(post.mainImage).width(1200).height(630).url(), width: 1200, height: 630, alt: post.mainImage.alt }]
    : undefined

  return {
    title,
    description,
    alternates: { canonical: `/posts/${post.slug}` },
    authors: post.author ? [{ name: post.author.name, url: `/autores/${post.author.slug}` }] : undefined,
    robots: post.seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/posts/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: post.author ? [`${siteUrl}/autores/${post.author.slug}`] : undefined,
      tags: post.categories?.map((c) => c.title),
      images: image,
    },
  }
}

async function PostContent({ params }: Pick<PageProps<'/posts/[slug]'>, 'params'>) {
  const { slug } = await params
  const [post, settings] = await Promise.all([getPost(slug), getSettings()])
  if (!post) notFound()

  const url = `${siteUrl}/posts/${post.slug}`
  const { weekday } = dateParts(post.publishedAt)

  return (
    <article>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          '@id': url,
          mainEntityOfPage: url,
          headline: post.title,
          description: post.seo?.metaDescription || post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt ?? post.publishedAt,
          inLanguage: 'pt-BR',
          image: post.mainImage?.asset ? urlFor(post.mainImage).width(1200).url() : undefined,
          keywords: post.categories?.map((c) => c.title).join(', '),
          author: post.author && {
            '@type': 'Person',
            name: post.author.name,
            url: `${siteUrl}/autores/${post.author.slug}`,
            jobTitle: post.author.jobTitle,
          },
          publisher: { '@type': 'Organization', name: settings.title, url: siteUrl },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Início', item: siteUrl },
            ...(post.categories?.[0]
              ? [{ '@type': 'ListItem', position: 2, name: post.categories[0].title, item: `${siteUrl}/categorias/${post.categories[0].slug}` }]
              : []),
            { '@type': 'ListItem', position: post.categories?.[0] ? 3 : 2, name: post.title, item: url },
          ],
        }}
      />

      <header className="mx-auto max-w-[44rem] text-center">
        <p className="eyebrow text-muted">
          <time dateTime={post.publishedAt}>
            {weekday}, {formatDate(post.publishedAt)}
          </time>
        </p>
        {post.categories && post.categories.length > 0 && (
          <p className="eyebrow mt-3 text-accent">
            {post.categories.map((c, i) => (
              <span key={c.slug}>
                {i > 0 && ' · '}
                <Link href={`/categorias/${c.slug}`} className="hover:underline">
                  {c.title}
                </Link>
              </span>
            ))}
          </p>
        )}
        <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-[3.4rem]">
          {post.title}
        </h1>
        <p className="mx-auto mt-6 max-w-[36rem] text-pretty font-serif text-xl italic leading-relaxed text-muted">
          {post.excerpt}
        </p>
        <p className="mt-8 text-sm text-muted">
          {post.author && (
            <>
              Por{' '}
              <Link href={`/autores/${post.author.slug}`} rel="author" className="font-medium text-ink hover:text-accent">
                {post.author.name}
              </Link>{' '}
              ·{' '}
            </>
          )}
          {readingTime(post.readingMinutes)}
          {post.updatedAt && (
            <>
              {' '}
              · Atualizado em <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
            </>
          )}
        </p>
      </header>

      {post.mainImage ? (
        <figure className="mx-auto mt-12 max-w-4xl">
          <SanityImage image={post.mainImage} sizes="(min-width: 960px) 896px, 100vw" priority className="w-full rounded-md" />
        </figure>
      ) : (
        <div className="ornament mx-auto mt-12 max-w-[44rem]" aria-hidden>
          ✦
        </div>
      )}

      <div className="mx-auto mt-12 max-w-[42rem]">
        {post.body && <PostBody value={post.body} />}
        <p className="mt-12 text-center text-accent" aria-hidden>
          ✦
        </p>
        {post.author && (
          <aside className="mt-12 flex items-center gap-5 rounded-lg bg-paper-deep p-6">
            {post.author.image && (
              <SanityImage image={post.author.image} sizes="64px" className="h-16 w-16 shrink-0 rounded-full object-cover" />
            )}
            <div>
              <p className="eyebrow text-muted">Escrito por</p>
              <p className="mt-1 font-display text-lg font-semibold">
                <Link href={`/autores/${post.author.slug}`} className="hover:text-accent">
                  {post.author.name}
                </Link>
              </p>
              {post.author.jobTitle && <p className="text-sm text-muted">{post.author.jobTitle}</p>}
            </div>
          </aside>
        )}
        <p className="mt-10 text-center text-sm">
          <Link href="/" className="text-muted hover:text-accent">
            ← Todas as entradas
          </Link>
        </p>
      </div>
    </article>
  )
}

export default function PostPage({ params }: PageProps<'/posts/[slug]'>) {
  return (
    <Suspense fallback={<p className="text-center text-muted">Carregando…</p>}>
      <PostContent params={params} />
    </Suspense>
  )
}
