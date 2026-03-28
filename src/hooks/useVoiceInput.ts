'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

type SpeechState = 'idle' | 'listening' | 'done' | 'error'

interface UseVoiceInputReturn {
  state: SpeechState
  transcript: string
  interimTranscript: string
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  reset: () => void
  error: string | null
}

export function useVoiceInput(): UseVoiceInputReturn {
  const [state, setState] = useState<SpeechState>('idle')
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
  }, [])

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    setError(null)
    setInterimTranscript('')
    setState('listening')

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = navigator.language || 'en-US'

    recognition.onresult = (event: any) => {
      let interim = ''
      let final = transcript

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += (final ? ' ' : '') + text
        } else {
          interim += text
        }
      }

      setTranscript(final)
      setInterimTranscript(interim)
    }

    recognition.onerror = (event: any) => {
      if (event.error !== 'aborted') {
        setError(`Mic error: ${event.error}`)
        setState('error')
      }
    }

    recognition.onend = () => {
      setInterimTranscript('')
      setState(prev => prev === 'listening' ? 'done' : prev)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [transcript])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setState('done')
  }, [])

  const reset = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort()
      recognitionRef.current = null
    }
    setTranscript('')
    setInterimTranscript('')
    setError(null)
    setState('idle')
  }, [])

  return { state, transcript, interimTranscript, isSupported, startListening, stopListening, reset, error }
}
