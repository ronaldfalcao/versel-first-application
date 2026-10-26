import { artSvg } from '@/lib/art'

// SVG gerado só a partir de números da própria função (a semente vira hash), sem texto do usuário.
export function Art({ seed, cols, rows, className = '' }: { seed: string; cols?: number; rows?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={`overflow-hidden [&>svg]:block [&>svg]:h-full [&>svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: artSvg(seed, cols, rows) }}
    />
  )
}

// Marca do site: quarto de círculo e círculo sobre o índigo
export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <rect width="32" height="32" rx="9" fill="#2B2660" />
      <path d="M6 26V12a14 14 0 0 1 14 14Z" fill="#FFAD7A" />
      <circle cx="22.5" cy="9.5" r="4.5" fill="#C9C3F2" />
    </svg>
  )
}

// Fecho de texto: círculo, quadrado e triângulo
export function EndMark() {
  return (
    <svg viewBox="0 0 72 16" aria-hidden className="mx-auto h-4 w-[4.5rem]">
      <circle cx="8" cy="8" r="7" fill="#F47C3C" />
      <rect x="29" y="1" width="14" height="14" fill="#C9C3F2" />
      <path d="M57 15 64 1l7 14Z" fill="#2B2660" className="dark:fill-[#FFAD7A]" />
    </svg>
  )
}
