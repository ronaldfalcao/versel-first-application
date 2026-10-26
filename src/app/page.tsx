import { PostList } from '@/components/PostCard'
import { getPosts, getSettings } from '@/sanity/fetch'

export default async function HomePage() {
  const [settings, posts] = await Promise.all([getSettings(), getPosts()])

  return (
    <>
      <section className="mb-16 max-w-2xl sm:mb-20">
        <h1 className="sr-only">{settings.title}</h1>
        <p className="font-serif text-2xl italic leading-snug text-ink sm:text-[2rem]">{settings.description}</p>
      </section>
      <section aria-labelledby="entradas">
        <h2 id="entradas" className="ornament eyebrow mb-12">
          Entradas recentes
        </h2>
        <PostList posts={posts} />
      </section>
    </>
  )
}
