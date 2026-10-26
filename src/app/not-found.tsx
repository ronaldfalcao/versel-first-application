import Link from 'next/link'
import { Art } from '@/components/Art'

export default function NotFound() {
  return (
    <div className="grid items-center gap-10 py-6 md:grid-cols-2 md:gap-16">
      <Art seed="404" cols={3} rows={3} className="aspect-square w-full max-w-md rounded-[2.5rem]" />
      <div>
        <p className="label text-accent">Erro 404</p>
        <h1 className="mt-3 font-display text-[clamp(2.75rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
          Esta página se perdeu
        </h1>
        <p className="mt-5 max-w-md text-lg text-muted">O conteúdo que você procura não existe ou foi removido.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-accent">
            Voltar para o início
          </Link>
          <Link href="/arquivo" className="rounded-full border border-line px-6 py-3 text-sm font-semibold transition-colors hover:border-ink">
            Ver o arquivo
          </Link>
        </div>
      </div>
    </div>
  )
}
