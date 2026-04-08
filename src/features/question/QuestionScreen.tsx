import { useState, useCallback, useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Heart, ThumbsDown } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { playSfx } from '../../hooks/useAudio'

export default function QuestionScreen() {
  const { t } = useTranslation()
  const { session, config, setScreen, recordRefusal } = useAppStore()
  const [tooltipText, setTooltipText] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
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
    // Secret Dev Trick: Giữ Shift để vô hiệu hóa né tránh
    // Hoặc "fatigue mechanic": Né 5 lần thì đứng yên 1 lần cho người ta bắt
    if (e?.shiftKey || dodgeCount >= 5) {
      if (dodgeCount >= 5) setDodgeCount(0)
      return
    }

    setDodgeCount((prev) => prev + 1)

    const maxX = window.innerWidth * 0.3
    const maxY = window.innerHeight * 0.25
    const newX = (Math.random() - 0.5) * 2 * maxX
    const newY = (Math.random() - 0.5) * 2 * maxY
    x.set(newX)
    y.set(newY)

    const tip = tooltips[Math.floor(Math.random() * tooltips.length)]
    setTooltipText(tip)
    setShowTooltip(true)
    setTimeout(() => setShowTooltip(false), 1200)
  }, [x, y, tooltips, dodgeCount])

  const handleNo = useCallback(() => {
    playSfx('click')
    recordRefusal()
    setScreen('challenge')
  }, [recordRefusal, setScreen])

  const handleYes = useCallback(() => {
    playSfx('pop')
    setScreen('celebration')
  }, [setScreen])

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
            className="btn-secondary px-8 py-3 text-base"
            style={{ x, y, rotate }}
            onHoverStart={dodgeNoButton}
            onTouchStart={dodgeNoButton}
            onClick={handleNo}
            whileTap={{ scale: 0.9 }}
            aria-label={t('question.no')}
          >
            <ThumbsDown size={16} strokeWidth={2.2} />
            {t('question.no')}
          </motion.button>

          {/* Tooltip */}
          {showTooltip && (
            <motion.div
              className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-white text-sm px-3 py-1 rounded-lg pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #e11d48, #f43f5e)' }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {tooltipText}
            </motion.div>
          )}
        </div>
      </div>

      {/* Refusal counter */}
      {session.refusalCount > 0 && (
        <motion.p
          className="mt-8 text-xs text-rose-300 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Đã từ chối: {session.refusalCount} lần
        </motion.p>
      )}
    </motion.div>
  )
}
