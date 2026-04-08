import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Heart, Mail } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

const HEART_POSITIONS = [
  { left: '8%', top: '12%', size: 'text-lg', delay: 0 },
  { left: '85%', top: '8%', size: 'text-base', delay: 0.5 },
  { left: '15%', top: '35%', size: 'text-xl', delay: 1.2 },
  { left: '78%', top: '28%', size: 'text-base', delay: 0.8 },
  { left: '5%', top: '60%', size: 'text-sm', delay: 1.8 },
  { left: '92%', top: '55%', size: 'text-lg', delay: 0.3 },
  { left: '25%', top: '80%', size: 'text-base', delay: 1.5 },
  { left: '70%', top: '78%', size: 'text-sm', delay: 2.0 },
  { left: '50%', top: '90%', size: 'text-base', delay: 0.7 },
  { left: '40%', top: '15%', size: 'text-sm', delay: 1.0 },
]

export default function SplashScreen() {
  const { t } = useTranslation()
  const { config, setScreen } = useAppStore()

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-dvh px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Floating SVG hearts background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {HEART_POSITIONS.map((pos, i) => (
          <motion.div
            key={i}
            className={`absolute ${pos.size} select-none`}
            style={{ left: pos.left, top: pos.top }}
            animate={{
              y: [0, -18, 0],
              rotate: [0, 8, -8, 0],
              opacity: [0.12, 0.3, 0.12],
            }}
            transition={{
              duration: 3.5 + (i % 3),
              repeat: Infinity,
              delay: pos.delay,
              ease: 'easeInOut',
            }}
          >
            <Heart
              size={16 + (i % 3) * 6}
              className="text-rose-300"
              fill="currentColor"
              strokeWidth={0}
            />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
      >
        {/* Heart icon — using SVG Heart stacked */}
        <motion.div
          className="relative mb-8"
          animate={{ scale: [1, 1.12, 1, 1.08, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart size={56} className="text-rose-500" fill="currentColor" strokeWidth={0} />
          <Heart
            size={36}
            className="absolute -top-2 -right-3 text-rose-400"
            fill="currentColor"
            strokeWidth={0}
            style={{ opacity: 0.8 }}
          />
        </motion.div>

        {/* App title */}
        <h1
          className="text-4xl md:text-5xl font-bold mb-5 leading-tight"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, #be123c, #e11d48, #f43f5e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Em Có Yêu Anh Không?
        </h1>

        {/* Greeting */}
        <motion.p
          className="text-xl md:text-2xl font-semibold text-rose-700 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {t('splash.greeting', { receiver: config.receiverName })}
        </motion.p>

        <motion.p
          className="text-base text-rose-400 mb-12 max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {t('splash.subtitle')}
        </motion.p>

        {/* Start button — premium glass */}
        <motion.button
          id="btn-start"
          className="btn-primary"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setScreen('question')}
          aria-label={t('splash.start')}
        >
          <Mail size={20} strokeWidth={2.2} />
          {t('splash.start')}
        </motion.button>

        {/* From sender */}
        <motion.p
          className="mt-10 text-sm text-rose-300 font-medium tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ letterSpacing: '0.05em' }}
        >
          {t('splash.from', { sender: config.senderName })}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
