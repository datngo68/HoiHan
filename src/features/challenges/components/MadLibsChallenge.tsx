import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Shuffle, Heart } from 'lucide-react'

interface Template {
  vi: string
  en: string
}

interface OptionSet {
  vi: string[]
  en: string[]
}

interface Props {
  templates: Template[]
  options: OptionSet[]
  senderName: string
  receiverName: string
  onComplete: (success: boolean) => void
}

function interpolate(tpl: string, sender: string, receiver: string) {
  return tpl.replace(/\{\{sender\}\}/g, sender).replace(/\{\{receiver\}\}/g, receiver)
}

export default function MadLibsChallenge({ templates, options, senderName, receiverName, onComplete }: Props) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const [templateIdx] = useState(() => Math.floor(Math.random() * templates.length))
  const template = templates[templateIdx]
  const optionSet = options[templateIdx]

  const rawOptions = isEn ? optionSet.en : optionSet.vi
  const [shuffled] = useState(() => [...rawOptions].sort(() => Math.random() - 0.5))

  const [chosen, setChosen] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  const rawTemplate = isEn ? template.en : template.vi

  const handlePick = useCallback((opt: string) => {
    if (chosen) return
    setChosen(opt)
    setTimeout(() => {
      setRevealed(true)
      setTimeout(() => onComplete(true), 1600)
    }, 600)
  }, [chosen, onComplete])

  // Render sentence with blank or filled word in rose
  const renderSentence = () => {
    const parts = interpolate(rawTemplate, senderName, receiverName).split('___')
    if (parts.length === 1) return <span>{parts[0]}</span>
    return (
      <span>
        {parts[0]}
        {chosen ? (
          <motion.span
            className="text-rose-600 font-bold"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            {chosen}
          </motion.span>
        ) : (
          <span className="inline-block w-24 border-b-2 border-dashed border-rose-300 mx-1" />
        )}
        {parts[1]}
      </span>
    )
  }

  return (
    <div className="w-full max-w-sm mx-auto text-center">
      {/* Sentence display */}
      <motion.div
        className="bg-rose-50/80 border border-rose-100 rounded-2xl p-5 mb-6 text-lg font-semibold text-slate-700 leading-relaxed min-h-[90px] flex items-center justify-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {renderSentence()}
      </motion.div>

      {/* Options */}
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="options"
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {shuffled.map((opt, i) => (
              <motion.button
                key={opt}
                className="px-4 py-3 rounded-xl font-semibold text-sm cursor-pointer border-2 transition-colors"
                style={{
                  background: chosen === opt
                    ? 'linear-gradient(135deg, #fecdd3, #fda4af)'
                    : 'white',
                  borderColor: chosen === opt ? '#f43f5e' : '#fecdd3',
                  color: chosen === opt ? '#be123c' : '#64748b',
                  opacity: chosen && chosen !== opt ? 0.4 : 1,
                }}
                whileHover={!chosen ? { scale: 1.04 } : undefined}
                whileTap={!chosen ? { scale: 0.96 } : undefined}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handlePick(opt)}
                disabled={!!chosen}
              >
                {opt}
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            <Heart size={48} className="text-rose-500" fill="currentColor" strokeWidth={0} />
            <p className="text-rose-600 font-bold text-lg">
              {isEn ? 'Perfect sentence!' : 'Câu hoàn hảo!'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-slate-400">
        <Shuffle size={12} />
        {isEn ? 'Choose a word to complete' : 'Chọn từ để hoàn thành câu'}
      </div>
    </div>
  )
}
