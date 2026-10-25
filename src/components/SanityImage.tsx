import { urlFor } from '@/sanity/image'
import type { SanityImage as SanityImageType } from '@/sanity/types'

const WIDTHS = [480, 768, 1080, 1440, 1920]

// As imagens são redimensionadas pelo CDN do Sanity (WebP/AVIF automático), sem consumir
// a cota de otimização de imagens do plano Hobby da Vercel.
export function SanityImage({
  image,
  sizes,
  priority = false,
  className,
}: {
  image: SanityImageType
  sizes: string
  priority?: boolean
  className?: string
}) {
  if (!image.asset) return null
  const { width = 1600, height = 900 } = image.dimensions ?? {}
  const srcSet = WIDTHS.filter((w) => w <= width)
    .concat(width < WIDTHS[0] ? [width] : [])
    .map((w) => `${urlFor(image).width(w).url()} ${w}w`)
    .join(', ')

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={urlFor(image).width(Math.min(width, 1440)).url()}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      alt={image.alt ?? ''}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={className}
    />
  )
}
