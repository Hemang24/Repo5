'use client'
import { useVoiceInput } from '@/hooks/useVoiceInput'
import Button from '@/components/ui/Button'

interface VoiceInputProps {
  onTranscript: (text: string) => void
}

export default function VoiceInput({ onTranscript }: VoiceInputProps) {
  const { state, transcript, interimTranscript, isSupported, startListening, stopListening, reset } = useVoiceInput()

  if (!isSupported) {
    // Voice input works on: Chrome (Android + Desktop), Edge, Safari (iOS 14.5+)
    // Not supported on: Firefox. Falls back gracefully to text-only.
    return null
  }

  const handleUse = () => {
    onTranscript(transcript)
    reset()
  }

  return (
    <div className="mt-3">
      {state === 'idle' && (
        <button
          type="button"
          onClick={startListening}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors touch-manipulation"
        >
          <span className="text-lg">🎤</span>
          <span>Tap to speak instead</span>
        </button>
      )}

      {state === 'listening' && (
        <div className="bg-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full mic-pulse" />
            <span className="text-sm text-slate-300 font-medium">Listening...</span>
            <button
              type="button"
              onClick={stopListening}
              className="ml-auto text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Stop
            </button>
          </div>
          {(transcript || interimTranscript) && (
            <p className="text-sm text-slate-300 leading-relaxed min-h-[40px]">
              {transcript}
              {interimTranscript && (
                <span className="text-slate-500">{interimTranscript}</span>
              )}
            </p>
          )}
        </div>
      )}

      {state === 'done' && transcript && (
        <div className="bg-slate-800 rounded-xl p-4 space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">{transcript}</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleUse}>Use this</Button>
            <Button size="sm" variant="ghost" onClick={reset}>Discard</Button>
            <Button size="sm" variant="secondary" onClick={startListening}>Re-record</Button>
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="text-sm text-red-400 flex items-center gap-2">
          <span>⚠️</span>
          <span>Could not access microphone. Check permissions.</span>
          <button onClick={reset} className="underline">Retry</button>
        </div>
      )}
    </div>
  )
}
