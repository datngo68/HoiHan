import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Share2, RotateCcw, Heart, PartyPopper, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useAppStore } from '../../store/useAppStore'
import { encodeConfigToURL } from '../../utils/urlConfig'
import { playSfx } from '../../hooks/useAudio'

export default function CelebrationScreen() {
  const { t } = useTranslation()
  const { config, journeyState, resetSession } = useAppStore()
  const isReward = journeyState.isReward

  const fireConfetti = useCallback(() => {
    const duration = isReward ? 6000 : 4000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: isReward ? 5 : 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: isReward
          ? ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#facc15', '#fef08a']
          : ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3'],
      })
      confetti({
        particleCount: isReward ? 5 : 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: isReward
          ? ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#facc15', '#fef08a']
          : ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3'],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    confetti({
      particleCount: isReward ? 180 : 100,
      spread: isReward ? 130 : 100,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#e11d48', '#f43f5e', '#fb7185', '#fecdd3', '#facc15', '#fef08a'],
    })

    requestAnimationFrame(frame)
  }, [isReward])

  useEffect(() => {
    fireConfetti()
    playSfx('success')
  }, [fireConfetti])

  const handleShare = useCallback(async () => {
    const shareUrl = encodeConfigToURL(config)
    const shareData = {
      title: 'Em Có Yêu Anh Không?',
      text: `${config.receiverName} đã nói CÓ!`,
      url: shareUrl,
    }
    if (navigator.share) {
      await navigator.share(shareData).catch(() => {})
    } else {
      await navigator.clipboard.writeText(shareUrl)
    }
  }, [config])

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-dvh px-6 text-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #fff1f2, #fecdd3, #fef9c3, #fff1f2)',
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 8s ease infinite',
        }}
      />

      {/* Falling hearts background — SVG hearts */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute select-none"
            style={{ left: `${(i * 5.5) % 100}%` }}
            initial={{ y: -50, opacity: 0 }}
            animate={{
              y: ['0vh', '110vh'],
              opacity: [0, 0.7, 0.7, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 4 + (i % 4),
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'linear',
            }}
          >
            <Heart
              size={14 + (i % 4) * 4}
              className="text-rose-400"
              fill="currentColor"
              strokeWidth={0}
              style={{ opacity: 0.5 + (i % 3) * 0.15 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Main celebration content */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
      >
        {/* Celebration icon */}
        <motion.div
          className="mb-6 relative"
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #fecdd3, #fda4af)',
              boxShadow: '0 8px 32px rgba(225, 29, 72, 0.2)',
            }}
          >
            <PartyPopper size={36} className="text-rose-600" strokeWidth={2} />
          </div>
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles size={20} className="text-amber-400" fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* Reward badge */}
        {isReward && (
          <motion.div
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full mb-5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <Sparkles size={12} className="text-amber-500" />
            {t('heartJourney.rewardBadge')}
          </motion.div>
        )}

        {/* Title — gradient text */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            background: isReward
              ? 'linear-gradient(135deg, #b45309, #d97706, #e11d48)'
              : 'linear-gradient(135deg, #be123c, #e11d48, #f43f5e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {isReward ? t('heartJourney.rewardTitle') : t('celebration.title')}
        </motion.h1>

        {/* Message */}
        <motion.p
          className="text-2xl md:text-3xl font-semibold text-rose-700 mb-3 flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {isReward
            ? t('heartJourney.rewardSubtitle', { receiver: config.receiverName, sender: config.senderName })
            : t('celebration.message', { receiver: config.receiverName, sender: config.senderName })}
          <Heart size={24} className="text-rose-500 inline-block flex-shrink-0" fill="currentColor" strokeWidth={0} />
        </motion.p>

        <motion.p
          className="text-lg text-rose-400 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {t('celebration.subtitle', { receiver: config.receiverName })}
        </motion.p>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <motion.button
            id="btn-share"
            className="btn-primary flex-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
          >
            <Share2 size={18} strokeWidth={2.5} />
            {t('celebration.share')}
          </motion.button>

          <motion.button
            id="btn-play-again"
            className="btn-secondary flex-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetSession}
          >
            <RotateCcw size={18} strokeWidth={2.5} />
            {t('celebration.playAgain')}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
