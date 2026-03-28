interface HeaderProps {
  title?: string
  subtitle?: string
  right?: React.ReactNode
}

export default function Header({ title, subtitle, right }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur border-b border-slate-800/50 px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div>
          {title && <h1 className="text-lg font-semibold text-slate-100">{title}</h1>}
          {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        </div>
        {right && <div>{right}</div>}
      </div>
    </header>
  )
}
