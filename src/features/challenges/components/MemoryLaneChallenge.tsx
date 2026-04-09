import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Sunset, Coffee, CloudRain, Star, Music, Mail, Heart, Sparkles } from 'lucide-react'

interface Scene {
  icon: string
  captionVi: string
  captionEn: string
}

interface Props {
  scenes: Scene[]
  senderName: string
  receiverName: string
  onComplete: (success: boolean) => void
}

const ICON_MAP: Record<string, typeof Heart> = {
  sunset: Sunset,
  coffee: Coffee,
  rain: CloudRain,
  stars: Star,
  dance: Music,
  letters: Mail,
}

const BG_MAP: Record<string, string> = {
  sunset: 'linear-gradient(135deg, #fef9c3, #fde68a, #fb923c)',
  coffee: 'linear-gradient(135deg, #fef3c7, #d97706)',
  rain: 'linear-gradient(135deg, #e0f2fe, #7dd3fc, #38bdf8)',
  stars: 'linear-gradient(135deg, #1e1b4b, #4338ca, #6d28d9)',
  dance: 'linear-gradient(135deg, #fce7f3, #fbcfe8, #f9a8d4)',
  letters: 'linear-gradient(135deg, #fff7ed, #fed7aa, #fb923c)',
}

const TEXT_MAP: Record<string, string> = {
  sunset: 'text-amber-800',
  coffee: 'text-amber-700',
  rain: 'text-sky-700',
  stars: 'text-white',
  dance: 'text-pink-700',
  letters: 'text-orange-700',
}

export default function MemoryLaneChallenge({ scenes, senderName, receiverName, onComplete }: Props) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const [chosen, setChosen] = useState<Scene | null>(null)
  const [revealed, setRevealed] = useState(false)

  const handlePick = useCallback((scene: Scene) => {
    if (chosen) return
    setChosen(scene)
    setTimeout(() => {
      setRevealed(true)
      setTimeout(() => onComplete(true), 2000)
    }, 800)
  }, [chosen, onComplete])

  const renderCaption = (scene: Scene) => {
    const caption = isEn ? scene.captionEn : scene.captionVi
    return caption
  }

  return (
    <div className="w-full max-w-sm mx-auto text-center">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-slate-600 font-semibold text-sm mb-4">
              {isEn
                ? `Which moment best represents ${receiverName} and ${senderName}'s love?`
                : `Khoảnh khắc nào nói lên tình yêu của ${receiverName} và ${senderName}?`}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {scenes.map((scene, i) => {
                const Icon = ICON_MAP[scene.icon] || Heart
                const bg = BG_MAP[scene.icon] || 'linear-gradient(135deg, #fecdd3, #fda4af)'
                const isChosen = chosen?.icon === scene.icon

                return (
                  <motion.button
                    key={scene.icon}
                    className="relative rounded-2xl overflow-hidden cursor-pointer border-none p-0 aspect-square"
                    style={{
                      background: bg,
                      opacity: chosen && !isChosen ? 0.45 : 1,
                    }}
                    whileHover={!chosen ? { scale: 1.04, y: -2 } : undefined}
                    whileTap={!chosen ? { scale: 0.96 } : undefined}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => handlePick(scene)}
                    disabled={!!chosen}
                  >
                    <div className="flex flex-col items-center justify-center h-full gap-2 px-3 py-4">
                      <Icon
                        size={28}
                        className={`${TEXT_MAP[scene.icon] || 'text-rose-600'} drop-shadow`}
                        strokeWidth={1.5}
                      />
                      <span className={`text-xs font-bold leading-tight ${TEXT_MAP[scene.icon] || 'text-rose-700'}`}>
                        {renderCaption(scene)}
                      </span>
                    </div>

                    {isChosen && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.3)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Heart size={32} className="text-white drop-shadow-lg" fill="currentColor" strokeWidth={0} />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="flex flex-col items-center gap-4 py-6"
          >
            {chosen && (
              <motion.div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: BG_MAP[chosen.icon] }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {(() => {
                  const Icon = ICON_MAP[chosen.icon] || Heart
                  return <Icon size={40} className={TEXT_MAP[chosen.icon] || 'text-rose-600'} strokeWidth={1.5} />
                })()}
              </motion.div>
            )}

            <div className="flex items-center gap-2 text-rose-600">
              <Sparkles size={18} className="text-amber-400" />
              <p className="font-bold text-lg text-slate-800">
                {isEn ? 'A perfect memory!' : 'Một kỷ niệm tuyệt vời!'}
              </p>
              <Sparkles size={18} className="text-amber-400" />
            </div>

            {chosen && (
              <p className="text-slate-500 text-sm font-medium">
                {isEn
                  ? `"${chosen.captionEn}" — always in our hearts`
                  : `"${chosen.captionVi}" — mãi trong tim`}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
