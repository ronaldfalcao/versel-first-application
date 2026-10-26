import type { Metadata } from 'next'
import Link from 'next/link'
import { Art } from '@/components/Art'
import { PostBody } from '@/components/PostBody'
import { SanityImage } from '@/components/SanityImage'
import { safeHref } from '@/lib/format'
import { JsonLd } from '@/lib/jsonld'
import { siteUrl } from '@/sanity/env'
import { getAuthors, getSettings } from '@/sanity/fetch'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: 'Sobre',
    description: settings.description,
    alternates: { canonical: '/sobre' },
  }
}

export default async function AboutPage() {
  const [settings, authors] = await Promise.all([getSettings(), getAuthors()])

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          url: `${siteUrl}/sobre`,
          name: `Sobre · ${settings.title}`,
          about: { '@type': 'Blog', name: settings.title, url: siteUrl },
        }}
      />
      <header className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
        <div>
          <p className="label text-accent">Sobre</p>
          <h1 className="mt-3 font-display text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[0.95] tracking-[-0.045em]">
            {settings.title}
          </h1>
          <p className="mt-6 max-w-lg text-xl leading-relaxed text-muted">{settings.description}</p>
        </div>
        <Art seed="sobre" cols={3} rows={3} className="aspect-square w-full rounded-[2.5rem]" />
      </header>

      {settings.about && settings.about.length > 0 && (
        <div className="mx-auto mt-20 max-w-[68ch]">
          <PostBody value={settings.about} />
        </div>
      )}

      {authors.length > 0 && (
        <section aria-labelledby="quem-escreve" className="mt-24">
          <h2 id="quem-escreve" className="mb-8 flex items-center gap-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            <span aria-hidden className="h-3 w-3 rounded-full bg-tangerine" />
            Quem escreve
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {authors.map((author) => {
              const links = (author.sameAs ?? []).map(safeHref).filter((href): href is string => Boolean(href))
              return (
                <article key={author.slug} className="flex gap-6 rounded-[1.75rem] bg-surface p-7">
                  {author.image?.asset ? (
                    <SanityImage image={author.image} sizes="96px" className="h-24 w-24 shrink-0 rounded-full object-cover" />
                  ) : (
                    <Art seed={author.slug} cols={2} rows={2} className="h-24 w-24 shrink-0 rounded-full" />
                  )}
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight">
                      <Link href={`/autores/${author.slug}`} className="hover:text-accent">
                        {author.name}
                      </Link>
                    </h3>
                    {author.jobTitle && <p className="label mt-1 text-muted">{author.jobTitle}</p>}
                    {author.bio && <p className="mt-3 whitespace-pre-line leading-relaxed">{author.bio}</p>}
                    {links.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-2">
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
                </article>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
