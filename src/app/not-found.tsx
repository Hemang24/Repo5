import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl mb-4">🔍</p>
      <h1 className="text-2xl font-bold text-slate-100 mb-2">Page not found</h1>
      <p className="text-slate-400 mb-6">This page doesn&apos;t exist or was moved.</p>
      <Link href="/journal" className="text-amber-400 hover:underline">← Back to journal</Link>
    </div>
  )
}
