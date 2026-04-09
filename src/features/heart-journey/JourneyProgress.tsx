import { motion } from 'framer-motion'
import { Heart, Check } from 'lucide-react'

interface Props {
  totalSteps: number
  currentStep: number
  completedSteps: number[]
}

export default function JourneyProgress({ totalSteps, currentStep, completedSteps }: Props) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-xs mx-auto">
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const isCompleted = completedSteps.includes(idx)
        const isCurrent = !isCompleted && idx === currentStep

        return (
          <div key={idx} className="flex items-center">
            {/* Step Circle */}
            <motion.div
              className="relative w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
              animate={
                isCompleted
                  ? { scale: [1.2, 1], backgroundColor: '#e11d48' }
                  : isCurrent
                    ? { scale: [1, 1.08, 1] }
                    : {}
              }
              transition={
                isCurrent
                  ? { duration: 1.5, repeat: Infinity }
                  : { type: 'spring', stiffness: 300, damping: 20 }
              }
              style={{
                background: isCompleted
                  ? 'linear-gradient(135deg, #e11d48, #f43f5e)'
                  : isCurrent
                    ? 'white'
                    : 'rgba(241, 245, 249, 0.9)',
                boxShadow: isCompleted
                  ? '0 4px 15px rgba(225, 29, 72, 0.4)'
                  : isCurrent
                    ? '0 0 0 3px #fda4af, 0 4px 12px rgba(225, 29, 72, 0.15)'
                    : 'none',
                border: isCurrent ? '2px solid #f43f5e' : 'none',
              }}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Check size={18} className="text-white" strokeWidth={3} />
                </motion.div>
              ) : (
                <Heart
                  size={18}
                  className={isCurrent ? 'text-rose-500' : 'text-slate-300'}
                  fill={isCurrent ? 'currentColor' : 'none'}
                  strokeWidth={2}
                />
              )}

              {/* Pulse ring for current */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-rose-300"
                  animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Connector line */}
            {idx < totalSteps - 1 && (
              <div className="relative h-0.5 w-12 mx-1 overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #e11d48, #f43f5e)' }}
                  initial={{ width: '0%' }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
