interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'amber' | 'teal' | 'red' | 'purple'
  className?: string
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-slate-800 text-slate-300',
    amber: 'bg-amber-500/20 text-amber-400',
    teal: 'bg-teal-500/20 text-teal-400',
    red: 'bg-red-500/20 text-red-400',
    purple: 'bg-purple-500/20 text-purple-400',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
