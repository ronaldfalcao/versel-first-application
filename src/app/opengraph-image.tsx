import { getSettings } from '@/sanity/fetch'
import { OG_SIZE, ogImage } from '@/lib/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'Diário Perdido'

export default async function Image() {
  const settings = await getSettings()
  return ogImage({
    eyebrow: 'diarioperdido.com.br',
    title: settings.title,
    footer: settings.description.length > 90 ? `${settings.description.slice(0, 88)}…` : settings.description,
    seed: settings.title,
  })
}
