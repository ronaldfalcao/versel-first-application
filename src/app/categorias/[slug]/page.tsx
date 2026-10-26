import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PostList } from '@/components/PostCard'
import { getCategory, getCategorySlugs } from '@/sanity/fetch'

export async function generateStaticParams() {
  const slugs = await getCategorySlugs()
  return slugs.length ? slugs : [{ slug: '__sem-categorias__' }]
}

export async function generateMetadata({ params }: PageProps<'/categorias/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return {}
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/categorias/${category.slug}` },
  }
}

async function CategoryContent({ params }: Pick<PageProps<'/categorias/[slug]'>, 'params'>) {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) notFound()

  return (
    <>
      <header className="mb-16 max-w-2xl">
        <p className="eyebrow text-accent">Categoria</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{category.title}</h1>
        {category.description && (
          <p className="mt-4 font-serif text-xl italic leading-relaxed text-muted">{category.description}</p>
        )}
      </header>
      <PostList posts={category.posts} />
    </>
  )
}

export default function CategoryPage({ params }: PageProps<'/categorias/[slug]'>) {
  return (
    <Suspense fallback={<p className="text-muted">Carregando…</p>}>
      <CategoryContent params={params} />
    </Suspense>
  )
}
