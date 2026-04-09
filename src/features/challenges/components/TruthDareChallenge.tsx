import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CheckCircle, MessageCircle, Zap } from 'lucide-react'

interface Prompt {
  vi: string
  en: string
}

interface Props {
  truths: Prompt[]
  dares: Prompt[]
  senderName: string
  receiverName: string
  onComplete: (success: boolean) => void
}

function interpolate(text: string, sender: string, receiver: string) {
  return text.replace(/\{\{sender\}\}/g, sender).replace(/\{\{receiver\}\}/g, receiver)
}

export default function TruthDareChallenge({ truths, dares, senderName, receiverName, onComplete }: Props) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const [mode, setMode] = useState<'truth' | 'dare' | null>(null)
  const [prompt, setPrompt] = useState('')
  const [done, setDone] = useState(false)

  const pick = useCallback((m: 'truth' | 'dare') => {
    const pool = m === 'truth' ? truths : dares
    const item = pool[Math.floor(Math.random() * pool.length)]
    const text = isEn ? item.en : item.vi
    setMode(m)
    setPrompt(interpolate(text, senderName, receiverName))
  }, [truths, dares, isEn, senderName, receiverName])

  const handleDone = useCallback(() => {
    setDone(true)
    setTimeout(() => onComplete(true), 1400)
  }, [onComplete])

  return (
    <div className="w-full max-w-sm mx-auto text-center">
      <AnimatePresence mode="wait">
        {/* Step 1: Choose */}
        {!mode && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-slate-600 font-semibold mb-6 text-base">
              {isEn ? 'What will it be?' : 'Bạn chọn gì nào?'}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-rose-200 bg-white cursor-pointer hover:border-rose-400 transition-colors"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => pick('truth')}
              >
                <MessageCircle size={32} className="text-rose-400" strokeWidth={1.5} />
                <span className="font-bold text-rose-600 text-lg">
                  {isEn ? 'Truth' : 'Thật'}
                </span>
                <span className="text-xs text-slate-400">
                  {isEn ? 'Answer honestly' : 'Trả lời thật lòng'}
                </span>
              </motion.button>

              <motion.button
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-amber-200 bg-white cursor-pointer hover:border-amber-400 transition-colors"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => pick('dare')}
              >
                <Zap size={32} className="text-amber-400" strokeWidth={1.5} />
                <span className="font-bold text-amber-600 text-lg">
                  {isEn ? 'Dare' : 'Thách'}
                </span>
                <span className="text-xs text-slate-400">
                  {isEn ? 'Take the challenge' : 'Thực hiện thử thách'}
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Prompt + Done */}
        {mode && !done && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-5"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: mode === 'truth'
                  ? 'linear-gradient(135deg, #fecdd3, #fda4af)'
                  : 'linear-gradient(135deg, #fef9c3, #fde68a)',
              }}
            >
              {mode === 'truth'
                ? <MessageCircle size={24} className="text-rose-600" strokeWidth={1.5} />
                : <Zap size={24} className="text-amber-500" strokeWidth={1.5} />
              }
            </div>

            <div
              className="w-full rounded-2xl p-5 text-slate-700 font-semibold text-base leading-relaxed border-2"
              style={{
                background: mode === 'truth' ? '#fff1f2' : '#fffbeb',
                borderColor: mode === 'truth' ? '#fda4af' : '#fde68a',
              }}
            >
              {prompt}
            </div>

            <motion.button
              className="px-8 py-3 rounded-xl font-bold text-white cursor-pointer border-none"
              style={{
                background: mode === 'truth'
                  ? 'linear-gradient(135deg, #e11d48, #f43f5e)'
                  : 'linear-gradient(135deg, #d97706, #f59e0b)',
                boxShadow: mode === 'truth'
                  ? '0 6px 20px rgba(225,29,72,0.3)'
                  : '0 6px 20px rgba(217,119,6,0.3)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDone}
            >
              {isEn ? 'Done!' : 'Xong rồi!'}
            </motion.button>

            <p className="text-xs text-slate-400">
              {isEn ? 'Complete it honestly, then tap Done' : 'Hoàn thành thật lòng rồi nhấn Xong'}
            </p>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {done && (
          <motion.div
            key="done"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.6 }}
            className="flex flex-col items-center gap-3"
          >
            <CheckCircle size={60} className="text-green-500" strokeWidth={1.5} />
            <p className="text-xl font-bold text-slate-700">
              {isEn ? 'Awesome!' : 'Tuyệt vời!'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
