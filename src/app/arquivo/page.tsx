import type { Metadata } from 'next'
import Link from 'next/link'
import { Art } from '@/components/Art'
import { dateParts, readingTime } from '@/lib/format'
import { getArchive } from '@/sanity/fetch'

export const metadata: Metadata = {
  title: 'Arquivo',
  description: 'Todas as entradas do diário, organizadas por ano e mês.',
  alternates: { canonical: '/arquivo' },
}

export default async function ArchivePage() {
  const posts = await getArchive()

  // Ano → mês → entradas, preservando a ordem (mais recentes primeiro)
  const years = new Map<string, Map<string, typeof posts>>()
  for (const post of posts) {
    const { year, month } = dateParts(post.publishedAt)
    const months = years.get(year) ?? years.set(year, new Map()).get(year)!
    months.set(month, [...(months.get(month) ?? []), post])
  }

  return (
    <>
      <header className="grid items-end gap-8 md:grid-cols-[1fr_16rem]">
        <div>
          <p className="label text-accent">
            {posts.length} {posts.length === 1 ? 'entrada' : 'entradas'}
          </p>
          <h1 className="mt-3 font-display text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[0.95] tracking-[-0.045em]">
            Arquivo
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">Tudo o que já foi escrito aqui, do mais recente ao mais antigo.</p>
        </div>
        <Art seed="arquivo" cols={4} rows={2} className="hidden aspect-[2/1] rounded-[1.75rem] md:block" />
      </header>

      {posts.length === 0 && <p className="mt-16 text-muted">As primeiras páginas ainda estão em branco.</p>}

      <div className="mt-16 space-y-20">
        {[...years].map(([year, months]) => (
          <section key={year} aria-labelledby={`ano-${year}`} className="grid gap-8 md:grid-cols-[14rem_1fr]">
            <h2
              id={`ano-${year}`}
              className="outline-text font-display text-7xl font-extrabold leading-none tracking-tight md:sticky md:top-24 md:self-start md:text-8xl"
            >
              {year}
            </h2>
            <div className="space-y-10">
              {[...months].map(([month, entries]) => (
                <div key={month}>
                  <h3 className="label mb-3 flex items-center gap-3 text-muted">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-tangerine" />
                    {month}
                  </h3>
                  <ul className="divide-y divide-line border-y border-line">
                    {entries.map((post) => (
                      <li key={post.slug}>
                        <Link
                          href={`/posts/${post.slug}`}
                          className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 py-5 transition-colors hover:bg-surface sm:grid-cols-[3rem_1fr_auto] sm:px-3"
                        >
                          <span className="font-mono text-sm text-accent">{dateParts(post.publishedAt).day}</span>
                          <span className="font-display text-xl font-bold tracking-tight group-hover:text-accent sm:text-2xl">
                            {post.title}
                          </span>
                          <span className="label col-start-2 text-muted sm:col-start-auto">{readingTime(post.readingMinutes)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
