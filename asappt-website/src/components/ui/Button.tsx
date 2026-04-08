import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
          {
            // Variants
            'bg-warm-500 text-white hover:bg-warm-600 focus:ring-warm-400 shadow-sm': variant === 'primary',
            'bg-sage-500 text-white hover:bg-sage-600 focus:ring-sage-400 shadow-sm': variant === 'secondary',
            'text-warm-600 hover:bg-warm-100 focus:ring-warm-300': variant === 'ghost',
            'border-2 border-warm-500 text-warm-600 hover:bg-warm-50 focus:ring-warm-300': variant === 'outline',
            // Sizes
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-5 py-2.5 text-sm': size === 'md',
            'px-7 py-3.5 text-base': size === 'lg',
          }
        ),
        className
      )}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {children}
        </>
      ) : children}
    </button>
  )
}
