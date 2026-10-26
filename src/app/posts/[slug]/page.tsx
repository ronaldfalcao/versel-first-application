import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Art, EndMark } from '@/components/Art'
import { PostBody } from '@/components/PostBody'
import { Chips, Cover, PostGrid } from '@/components/PostCard'
import { SanityImage } from '@/components/SanityImage'
import { SectionTitle } from '@/components/SectionTitle'
import { dateParts, formatDate, readingTime } from '@/lib/format'
import { JsonLd } from '@/lib/jsonld'
import { siteUrl } from '@/sanity/env'
import { getPost, getPostSlugs, getPosts, getSettings } from '@/sanity/fetch'
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
    },
  }
}

async function PostContent({ params }: Pick<PageProps<'/posts/[slug]'>, 'params'>) {
  const { slug } = await params
  const [post, settings, recent] = await Promise.all([getPost(slug), getSettings(), getPosts(4)])
  if (!post) notFound()

  const url = `${siteUrl}/posts/${post.slug}`
  const { weekday } = dateParts(post.publishedAt)
  const more = recent.filter((p) => p.slug !== post.slug).slice(0, 3)

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
          image: post.mainImage?.asset ? urlFor(post.mainImage).width(1200).url() : `${url}/opengraph-image`,
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

      <header className="mx-auto max-w-4xl">
        <Link href="/" className="label inline-flex items-center gap-2 text-muted hover:text-accent">
          ← Todas as entradas
        </Link>
        <div className="mt-8">
          <Chips categories={post.categories} />
        </div>
        <h1 className="mt-6 text-balance font-display text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
          {post.title}
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-muted">{post.excerpt}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
          {post.author && (
            <Link href={`/autores/${post.author.slug}`} rel="author" className="flex items-center gap-3 font-semibold hover:text-accent">
              {post.author.image?.asset ? (
                <SanityImage image={post.author.image} sizes="40px" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <Art seed={post.author.slug} cols={1} rows={1} className="h-10 w-10 rounded-full" />
              )}
              {post.author.name}
            </Link>
          )}
          <p className="label text-muted">
            <time dateTime={post.publishedAt}>
              {weekday}, {formatDate(post.publishedAt)}
            </time>
          </p>
          <p className="label text-muted">{readingTime(post.readingMinutes)}</p>
          {post.updatedAt && (
            <p className="label text-muted">
              Atualizado em <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
            </p>
          )}
        </div>
      </header>

      <Cover
        post={post}
        sizes="(min-width: 1152px) 1088px, 100vw"
        priority
        cols={8}
        rows={3}
        className="mx-auto mt-12 aspect-[8/3] w-full max-w-6xl rounded-[2rem]"
      />

      <div className="mx-auto mt-14 max-w-[68ch]">
        {post.body && <PostBody value={post.body} />}
        <div className="mt-14">
          <EndMark />
        </div>

        {post.author && (
          <aside className="relative mt-14 grid overflow-hidden rounded-[2rem] bg-indigo text-on-indigo sm:grid-cols-[1fr_9rem]">
            <div className="p-8">
              <p className="label text-apricot">Escrito por</p>
              <p className="mt-2 font-display text-2xl font-bold">
                <Link href={`/autores/${post.author.slug}`} className="hover:text-apricot">
                  {post.author.name}
                </Link>
              </p>
              {post.author.jobTitle && <p className="mt-1 text-on-indigo-muted">{post.author.jobTitle}</p>}
              <Link href="/sobre" className="mt-5 inline-block text-sm font-semibold text-apricot hover:underline">
                Sobre o diário →
              </Link>
            </div>
            <div className="relative hidden sm:block">
              <Art seed={post.author.slug} cols={1} rows={2} className="absolute inset-0" />
            </div>
          </aside>
        )}
      </div>

      {more.length > 0 && (
        <section aria-labelledby="mais" className="mx-auto mt-24 max-w-6xl">
          <SectionTitle id="mais" action={{ href: '/arquivo', label: 'Ver arquivo' }}>
            Continue lendo
          </SectionTitle>
          <PostGrid posts={more} />
        </section>
      )}
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
