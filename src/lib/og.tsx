import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { artDataUri, PALETTE } from './art'

export const OG_SIZE = { width: 1200, height: 630 }

const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file))
const fonts = Promise.all([
  font('bricolage-grotesque-latin-800-normal.woff'),
  font('geist-sans-latin-500-normal.woff'),
])

// Cartão 1200×630: texto à esquerda sobre o índigo, composição geométrica à direita
export async function ogImage({ eyebrow, title, footer, seed }: { eyebrow: string; title: string; footer: string; seed: string }) {
  const [display, sans] = await fonts
  const titleSize = title.length > 70 ? 54 : title.length > 40 ? 66 : 80

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: PALETTE.indigo }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 690, padding: '64px 56px 56px 72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: PALETTE.apricot, fontFamily: 'Geist', fontSize: 26 }}>
            <div style={{ width: 18, height: 18, borderRadius: 999, background: PALETTE.tangerine }} />
            {eyebrow}
          </div>
          <div
            style={{
              display: 'flex',
              color: PALETTE.paper,
              fontFamily: 'Bricolage',
              fontSize: titleSize,
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
            }}
          >
            {title}
          </div>
          <div style={{ display: 'flex', color: PALETTE.lilac, fontFamily: 'Geist', fontSize: 26 }}>{footer}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artDataUri(seed, 3, 3)} width={510} height={630} alt="" style={{ objectFit: 'cover' }} />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Bricolage', data: display, weight: 800, style: 'normal' },
        { name: 'Geist', data: sans, weight: 500, style: 'normal' },
      ],
    },
  )
}
