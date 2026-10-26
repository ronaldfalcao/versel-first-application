import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Art } from '@/components/Art'
import { PostGrid } from '@/components/PostCard'
import { SectionTitle } from '@/components/SectionTitle'
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
      <header className="grid items-center gap-8 sm:grid-cols-[auto_1fr] sm:gap-10">
        {author.image?.asset ? (
          <SanityImage image={author.image} sizes="160px" className="h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40" />
        ) : (
          <Art seed={author.slug} cols={2} rows={2} className="h-32 w-32 rounded-full sm:h-40 sm:w-40" />
        )}
        <div className="max-w-2xl">
          <p className="label text-accent">Autor</p>
          <h1 className="mt-2 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-none tracking-[-0.04em]">
            {author.name}
          </h1>
          {author.jobTitle && <p className="label mt-3 text-muted">{author.jobTitle}</p>}
          {author.bio && <p className="mt-4 whitespace-pre-line text-lg leading-relaxed">{author.bio}</p>}
          {links.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {links.map((href) => (
                <li key={href}>
                  <a
                    href={href}
                    rel="me noopener noreferrer"
                    className="inline-block rounded-full border border-line px-3 py-1 text-xs font-semibold hover:border-ink"
                  >
                    {new URL(href).hostname.replace(/^www\./, '')}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
      <section aria-labelledby="entradas" className="mt-20">
        <SectionTitle id="entradas">Entradas</SectionTitle>
        <PostGrid posts={author.posts} />
      </section>
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
