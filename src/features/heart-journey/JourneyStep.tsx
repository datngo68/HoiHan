import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { JourneyStepDef } from './data/journeyData'
import { buildJourneyConfig } from './data/journeyData'
import TapCounterChallenge from '../challenges/components/TapCounterChallenge'
import QuizChallenge from '../challenges/components/QuizChallenge'
import TypeLoveChallenge from '../challenges/components/TypeLoveChallenge'
import type { QuizConfig } from '../challenges/data/quizData'

interface Props {
  stepDef: JourneyStepDef
  senderName: string
  receiverName: string
  onComplete: (success: boolean) => void
}

export default function JourneyStep({ stepDef, senderName, receiverName, onComplete }: Props) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const config = useMemo(
    () => buildJourneyConfig(stepDef.id, senderName, receiverName),
    [stepDef.id, senderName, receiverName],
  )

  const renderChallenge = () => {
    switch (stepDef.id) {
      case 'journey-tap-hearts': {
        const c = config as { targetTaps: number; timeLimitSeconds: number }
        return (
          <TapCounterChallenge
            targetTaps={c.targetTaps}
            timeLimit={c.timeLimitSeconds}
            onComplete={onComplete}
          />
        )
      }

      case 'journey-quiz-love': {
        return (
          <QuizChallenge
            config={config as unknown as QuizConfig}
            timeLimit={(config as { timeLimitSeconds: number }).timeLimitSeconds}
            onComplete={onComplete}
          />
        )
      }

      case 'journey-type-love': {
        const c = config as { phrase: string; phraseEn: string; timeLimitSeconds: number }
        return (
          <TypeLoveChallenge
            phrase={c.phrase}
            phraseEn={c.phraseEn}
            timeLimit={c.timeLimitSeconds}
            onComplete={onComplete}
          />
        )
      }

      default:
        return null
    }
  }

  void isEn // used by children via context

  return (
    <motion.div
      key={stepDef.id}
      className="w-full"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
    >
      <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.06)] rounded-3xl p-6">
        {renderChallenge()}
      </div>
    </motion.div>
  )
}
