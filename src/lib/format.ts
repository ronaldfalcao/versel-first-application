const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo',
})

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso))

const partsFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  weekday: 'long',
  timeZone: 'America/Sao_Paulo',
})

// Partes da data para o cabeçalho das entradas ("26", "out", "2026", "domingo")
export function dateParts(iso: string) {
  const parts = Object.fromEntries(partsFormatter.formatToParts(new Date(iso)).map((p) => [p.type, p.value]))
  return { day: parts.day, month: parts.month.replace('.', ''), year: parts.year, weekday: parts.weekday }
}

export const readingTime = (minutes?: number) => `${Math.max(1, minutes ?? 1)} min de leitura`

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
