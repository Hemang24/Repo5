'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, CheckCircle, Loader2, AlertCircle, X } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'

interface ImageUploadOCRProps {
  label: string
  hint?: string
  onExtracted: (fields: Record<string, string>, rawText: string) => void
  onFileSelected: (dataUrl: string, mimeType: string) => void
  accept?: Record<string, string[]>
}

export function ImageUploadOCR({
  label,
  hint,
  onExtracted,
  onFileSelected,
  accept,
}: ImageUploadOCRProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const { lang } = useLanguage()
  const intake = translations[lang].intake

  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0]
    if (!file) return

    setStatus('processing')
    setErrorMsg('')

    // Read file as data URL
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl)

      // Extract base64 content (strip prefix)
      const base64 = dataUrl.split(',')[1]
      const mimeType = file.type

      // Notify parent about the file
      onFileSelected(base64, mimeType)

      // Call OCR API
      try {
        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, mimeType }),
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error || 'OCR failed')
        }

        const { rawText, parsedFields } = await response.json()
        onExtracted(parsedFields, rawText)
        setStatus('done')
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'OCR failed')
        setStatus('error')
      }
    }
  }, [onExtracted, onFileSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ?? { 'image/*': ['.jpg', '.jpeg', '.png', '.heic', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    setStatus('idle')
    setPreview(null)
    setErrorMsg('')
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-brown-700">{label}</p>
      {hint && <p className="text-xs text-brown-400">{hint}</p>}

      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all ${
          isDragActive
            ? 'border-warm-500 bg-warm-50'
            : status === 'done'
            ? 'border-sage-400 bg-sage-50'
            : status === 'error'
            ? 'border-red-300 bg-red-50'
            : 'border-warm-200 bg-warm-50 hover:border-warm-400 hover:bg-warm-100'
        }`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="flex items-center gap-3">
            <img src={preview} alt="Preview" className="w-16 h-12 object-cover rounded-lg" />
            <div className="flex-1 min-w-0">
              {status === 'processing' && (
                <div className="flex items-center gap-2 text-warm-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">{intake.processing}</span>
                </div>
              )}
              {status === 'done' && (
                <div className="flex items-center gap-2 text-sage-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">{intake.autofilled}</span>
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-start gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{errorMsg || 'Could not extract text. Please fill in manually.'}</span>
                </div>
              )}
            </div>
            <button onClick={clear} className="p-1 text-brown-400 hover:text-brown-700 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <Upload className="w-8 h-8 text-warm-400" />
            <p className="text-sm text-brown-500">{intake.dragDrop}</p>
            <p className="text-xs text-brown-300">JPG, PNG, HEIC up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  )
}
