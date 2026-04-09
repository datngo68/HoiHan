import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Heart, SkipForward } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { journeySteps } from './data/journeyData'
import JourneyProgress from './JourneyProgress'
import JourneyStep from './JourneyStep'
import StepResult from './StepResult'
import { playSfx } from '../../hooks/useAudio'

const TOTAL_STEPS = journeySteps.length

export default function HeartJourneyScreen() {
  const { t } = useTranslation()
  const { config, setScreen, recordJourneyStep } = useAppStore()

  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const currentStep = journeySteps[currentStepIdx]

  const handleStepComplete = useCallback(
    (_success: boolean) => {
      // Treat fail as success in reward context — love journey is forgiving
      playSfx('success')
      recordJourneyStep(currentStepIdx)
      setCompletedSteps((prev) => [...prev, currentStepIdx])
      setShowResult(true)
    },
    [currentStepIdx, recordJourneyStep],
  )

  const handleResultContinue = useCallback(() => {
    setShowResult(false)
    const nextIdx = currentStepIdx + 1
    if (nextIdx >= TOTAL_STEPS) {
      setScreen('celebration')
    } else {
      setCurrentStepIdx(nextIdx)
    }
  }, [currentStepIdx, setScreen])

  const handleSkip = useCallback(() => {
    setScreen('celebration')
  }, [setScreen])

  return (
    <motion.div
      className="flex flex-col items-center justify-start min-h-dvh px-4 pt-12 pb-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
    >
      {/* Animated background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #fff1f2 0%, #fce7f3 50%, #fef3c7 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 10s ease infinite',
        }}
      />

      {/* Floating hearts background */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20"
            style={{ left: `${(i * 12.5) % 100}%`, top: `${(i * 17) % 100}%` }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
          >
            <Heart size={12 + (i % 3) * 6} className="text-rose-300" fill="currentColor" strokeWidth={0} />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="w-full max-w-sm mb-8 text-center">
        <motion.div
          className="inline-flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest mb-3 bg-rose-50/80 px-4 py-1.5 rounded-full border border-rose-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Heart size={12} fill="currentColor" strokeWidth={0} />
          {t('heartJourney.title')}
        </motion.div>

        <motion.p
          className="text-sm text-slate-500 font-medium mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {t('heartJourney.subtitle', { total: TOTAL_STEPS })}
        </motion.p>

        {/* Progress tracker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        >
          <JourneyProgress totalSteps={TOTAL_STEPS} currentStep={currentStepIdx} completedSteps={completedSteps} />
        </motion.div>
      </div>

      {/* Step title */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`title-${currentStepIdx}`}
          className="w-full max-w-sm mb-5 text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
            {t('heartJourney.stepBadge', { step: currentStepIdx + 1, total: TOTAL_STEPS })}
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            {t(currentStep.titleKey)}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t(currentStep.descriptionKey, { target: 10, seconds: 30 })}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Challenge game area */}
      <div className="w-full max-w-sm flex-1 flex items-start">
        <AnimatePresence mode="wait">
          <JourneyStep
            key={currentStep.id}
            stepDef={currentStep}
            senderName={config.senderName}
            receiverName={config.receiverName}
            onComplete={handleStepComplete}
          />
        </AnimatePresence>
      </div>

      {/* Skip button */}
      <motion.button
        className="mt-6 flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-xs font-medium transition-colors cursor-pointer"
        onClick={handleSkip}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        <SkipForward size={13} strokeWidth={2.5} />
        {t('heartJourney.skip')}
      </motion.button>

      {/* Step Result overlay */}
      {showResult && currentStep && (
        <StepResult
          stepNumber={currentStep.stepNumber}
          unlockMessageKey={currentStep.unlockMessageKey}
          onContinue={handleResultContinue}
        />
      )}
    </motion.div>
  )
}
