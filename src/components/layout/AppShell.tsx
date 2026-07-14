import BottomNav from './BottomNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950" style={{ minHeight: '100dvh' }}>
      <main className="flex-1 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
