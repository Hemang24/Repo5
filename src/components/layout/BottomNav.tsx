'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/journal', label: 'Today', icon: '✏️' },
  { href: '/journal/history', label: 'History', icon: '📖' },
  { href: '/reports', label: 'Insights', icon: '📊' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-slate-800 pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/journal' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-3 px-5 min-w-[64px] touch-manipulation ${
                isActive ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
