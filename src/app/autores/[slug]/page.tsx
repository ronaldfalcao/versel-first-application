import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PostGrid } from '@/components/PostCard'
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
      <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center">
        {author.image && (
          <SanityImage image={author.image} sizes="128px" className="h-32 w-32 rounded-full object-cover" />
        )}
        <div>
          <h1 className="font-serif text-4xl font-bold">{author.name}</h1>
          {author.jobTitle && <p className="mt-1 text-[var(--muted)]">{author.jobTitle}</p>}
          {author.bio && <p className="mt-3 whitespace-pre-line">{author.bio}</p>}
          {links.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-4 text-sm">
              {links.map((href) => (
                <li key={href}>
                  <a href={href} rel="me noopener noreferrer" className="underline">
                    {new URL(href).hostname.replace(/^www\./, '')}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
      <h2 className="mb-6 text-xl font-semibold">Posts</h2>
      <PostGrid posts={author.posts} />
    </>
  )
}

export default function AuthorPage({ params }: PageProps<'/autores/[slug]'>) {
  return (
    <Suspense fallback={<p className="text-[var(--muted)]">Carregando…</p>}>
      <AuthorContent params={params} />
    </Suspense>
  )
}
