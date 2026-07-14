interface ProgressBarProps {
  value: number
  max: number
  className?: string
  color?: string
}

export default function ProgressBar({ value, max, className = '', color = 'bg-amber-500' }: ProgressBarProps) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className={`w-full h-1.5 bg-slate-800 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full ${color} rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
