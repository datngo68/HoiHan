import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Heart, SkipForward } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import JourneyProgress from './JourneyProgress'
import JourneyStep from './JourneyStep'
import StepResult from './StepResult'
import { playSfx } from '../../hooks/useAudio'
import type { JourneyStepDef } from '../../types'

type StepResultState = Pick<JourneyStepDef, 'stepNumber' | 'unlockMessageKey'>

export default function HeartJourneyScreen() {
  const { t } = useTranslation()
  const { config, setScreen, recordJourneyStep, journeyState } = useAppStore()

  const journeySteps = journeyState.steps || []
  const totalSteps = journeySteps.length
  const currentStepIdx = journeyState.currentStep
  const completedSteps = journeyState.completedSteps

  const currentStep =
    currentStepIdx >= 0 && currentStepIdx < totalSteps
      ? journeySteps[currentStepIdx]
      : undefined

  const [resultState, setResultState] = useState<StepResultState | null>(null)

  const handleStepComplete = useCallback(
    () => {
      if (!currentStep || resultState) {
        return
      }

      playSfx('success')
      setResultState({
        stepNumber: currentStep.stepNumber,
        unlockMessageKey: currentStep.unlockMessageKey,
      })
      recordJourneyStep(currentStepIdx)
    },
    [currentStep, currentStepIdx, recordJourneyStep, resultState],
  )

  const handleResultContinue = useCallback(() => {
    setResultState(null)

    if (journeyState.currentStep >= totalSteps) {
      setScreen('celebration')
    }
  }, [journeyState.currentStep, setScreen, totalSteps])

  const handleSkip = useCallback(() => {
    setScreen('celebration')
  }, [setScreen])

  if (totalSteps === 0) {
    return null
  }

  const hasActiveStep = !!currentStep

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
          {t('heartJourney.subtitle', { total: totalSteps })}
        </motion.p>

        {/* Progress tracker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        >
          <JourneyProgress totalSteps={totalSteps} currentStep={currentStepIdx} completedSteps={completedSteps} />
        </motion.div>
      </div>

      {/* Step title */}
      {hasActiveStep && currentStep && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`title-${currentStepIdx}`}
            className="w-full max-w-sm mb-5 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
              {t('heartJourney.stepBadge', { step: currentStepIdx + 1, total: totalSteps })}
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {t(currentStep.titleKey)}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {t(currentStep.descriptionKey, { target: 10, seconds: 30 })}
            </p>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Challenge game area */}
      <div className="w-full max-w-sm flex-1 flex items-start">
        {hasActiveStep && currentStep && (
          <AnimatePresence mode="wait">
            <JourneyStep
              key={currentStep.id}
              stepDef={currentStep}
              senderName={config.senderName}
              receiverName={config.receiverName}
              onComplete={handleStepComplete}
            />
          </AnimatePresence>
        )}
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
      {resultState && (
        <StepResult
          stepNumber={resultState.stepNumber}
          unlockMessageKey={resultState.unlockMessageKey}
          onContinue={handleResultContinue}
        />
      )}
    </motion.div>
  )
}
