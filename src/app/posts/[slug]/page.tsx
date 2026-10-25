import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PostBody } from '@/components/PostBody'
import { SanityImage } from '@/components/SanityImage'
import { formatDate } from '@/lib/format'
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

      <header className="mb-8">
        {post.categories && post.categories.length > 0 && (
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-[var(--accent)]">
            {post.categories.map((c, i) => (
              <span key={c.slug}>
                {i > 0 && ' · '}
                <Link href={`/categorias/${c.slug}`}>{c.title}</Link>
              </span>
            ))}
          </p>
        )}
        <h1 className="font-serif text-4xl font-bold leading-tight">{post.title}</h1>
        <p className="mt-4 text-lg text-[var(--muted)]">{post.excerpt}</p>
        <p className="mt-4 text-sm text-[var(--muted)]">
          {post.author && (
            <>
              Por{' '}
              <Link href={`/autores/${post.author.slug}`} rel="author" className="underline">
                {post.author.name}
              </Link>{' '}
              ·{' '}
            </>
          )}
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.updatedAt && (
            <>
              {' '}
              · Atualizado em <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
            </>
          )}
        </p>
      </header>

      {post.mainImage && (
        <SanityImage
          image={post.mainImage}
          sizes="(min-width: 768px) 768px, 100vw"
          priority
          className="mb-10 w-full rounded-lg"
        />
      )}

      {post.body && <PostBody value={post.body} />}
    </article>
  )
}

export default function PostPage({ params }: PageProps<'/posts/[slug]'>) {
  return (
    <Suspense fallback={<p className="text-[var(--muted)]">Carregando…</p>}>
      <PostContent params={params} />
    </Suspense>
  )
}
