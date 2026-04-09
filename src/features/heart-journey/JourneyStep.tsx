import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { challengeRegistry } from '../challenges/registry'
import ChallengeDispatcher from '../challenges/components/ChallengeDispatcher'
import type { JourneyStepDef } from '../../types'

interface Props {
  stepDef: JourneyStepDef
  senderName: string
  receiverName: string
  onComplete: (success: boolean) => void
}

export default function JourneyStep({ stepDef, senderName, receiverName, onComplete }: Props) {
  const challenge = useMemo(() => challengeRegistry.get(stepDef.id), [stepDef.id])

  if (!challenge) {
    return <div className="text-center p-4 text-slate-500">Challenge {stepDef.id} not found in registry.</div>
  }

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
        <ChallengeDispatcher
          challenge={challenge}
          senderName={senderName}
          receiverName={receiverName}
          onComplete={onComplete}
        />
      </div>
    </motion.div>
  )
}
