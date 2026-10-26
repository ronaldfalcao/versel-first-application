// Composições geométricas generativas (grade Bauhaus). A mesma semente sempre gera a
// mesma arte, então cada post tem uma "capa" própria e estável, usada no site e no OG.

export const PALETTE = {
  paper: '#FBF7F2',
  cream: '#F3E6D6',
  peach: '#FFD3B6',
  apricot: '#FFAD7A',
  tangerine: '#F47C3C',
  lilac: '#C9C3F2',
  indigo: '#2B2660',
} as const

type Color = keyof typeof PALETTE

// Fundo → cores de forma que contrastam bem com ele
const PAIRS: Record<Color, Color[]> = {
  paper: ['tangerine', 'indigo', 'apricot', 'lilac'],
  cream: ['tangerine', 'indigo', 'apricot', 'lilac'],
  peach: ['tangerine', 'indigo', 'paper'],
  lilac: ['indigo', 'paper', 'tangerine'],
  indigo: ['apricot', 'peach', 'lilac', 'tangerine'],
  apricot: ['indigo', 'paper', 'peach'],
  tangerine: ['paper', 'indigo', 'peach'],
}

const BACKGROUNDS: [Color, number][] = [
  ['cream', 3],
  ['peach', 2],
  ['lilac', 1.5],
  ['indigo', 1.5],
  ['apricot', 1],
]

function random(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  return () => {
    h = (h + 0x6d2b79f5) | 0
    let t = Math.imul(h ^ (h >>> 15), 1 | h)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const S = 100

function cell(rand: () => number, x: number, y: number): string {
  const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)]
  const total = BACKGROUNDS.reduce((sum, [, w]) => sum + w, 0)
  let r = rand() * total
  const bg = BACKGROUNDS.find(([, w]) => (r -= w) < 0)?.[0] ?? 'cream'
  const fg = PALETTE[pick(PAIRS[bg])]
  const rot = `rotate(${pick([0, 90, 180, 270])} ${x + S / 2} ${y + S / 2})`

  const shapes = [
    `<circle cx="${x + 50}" cy="${y + 50}" r="40" fill="${fg}"/>`,
    `<path d="M${x} ${y}H${x + S}A${S} ${S} 0 0 1 ${x} ${y + S}Z" fill="${fg}" transform="${rot}"/>`,
    `<path d="M${x} ${y + S}A50 50 0 0 1 ${x + S} ${y + S}Z" fill="${fg}" transform="${rot}"/>`,
    `<path d="M${x} ${y}H${x + S}L${x} ${y + S}Z" fill="${fg}" transform="${rot}"/>`,
    `<circle cx="${x + 50}" cy="${y + 50}" r="31" fill="none" stroke="${fg}" stroke-width="14"/>`,
    [22, 42, 62, 82].map((ly) => `<rect x="${x + 14}" y="${y + ly - 3}" width="72" height="6" rx="3" fill="${fg}"/>`).join(''),
    [25, 50, 75].flatMap((dx) => [25, 50, 75].map((dy) => `<circle cx="${x + dx}" cy="${y + dy}" r="7" fill="${fg}"/>`)).join(''),
    `<rect x="${x + 25}" y="${y + 25}" width="50" height="50" fill="${fg}" transform="rotate(45 ${x + 50} ${y + 50})"/>`,
    '',
  ]
  return `<rect x="${x}" y="${y}" width="${S + 1}" height="${S + 1}" fill="${PALETTE[bg]}"/>${pick(shapes)}`
}

export function artSvg(seed: string, cols = 4, rows = 3): string {
  const rand = random(seed)

  // Um bloco 2×2 limpo recebe a forma maior, que ancora a composição
  const anchor = cols >= 2 && rows >= 2 ? { col: Math.floor(rand() * (cols - 1)), row: Math.floor(rand() * (rows - 1)) } : null
  const inAnchor = (col: number, row: number) =>
    anchor !== null && col - anchor.col >= 0 && col - anchor.col < 2 && row - anchor.row >= 0 && row - anchor.row < 2

  let body = ''
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < cols; col++) if (!inAnchor(col, row)) body += cell(rand, col * S, row * S)

  if (anchor) {
    const x = anchor.col * S
    const y = anchor.row * S
    const [bg, fg] = ([
      ['indigo', 'apricot'],
      ['peach', 'tangerine'],
      ['tangerine', 'peach'],
      ['lilac', 'indigo'],
      ['cream', 'tangerine'],
    ] as const)[Math.floor(rand() * 5)]
    const rot = `rotate(${[0, 90, 180, 270][Math.floor(rand() * 4)]} ${x + S} ${y + S})`
    const shapes = [
      `<circle cx="${x + S}" cy="${y + S}" r="${S * 0.8}" fill="${PALETTE[fg]}"/>`,
      `<path d="M${x} ${y + 2 * S}A${S} ${S} 0 0 1 ${x + 2 * S} ${y + 2 * S}Z" fill="${PALETTE[fg]}" transform="${rot}"/>`,
      `<path d="M${x} ${y}H${x + 2 * S}A${2 * S} ${2 * S} 0 0 1 ${x} ${y + 2 * S}Z" fill="${PALETTE[fg]}" transform="${rot}"/>`,
      `<circle cx="${x + S}" cy="${y + S}" r="${S * 0.62}" fill="none" stroke="${PALETTE[fg]}" stroke-width="${S * 0.32}"/>`,
    ]
    body += `<rect x="${x}" y="${y}" width="${2 * S + 1}" height="${2 * S + 1}" fill="${PALETTE[bg]}"/>${shapes[Math.floor(rand() * shapes.length)]}`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols * S} ${rows * S}" preserveAspectRatio="xMidYMid slice">${body}</svg>`
}

export const artDataUri = (seed: string, cols?: number, rows?: number) =>
  `data:image/svg+xml;base64,${Buffer.from(artSvg(seed, cols, rows)).toString('base64')}`
