import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { SANITY_TAG } from '@/sanity/fetch'

// Chamado pelo webhook do Sanity a cada publicação. A requisição só é aceita se a
// assinatura HMAC (cabeçalho sanity-webhook-signature) bater com SANITY_REVALIDATE_SECRET.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret || secret.length < 32) {
    console.error('SANITY_REVALIDATE_SECRET ausente ou curto demais')
    return new Response('Not configured', { status: 500 })
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true)
    if (!isValidSignature) return new Response('Invalid signature', { status: 401 })
    if (!body?._type) return new Response('Bad request', { status: 400 })

    // expire: 0 → o próximo visitante já recebe o conteúdo novo (sem servir a versão antiga)
    revalidateTag(SANITY_TAG, { expire: 0 })
    return Response.json({ revalidated: true })
  } catch {
    return new Response('Bad request', { status: 400 })
  }
}
