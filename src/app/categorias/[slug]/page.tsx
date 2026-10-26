import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Art } from '@/components/Art'
import { PostGrid } from '@/components/PostCard'
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
      <header className="grid items-end gap-8 md:grid-cols-[1fr_16rem]">
        <div className="max-w-2xl">
          <p className="label text-accent">Categoria</p>
          <h1 className="mt-3 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.045em]">
            {category.title}
          </h1>
          {category.description && <p className="mt-5 text-lg leading-relaxed text-muted">{category.description}</p>}
        </div>
        <Art seed={category.slug} cols={4} rows={2} className="hidden aspect-[2/1] rounded-[1.75rem] md:block" />
      </header>
      <div className="mt-16">
        <PostGrid posts={category.posts} />
      </div>
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
