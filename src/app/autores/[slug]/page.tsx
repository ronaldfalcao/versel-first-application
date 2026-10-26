import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PostList } from '@/components/PostCard'
import { SanityImage } from '@/components/SanityImage'
import { safeHref } from '@/lib/format'
import { JsonLd } from '@/lib/jsonld'
import { siteUrl } from '@/sanity/env'
import { getAuthor, getAuthorSlugs } from '@/sanity/fetch'

export async function generateStaticParams() {
  const slugs = await getAuthorSlugs()
  return slugs.length ? slugs : [{ slug: '__sem-autores__' }]
}

export async function generateMetadata({ params }: PageProps<'/autores/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthor(slug)
  if (!author) return {}
  return {
    title: author.name,
    description: author.bio?.slice(0, 160),
    alternates: { canonical: `/autores/${author.slug}` },
    openGraph: { type: 'profile' },
  }
}

async function AuthorContent({ params }: Pick<PageProps<'/autores/[slug]'>, 'params'>) {
  const { slug } = await params
  const author = await getAuthor(slug)
  if (!author) notFound()

  const links = (author.sameAs ?? []).map(safeHref).filter((href): href is string => Boolean(href))

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: author.name,
            jobTitle: author.jobTitle,
            description: author.bio,
            url: `${siteUrl}/autores/${author.slug}`,
            sameAs: links,
          },
        }}
      />
      <header className="mb-16 flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        {author.image && (
          <SanityImage image={author.image} sizes="128px" className="h-32 w-32 rounded-full object-cover ring-4 ring-accent-soft" />
        )}
        <div>
          <p className="eyebrow text-accent">Autor</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">{author.name}</h1>
          {author.jobTitle && <p className="mt-1 text-muted">{author.jobTitle}</p>}
          {author.bio && <p className="mt-4 whitespace-pre-line font-serif text-lg leading-relaxed">{author.bio}</p>}
          {links.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-4 text-sm">
              {links.map((href) => (
                <li key={href}>
                  <a href={href} rel="me noopener noreferrer" className="text-accent underline decoration-accent-soft decoration-2 hover:decoration-accent">
                    {new URL(href).hostname.replace(/^www\./, '')}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
      <h2 className="ornament eyebrow mb-12">Entradas</h2>
      <PostList posts={author.posts} />
    </>
  )
}

export default function AuthorPage({ params }: PageProps<'/autores/[slug]'>) {
  return (
    <Suspense fallback={<p className="text-muted">Carregando…</p>}>
      <AuthorContent params={params} />
    </Suspense>
  )
}
