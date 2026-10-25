import { PostGrid } from '@/components/PostCard'
import { getPosts, getSettings } from '@/sanity/fetch'

export default async function HomePage() {
  const [settings, posts] = await Promise.all([getSettings(), getPosts()])

  return (
    <>
      <section className="mb-12">
        <h1 className="font-serif text-4xl font-bold">{settings.title}</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">{settings.description}</p>
      </section>
      <PostGrid posts={posts} />
    </>
  )
}
