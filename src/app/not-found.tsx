import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="font-serif text-3xl font-bold">Página não encontrada</h1>
      <p className="mt-4 text-[var(--muted)]">O conteúdo que você procura não existe ou foi removido.</p>
      <Link href="/" className="mt-6 inline-block underline">
        Voltar para o início
      </Link>
    </div>
  )
}
