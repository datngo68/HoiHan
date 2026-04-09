import type { ChallengeDefinition } from '../../../types'
import QuizChallenge from './QuizChallenge'
import ClickHeartsChallenge from './ClickHeartsChallenge'
import TapCounterChallenge from './TapCounterChallenge'
import MemoryCardsChallenge from './MemoryCardsChallenge'
import CatchHeartsChallenge from './CatchHeartsChallenge'
import TypeLoveChallenge from './TypeLoveChallenge'
import RhythmTapChallenge from './RhythmTapChallenge'
import DrawHeartChallenge from './DrawHeartChallenge'
import HeartShooterChallenge from './HeartShooterChallenge'
import MadLibsChallenge from './MadLibsChallenge'
import TruthDareChallenge from './TruthDareChallenge'
import BouquetBuilderChallenge from './BouquetBuilderChallenge'
import MemoryLaneChallenge from './MemoryLaneChallenge'
import type { QuizConfig } from '../data/quizData'
import type {
  ClickChallengeConfig,
  TapCounterConfig,
  MemoryCardConfig,
  CatchConfig,
  TypeLoveConfig,
} from '../data/interactiveData'
import type { HeartShooterConfig, MadLibsConfig, TruthDareConfig, BouquetConfig, MemoryLaneConfig } from '../data/tier1Tier2Data'

interface ChallengeDispatcherProps {
  challenge: ChallengeDefinition
  onComplete: (success: boolean) => void
  senderName?: string
  receiverName?: string
}

export default function ChallengeDispatcher({ challenge, onComplete, senderName = 'Anh', receiverName = 'Em' }: ChallengeDispatcherProps) {
  const cfg = challenge.config as Record<string, unknown>

  switch (challenge.category) {
    case 'quiz':
      return (
        <QuizChallenge
          config={cfg as unknown as QuizConfig}
          timeLimit={challenge.timeLimitSeconds || 15}
          onComplete={onComplete}
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
            onComplete={onComplete}
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
            onComplete={onComplete}
          />
        )
      }
      if (interConfig.type === 'heart-shooter') {
        const hs = cfg as unknown as HeartShooterConfig
        return (
          <HeartShooterChallenge
            targetCount={hs.targetCount}
            brokenCount={hs.brokenCount}
            timeLimit={hs.timeLimitSeconds}
            spawnInterval={hs.spawnInterval}
            onComplete={onComplete}
          />
        )
      }
      const ch = cfg as unknown as ClickChallengeConfig
      return (
        <ClickHeartsChallenge
          targetCount={ch.targetCount}
          timeLimit={ch.timeLimitSeconds}
          onComplete={onComplete}
        />
      )
    }

    case 'minigame': {
      const interConfig = cfg as { type: string }
      if (interConfig.type === 'mad-libs') {
        const ml = cfg as unknown as MadLibsConfig
        return (
          <MadLibsChallenge
            templates={ml.templates}
            options={ml.options}
            senderName={senderName}
            receiverName={receiverName}
            onComplete={onComplete}
          />
        )
      }
      if (interConfig.type === 'bouquet-builder') {
        const bb = cfg as unknown as BouquetConfig
        return (
          <BouquetBuilderChallenge
            requiredFlowers={bb.requiredFlowers}
            timeLimitSeconds={bb.timeLimitSeconds}
            onComplete={onComplete}
          />
        )
      }
      if (interConfig.type === 'memory-lane') {
        const mln = cfg as unknown as MemoryLaneConfig
        return (
          <MemoryLaneChallenge
            scenes={mln.scenes}
            senderName={senderName}
            receiverName={receiverName}
            onComplete={onComplete}
          />
        )
      }
      const mc = cfg as unknown as MemoryCardConfig
      return (
        <MemoryCardsChallenge
          pairs={mc.pairs}
          emojis={mc.emojis}
          onComplete={onComplete}
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
          onComplete={onComplete}
        />
      )
    }

    case 'truthdare': {
      const td = cfg as unknown as TruthDareConfig
      return (
        <TruthDareChallenge
          truths={td.truths}
          dares={td.dares}
          senderName={senderName}
          receiverName={receiverName}
          onComplete={onComplete}
        />
      )
    }

    case 'rhythm': {
      const rc = cfg as { pattern: boolean[]; bpm: number }
      return (
        <RhythmTapChallenge
          pattern={rc.pattern}
          bpm={rc.bpm}
          onComplete={onComplete}
        />
      )
    }

    case 'draw': {
      const dc = cfg as { timeLimitSeconds: number; passingScore: number }
      return (
        <DrawHeartChallenge
          timeLimitSeconds={dc.timeLimitSeconds}
          passingScore={dc.passingScore}
          onComplete={onComplete}
        />
      )
    }

    default:
      return <div className="text-center text-slate-500">Challenge not found.</div>
  }
}
