import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SkipForward } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { createChallengeEngine } from './engine'
import type { ChallengeDefinition } from '../../types'

import PhaseSelect from './components/PhaseSelect'
import PhaseHub from './components/PhaseHub'
import PhaseResult from './components/PhaseResult'
import ChallengeDispatcher from './components/ChallengeDispatcher'

type ChallengePhase = 'select' | 'hub' | 'playing' | 'result'

export default function ChallengeScreen() {
  const { i18n } = useTranslation()
  const { setScreen, recordChallenge, config } = useAppStore()
  const isEn = i18n.language === 'en'

  const engine = useMemo(() => createChallengeEngine(), [])

  const [phase, setPhase] = useState<ChallengePhase>('select')
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeDefinition | null>(null)
  const [options] = useState<ChallengeDefinition[]>(() => engine.getOptions(3))
  const [lastSuccess, setLastSuccess] = useState(false)

  const handleComplete = useCallback(
    (success: boolean) => {
      setLastSuccess(success)
      setPhase('result')
      if (currentChallenge) recordChallenge(currentChallenge.id)
    },
    [currentChallenge, recordChallenge],
  )

  const handleContinue = useCallback(() => {
    setScreen('question')
  }, [setScreen])

  const handleSkip = useCallback(() => {
    if (currentChallenge) recordChallenge(currentChallenge.id)
    setScreen('question')
  }, [currentChallenge, recordChallenge, setScreen])

  const handleSelect = useCallback((opt: ChallengeDefinition) => {
    engine.commitOption(opt.id)
    setCurrentChallenge(opt)
    setPhase('playing')
  }, [engine])

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-dvh px-4 py-8"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
    >
      {/* Dynamic Header based on Phase */}
      {(phase === 'select' || phase === 'hub') && (
        <div className="text-center mb-8 w-full max-w-md">
          <motion.h2 
            className="text-3xl font-bold text-slate-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {phase === 'select' ? "Hình Phạt Của Bạn!" : "Arcade Hub"}
          </motion.h2>
          <p className="text-slate-500 mt-2 font-medium">
            {phase === 'select' ? "Bốc 1 thẻ bí ẩn để tiếp tục!" : "Chọn bất kì trò nào bạn muốn"}
          </p>
        </div>
      )}

      {(phase === 'playing' || phase === 'result') && currentChallenge && (
        <div className="w-full max-w-md mb-6">
          <div className="flex justify-between items-center">
            <motion.h2
              className="text-2xl font-bold text-slate-800"
              style={{ fontFamily: 'var(--font-display)' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {currentChallenge.id.replace(/-/g, ' ').toUpperCase()}
            </motion.h2>

            <motion.button
              className="px-4 py-2 text-sm font-semibold text-slate-500 bg-slate-100/50 hover:bg-slate-100 hover:text-slate-700 rounded-xl cursor-pointer border border-slate-200/50 flex items-center gap-1.5 transition-colors backdrop-blur-sm shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSkip}
            >
              Skip
              <SkipForward size={14} strokeWidth={2.5} />
            </motion.button>
          </div>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            {isEn ? currentChallenge.descriptionKey : currentChallenge.descriptionKey}
          </p>
        </div>
      )}

      {/* Primary Content Container */}
      <AnimatePresence mode="wait">
        {phase === 'select' && (
          <PhaseSelect options={options} onSelect={handleSelect} onGoToHub={() => setPhase('hub')} />
        )}

        {phase === 'hub' && (
          <PhaseHub options={engine.getAll()} onSelect={handleSelect} />
        )}

        {phase === 'playing' && currentChallenge && (
          <motion.div
            key="playing"
            className="w-full max-w-md bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.06)] rounded-3xl p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <ChallengeDispatcher
              challenge={currentChallenge}
              onComplete={handleComplete}
              senderName={config.senderName}
              receiverName={config.receiverName}
            />
          </motion.div>
        )}

        {phase === 'result' && (
          <PhaseResult success={lastSuccess} onContinue={handleContinue} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
