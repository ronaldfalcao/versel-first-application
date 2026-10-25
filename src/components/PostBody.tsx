import { PortableText, type PortableTextComponents, type PortableTextBlock } from 'next-sanity'
import { safeHref } from '@/lib/format'
import type { SanityImage as SanityImageType } from '@/sanity/types'
import { SanityImage } from './SanityImage'

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImageType & { caption?: string } }) => (
      <figure>
        <SanityImage image={value} sizes="(min-width: 768px) 720px, 100vw" />
        {value.caption && <figcaption>{value.caption}</figcaption>}
      </figure>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href = safeHref(value?.href)
      if (!href) return <>{children}</>
      const external = !href.startsWith('/')
      return (
        <a
          href={href}
          {...(value?.openInNewTab ? { target: '_blank' } : {})}
          {...(external ? { rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    },
  },
}

export function PostBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="prose">
      <PortableText value={value} components={components} />
    </div>
  )
}
