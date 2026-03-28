'use client'
import VoiceInput from './VoiceInput'
import Badge from '@/components/ui/Badge'

const categoryColors: Record<string, 'default' | 'amber' | 'teal' | 'purple' | 'red'> = {
  emotions: 'purple',
  productivity: 'amber',
  obstacles: 'red',
  time_management: 'teal',
  growth: 'teal',
  relationships: 'amber',
}

const categoryLabels: Record<string, string> = {
  emotions: 'Emotions',
  productivity: 'Productivity',
  obstacles: 'Obstacles',
  time_management: 'Time',
  growth: 'Growth',
  relationships: 'Relationships',
}

interface QuestionCardProps {
  question: string
  category: string
  index: number
  total: number
  value: string
  onChange: (value: string) => void
}

export default function QuestionCard({ question, category, index, total, value, onChange }: QuestionCardProps) {
  return (
    <div className="slide-up">
      <div className="flex items-center justify-between mb-4">
        <Badge variant={categoryColors[category] ?? 'default'}>
          {categoryLabels[category] ?? category}
        </Badge>
        <span className="text-sm text-slate-500">{index + 1} of {total}</span>
      </div>

      <h2 className="text-xl font-semibold text-slate-100 leading-snug mb-5">
        {question}
      </h2>

      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Take your time. Be honest with yourself…"
        rows={5}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none text-base leading-relaxed"
      />

      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-slate-600">{value.length > 0 ? `${value.trim().split(/\s+/).length} words` : ''}</span>
      </div>

      <VoiceInput onTranscript={text => onChange(value ? value + ' ' + text : text)} />
    </div>
  )
}
