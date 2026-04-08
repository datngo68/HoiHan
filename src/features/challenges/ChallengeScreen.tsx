import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SkipForward, ArrowLeft, PartyPopper, RefreshCcw } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { createChallengeEngine } from './engine'
import type { ChallengeDefinition } from '../../types'
import type { QuizConfig } from './data/quizData'
import type {
  ClickChallengeConfig,
  TapCounterConfig,
  MemoryCardConfig,
  CatchConfig,
  TypeLoveConfig,
} from './data/interactiveData'

import QuizChallenge from './components/QuizChallenge'
import ClickHeartsChallenge from './components/ClickHeartsChallenge'
import TapCounterChallenge from './components/TapCounterChallenge'
import MemoryCardsChallenge from './components/MemoryCardsChallenge'
import CatchHeartsChallenge from './components/CatchHeartsChallenge'
import TypeLoveChallenge from './components/TypeLoveChallenge'

type ChallengePhase = 'playing' | 'result'

export default function ChallengeScreen() {
  const { t, i18n } = useTranslation()
  const { session, setScreen, recordChallenge } = useAppStore()
  const isEn = i18n.language === 'en'

  const engine = useMemo(() => createChallengeEngine(), [])

  const [currentChallenge] = useState<ChallengeDefinition>(
    () => engine.getNext(session.completedChallengeIds),
  )
  const [phase, setPhase] = useState<ChallengePhase>('playing')
  const [lastSuccess, setLastSuccess] = useState(false)

  const handleComplete = useCallback(
    (success: boolean) => {
      setLastSuccess(success)
      setPhase('result')
      recordChallenge(currentChallenge.id)
    },
    [currentChallenge.id, recordChallenge],
  )

  const handleContinue = useCallback(() => {
    setScreen('question')
  }, [setScreen])

  const handleSkip = useCallback(() => {
    recordChallenge(currentChallenge.id)
    setScreen('question')
  }, [currentChallenge.id, recordChallenge, setScreen])

  const renderChallenge = useCallback(() => {
    const cfg = currentChallenge.config as Record<string, unknown>

    switch (currentChallenge.category) {
      case 'quiz':
        return (
          <QuizChallenge
            config={cfg as unknown as QuizConfig}
            timeLimit={currentChallenge.timeLimitSeconds || 15}
            onComplete={handleComplete}
          />
        )

      case 'click': {
        const interConfig = cfg as { type: string }
        if (interConfig.type === 'tap-counter') {
          const tc = cfg as unknown as TapCounterConfig
          return (
            <TapCounterChallenge
              targetTaps={tc.targetTaps}
              timeLimit={tc.timeLimitSeconds}
              onComplete={handleComplete}
            />
          )
        }
        if (interConfig.type === 'catch-hearts') {
          const cc = cfg as unknown as CatchConfig
          return (
            <CatchHeartsChallenge
              targetCount={cc.targetCount}
              timeLimit={cc.timeLimitSeconds}
              spawnInterval={cc.spawnInterval}
              onComplete={handleComplete}
            />
          )
        }
        // Default: click-hearts
        const ch = cfg as unknown as ClickChallengeConfig
        return (
          <ClickHeartsChallenge
            targetCount={ch.targetCount}
            timeLimit={ch.timeLimitSeconds}
            onComplete={handleComplete}
          />
        )
      }

      case 'minigame': {
        const mc = cfg as unknown as MemoryCardConfig
        return (
          <MemoryCardsChallenge
            pairs={mc.pairs}
            emojis={mc.emojis}
            onComplete={handleComplete}
          />
        )
      }

      case 'text': {
        const tl = cfg as unknown as TypeLoveConfig
        return (
          <TypeLoveChallenge
            phrase={tl.phrase}
            phraseEn={tl.phraseEn}
            timeLimit={tl.timeLimitSeconds}
            onComplete={handleComplete}
          />
        )
      }

      default:
        return (
          <div className="text-center text-rose-500">
            Challenge type not found 🤷
          </div>
        )
    }
  }, [currentChallenge, handleComplete])

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-dvh px-4 py-8"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
    >
      {/* Challenge header */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between items-center">
          <motion.h2
            className="text-2xl font-bold text-rose-800"
            style={{ fontFamily: 'var(--font-display)' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t('challenge.title', { num: session.currentChallengeIndex + 1 })}
          </motion.h2>

          <motion.button
            className="px-4 py-1.5 text-sm font-medium text-rose-400 bg-rose-50 rounded-lg cursor-pointer border border-rose-200 flex items-center gap-1.5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSkip}
          >
            {t('challenge.skip')}
            <SkipForward size={14} strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Challenge info */}
        <p className="text-rose-600 mt-1 text-sm">
          {isEn ? currentChallenge.descriptionKey : currentChallenge.descriptionKey}
        </p>
      </div>

      {/* Challenge content */}
      <AnimatePresence mode="wait">
        {phase === 'playing' && (
          <motion.div
            key="playing"
            className="w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {renderChallenge()}
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div
            key="result"
            className="w-full max-w-md text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="text-7xl mb-4 flex justify-center text-rose-500"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              {lastSuccess ? <PartyPopper size={72} strokeWidth={1.5} /> : <RefreshCcw size={72} strokeWidth={1.5} />}
            </motion.div>

            <h3 className="text-2xl font-bold text-rose-800 mb-2">
              {lastSuccess ? t('challenge.successTitle', 'Khá lắm!') : t('challenge.failTitle', 'Chưa được rồi!')}
            </h3>

            <p className="text-rose-600 mb-8">
              {lastSuccess
                ? t('challenge.successMessage', 'Bạn đã mở khóa cơ hội trả lời lại câu hỏi!')
                : t('challenge.failMessage', 'Không sao, hãy quay lại và thử lại nhé!')}
            </p>

            <motion.button
              className="px-8 py-4 text-lg font-bold text-white rounded-2xl cursor-pointer border-none flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
                boxShadow: '0 4px 20px rgba(225, 29, 72, 0.3)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
              {t('challenge.tryAgain')}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
