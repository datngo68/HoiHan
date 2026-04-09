import { useState, useCallback, useRef } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Heart, ThumbsDown } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { playSfx } from '../../hooks/useAudio'

export default function QuestionScreen() {
  const { t } = useTranslation()
  const { session, config, setScreen, recordRefusal, resetJourney } = useAppStore()
  const [tooltipText, setTooltipText] = useState('')
  const [dodgeCount, setDodgeCount] = useState(0)
  const noButtonRef = useRef<HTMLButtonElement>(null)

  const variantIndex = session.refusalCount % 12
  const questionText = t(`question.variants.${variantIndex}`, {
    receiver: config.receiverName,
    sender: config.senderName,
  }) || t('question.variants.0', {
    receiver: config.receiverName,
    sender: config.senderName,
  })

  const tooltips = t('question.noTooltips', { returnObjects: true }) as string[]

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-100, 100], [-15, 15])

  const dodgeNoButton = useCallback((e?: any) => {
    if (e?.shiftKey || dodgeCount >= 15) {
      return
    }

    const nextCount = dodgeCount + 1
    setDodgeCount(nextCount)

    // Play "fail" sound with increasing pitch
    const pitch = Math.min(2.0, 1.0 + dodgeCount * 0.08)
    playSfx('fail', pitch)

    if (nextCount >= 15) {
      // Khi đạt giới hạn (15 lần), nút trở về chính giữa và ĐỨNG YÊN
      x.set(0)
      y.set(0)
      setTooltipText(t('question.maxDodgeTooltip'))
    } else {
      // Progressive scale: jumps further as user gets more frustrated
      const currentScale = Math.min(1 + dodgeCount * 0.15, 2.5)
      const maxX = 120 * currentScale
      const maxY = 90 * currentScale
      const newX = (Math.random() - 0.5) * 2 * maxX
      const newY = (Math.random() - 0.5) * 2 * maxY
      x.set(newX)
      y.set(newY)

      const tip = tooltips[Math.floor(Math.random() * tooltips.length)]
      setTooltipText(tip)
    }
  }, [x, y, tooltips, dodgeCount])

  const handleNoClick = useCallback((e: any) => {
    if (e?.shiftKey || dodgeCount >= 15) {
      setDodgeCount(0)
      playSfx('click')
      recordRefusal()
      setScreen('challenge')
      return
    }
    dodgeNoButton(e)
  }, [dodgeNoButton, dodgeCount, recordRefusal, setScreen])

  const handleYes = useCallback(() => {
    playSfx('pop')
    resetJourney()
    setScreen('heart-journey')
  }, [setScreen, resetJourney])

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-dvh px-6 text-center relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Decorative sparkle dots */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${10 + (i * 12) % 80}%`,
              top: `${15 + (i * 11) % 70}%`,
              width: 6 + (i % 3) * 2,
              height: 6 + (i % 3) * 2,
              background: `hsl(${340 + i * 5}, 80%, ${75 + i * 2}%)`,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2.5 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.6,
            }}
          />
        ))}
      </div>

      {/* Question heart — SVG */}
      <motion.div
        className="mb-8"
        animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Heart size={52} className="text-rose-500" fill="currentColor" strokeWidth={0} />
      </motion.div>

      {/* Question text */}
      <motion.h1
        key={variantIndex}
        className="text-3xl md:text-4xl font-bold mb-12 max-w-md leading-snug"
        style={{
          fontFamily: 'var(--font-display)',
          background: 'linear-gradient(135deg, #9f1239, #e11d48)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {questionText}
      </motion.h1>

      {/* Visual Novel Chat Bubble */}
      <div className="h-24 mb-4 flex items-center justify-center w-full max-w-sm pointer-events-none">
        <AnimatePresence mode="popLayout">
          {tooltipText && (
            <motion.div
              key={tooltipText}
              className="relative text-rose-800 font-bold text-base md:text-lg px-6 py-4 rounded-xl shadow-[0_4px_20px_rgba(225,29,72,0.1)] border border-white/60 bg-white/80 backdrop-blur-md"
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 400 }}
            >
              {/* Triangle pointing down */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/80 border-b border-r border-white/60 rotate-45"
                style={{ backdropFilter: 'blur(12px)' }}
              />
              <span style={{ fontFamily: 'var(--font-sans)' }}>{tooltipText}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons container */}
      <div className="flex flex-col gap-5 items-center w-full max-w-xs relative">
        {/* YES button — big and inviting */}
        <motion.button
          id="btn-yes"
          className="btn-primary w-full text-xl"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleYes}
          aria-label={t('question.yes')}
        >
          <Heart size={20} fill="currentColor" strokeWidth={0} />
          {t('question.yes', { receiver: config.receiverName })}
        </motion.button>

        {/* NO button — dodges */}
        <div className="relative">
          <motion.button
            ref={noButtonRef}
            id="btn-no"
            className={`btn-secondary px-8 py-3 text-base ${dodgeCount >= 15 ? 'bg-slate-200 text-slate-500 grayscale opacity-80' : ''
              }`}
            style={{ x, y, rotate }}
            onHoverStart={dodgeNoButton}
            onClick={handleNoClick}
            whileTap={{ scale: 0.9 }}
            aria-label={t('question.no')}
          >
            <ThumbsDown size={16} strokeWidth={2.2} />
            {dodgeCount >= 15 ? t('question.maxDodgeButton') : t('question.no')}
          </motion.button>
        </div>
      </div>

      {/* Graceful Exit */}
      <motion.button
        className="absolute bottom-8 text-slate-400 text-xs font-medium hover:text-slate-600 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={() => {
          alert(t('question.gracefulExitAlert'))
        }}
      >
        {t('question.gracefulExitBtn')}
      </motion.button>
    </motion.div>
  )
}
