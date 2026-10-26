import Link from 'next/link'
import { Art } from '@/components/Art'
import { FeaturedPost, PostGrid } from '@/components/PostCard'
import { SectionTitle } from '@/components/SectionTitle'
import { getPosts, getSettings } from '@/sanity/fetch'

export default async function HomePage() {
  const [settings, posts] = await Promise.all([getSettings(), getPosts()])
  const [latest, ...rest] = posts
  const words = settings.title.split(' ')

  return (
    <>
      <section className="grid items-center gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16">
        <div>
          <h1 className="font-display text-[clamp(3.25rem,9vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.045em]">
            {words.slice(0, -1).join(' ')}{' '}
            <span className="text-accent">{words.at(-1)}</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{settings.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {latest && (
              <Link
                href={`/posts/${latest.slug}`}
                className="group rounded-full bg-ink px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-accent"
              >
                Ler a última entrada <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            )}
            <Link
              href="/sobre"
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold transition-colors hover:border-ink"
            >
              Sobre o diário
            </Link>
          </div>
        </div>
        <Art seed={settings.title} cols={4} rows={4} className="aspect-square w-full rounded-[2.5rem]" />
      </section>

      {latest && (
        <section aria-labelledby="destaque" className="mt-24">
          <SectionTitle id="destaque">Última entrada</SectionTitle>
          <FeaturedPost post={latest} />
        </section>
      )}

      <section aria-labelledby="entradas" className="mt-20">
        <SectionTitle id="entradas" action={{ href: '/arquivo', label: 'Ver arquivo' }}>
          Entradas recentes
        </SectionTitle>
        {posts.length === 0 ? (
          <p className="text-muted">As primeiras páginas ainda estão em branco.</p>
        ) : rest.length > 0 ? (
          <PostGrid posts={rest} />
        ) : (
          <p className="text-muted">Por enquanto, só a entrada acima. As próximas aparecem aqui.</p>
        )}
      </section>
    </>
  )
}
