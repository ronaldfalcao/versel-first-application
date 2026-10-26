import Link from 'next/link'

export function SectionTitle({
  id,
  children,
  action,
}: {
  id: string
  children: React.ReactNode
  action?: { href: string; label: string }
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <h2 id={id} className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        <span aria-hidden className="h-3 w-3 rounded-full bg-tangerine" />
        {children}
      </h2>
      {action && (
        <Link href={action.href} className="text-sm font-semibold text-accent hover:underline">
          {action.label} →
        </Link>
      )}
    </div>
  )
}
