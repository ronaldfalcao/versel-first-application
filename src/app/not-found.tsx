import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <p className="font-display text-7xl font-medium text-accent">404</p>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">Esta página se perdeu</h1>
      <p className="mt-4 font-serif text-lg italic text-muted">
        O conteúdo que você procura não existe ou foi removido.
      </p>
      <Link href="/" className="mt-8 inline-block text-sm text-accent underline decoration-accent-soft decoration-2 hover:decoration-accent">
        Voltar para o início
      </Link>
    </div>
  )
}
