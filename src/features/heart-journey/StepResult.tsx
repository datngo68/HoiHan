import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Heart, Sparkles, PenLine, ArrowRight } from 'lucide-react'

interface Props {
  stepNumber: 1 | 2 | 3
  unlockMessageKey: string
  onContinue: () => void
  autoAdvanceMs?: number
}

const STEP_ICONS = {
  1: Heart,
  2: Sparkles,
  3: PenLine,
}

const STEP_COLORS = {
  1: { bg: 'linear-gradient(135deg, #fecdd3, #fda4af)', icon: 'text-rose-600', glow: 'rgba(225, 29, 72, 0.25)' },
  2: { bg: 'linear-gradient(135deg, #fef9c3, #fde68a)', icon: 'text-amber-500', glow: 'rgba(251, 191, 36, 0.25)' },
  3: { bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', icon: 'text-blue-500', glow: 'rgba(59, 130, 246, 0.25)' },
}

const CONFETTI_COUNT = 12

export default function StepResult({ stepNumber, unlockMessageKey, onContinue, autoAdvanceMs = 2800 }: Props) {
  const { t } = useTranslation()
  const Icon = STEP_ICONS[stepNumber]
  const colors = STEP_COLORS[stepNumber]

  useEffect(() => {
    const timer = setTimeout(onContinue, autoAdvanceMs)
    return () => clearTimeout(timer)
  }, [onContinue, autoAdvanceMs])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.6)' }}
        onClick={onContinue}
      >
        {/* Confetti hearts */}
        {Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
          const angle = (i / CONFETTI_COUNT) * 360
          const distance = 90 + Math.random() * 60
          const endX = Math.cos((angle * Math.PI) / 180) * distance
          const endY = Math.sin((angle * Math.PI) / 180) * distance
          return (
            <motion.div
              key={i}
              className="absolute pointer-events-none"
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{ x: endX, y: endY, scale: [0, 1.2, 0.8], opacity: [1, 1, 0] }}
              transition={{ duration: 1.0, delay: 0.3 + i * 0.04, ease: 'easeOut' }}
            >
              <Heart
                size={10 + (i % 3) * 4}
                fill="currentColor"
                strokeWidth={0}
                className={
                  ['text-rose-400', 'text-pink-300', 'text-amber-300', 'text-rose-300'][i % 4]
                }
              />
            </motion.div>
          )
        })}

        {/* Main card */}
        <motion.div
          className="flex flex-col items-center text-center max-w-xs mx-4 pointer-events-none"
          initial={{ scale: 0.6, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <motion.div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-5"
            style={{ background: colors.bg, boxShadow: `0 12px 40px ${colors.glow}` }}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: [1.2, 1], rotate: [15, 0] }}
            transition={{ delay: 0.1, duration: 0.7, type: 'spring', bounce: 0.6 }}
          >
            <Icon size={40} className={colors.icon} strokeWidth={1.5} />
          </motion.div>

          {/* Unlock message */}
          <motion.h3
            className="text-2xl font-bold text-slate-800 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            {t(unlockMessageKey)}
          </motion.h3>

          <motion.p
            className="text-sm text-slate-500 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {t('heartJourney.continueBtn')} →
          </motion.p>

          <motion.button
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer border-none"
            style={{ background: 'linear-gradient(135deg, #e11d48, #f43f5e)', boxShadow: '0 6px 20px rgba(225, 29, 72, 0.3)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onContinue() }}
          >
            {t('heartJourney.continueBtn')}
            <ArrowRight size={16} strokeWidth={2.5} />
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
