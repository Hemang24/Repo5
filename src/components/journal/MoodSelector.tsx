'use client'

const moods = [
  { score: 1, emoji: '😖', label: 'Rough' },
  { score: 2, emoji: '😔', label: 'Bad' },
  { score: 3, emoji: '😕', label: 'Low' },
  { score: 4, emoji: '😐', label: 'Meh' },
  { score: 5, emoji: '🙂', label: 'Okay' },
  { score: 6, emoji: '😊', label: 'Good' },
  { score: 7, emoji: '😄', label: 'Great' },
  { score: 8, emoji: '🤩', label: 'Amazing' },
]

interface MoodSelectorProps {
  value: number | null
  onChange: (score: number) => void
}

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-400 mb-3">How are you feeling overall?</p>
      <div className="flex gap-1.5 flex-wrap">
        {moods.map(m => (
          <button
            key={m.score}
            type="button"
            onClick={() => onChange(m.score)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[52px] transition-all touch-manipulation ${
              value === m.score
                ? 'bg-amber-500/20 border border-amber-500/50 scale-105'
                : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
            }`}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-[10px] text-slate-400">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
