const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo',
})

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso))

// Aceita apenas links http(s), mailto ou relativos; qualquer outro esquema é descartado.
export function safeHref(href: unknown): string | undefined {
  if (typeof href !== 'string') return undefined
  if (href.startsWith('/') && !href.startsWith('//')) return href
  try {
    const { protocol } = new URL(href)
    return ['http:', 'https:', 'mailto:'].includes(protocol) ? href : undefined
  } catch {
    return undefined
  }
}
