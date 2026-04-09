import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Heart, HeartCrack } from 'lucide-react'

interface Props {
  targetCount: number
  brokenCount: number
  timeLimit: number
  spawnInterval: number
  onComplete: (success: boolean) => void
}

interface FallingItem {
  id: number
  x: number
  speed: number
  y: number
  isBroken: boolean
}

export default function HeartShooterChallenge({ targetCount, brokenCount: _brokenCount, timeLimit, spawnInterval, onComplete }: Props) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const [items, setItems] = useState<FallingItem[]>([])
  const [caught, setCaught] = useState(0)
  const [missed, setMissed] = useState(0)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const nextId = useRef(0)
  const done = useRef(false)
  const animRef = useRef<number | null>(null)
  const caughtRef = useRef(0)
  const missedRef = useRef(0)
  const MAX_MISS = 3

  // Spawn items
  useEffect(() => {
    const interval = setInterval(() => {
      if (done.current) return
      const isBroken = Math.random() < 0.35
      const item: FallingItem = {
        id: nextId.current++,
        x: 5 + Math.random() * 85,
        speed: 0.6 + Math.random() * 0.8,
        y: -8,
        isBroken,
      }
      setItems((prev) => [...prev.filter((h) => h.y < 108), item])
    }, spawnInterval)
    return () => clearInterval(interval)
  }, [spawnInterval])

  // Animate falling + auto-remove past bottom
  useEffect(() => {
    const tick = () => {
      setItems((prev) => {
        const updated = prev.map((h) => ({ ...h, y: h.y + h.speed }))
        // Items that fell off bottom without being caught
        const fallen = updated.filter((h) => h.y >= 105 && !h.isBroken)
        if (fallen.length > 0 && !done.current) {
          missedRef.current += fallen.length
          setMissed(missedRef.current)
          if (missedRef.current >= MAX_MISS) {
            done.current = true
            setTimeout(() => onComplete(false), 400)
          }
        }
        return updated.filter((h) => h.y < 105)
      })
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [onComplete])

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer)
          if (!done.current) {
            done.current = true
            onComplete(caughtRef.current >= targetCount)
          }
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [onComplete, targetCount])

  const handleClick = useCallback((id: number, isBroken: boolean) => {
    if (done.current) return
    setItems((prev) => prev.filter((h) => h.id !== id))

    if (isBroken) {
      // Clicked broken heart = penalty
      missedRef.current += 1
      setMissed(missedRef.current)
      if (missedRef.current >= MAX_MISS) {
        done.current = true
        setTimeout(() => onComplete(false), 400)
      }
    } else {
      caughtRef.current += 1
      setCaught(caughtRef.current)
      if (caughtRef.current >= targetCount) {
        done.current = true
        setTimeout(() => onComplete(true), 300)
      }
    }
  }, [targetCount, onComplete])

  return (
    <div className="w-full max-w-md mx-auto">
      {/* HUD */}
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="flex items-center gap-1.5 text-rose-600 font-bold">
          <Heart size={16} fill="currentColor" strokeWidth={0} className="text-rose-500" />
          {caught}/{targetCount}
        </span>
        <span className="text-slate-500 text-sm font-medium">{timeLeft}s</span>
        <span className="flex items-center gap-1 text-red-500 font-semibold text-sm">
          <HeartCrack size={14} strokeWidth={2} />
          {MAX_MISS - missed > 0 ? `${MAX_MISS - missed}` : '0'} {isEn ? 'lives' : 'mạng'}
        </span>
      </div>

      {/* Instruction badge */}
      <div className="flex gap-3 justify-center mb-3 text-xs font-medium">
        <span className="flex items-center gap-1 text-rose-500 bg-rose-50 px-2 py-1 rounded-full border border-rose-100">
          <Heart size={11} fill="currentColor" strokeWidth={0} />
          {isEn ? 'Pink = catch' : 'Hồng = bắt'}
        </span>
        <span className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2 py-1 rounded-full border border-slate-200">
          <HeartCrack size={11} strokeWidth={2} />
          {isEn ? 'Dark = avoid' : 'Đen = tránh'}
        </span>
      </div>

      {/* Game area */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border-2 border-dashed border-rose-100"
        style={{
          height: 260,
          background: 'linear-gradient(180deg, #fff1f2 0%, #fce7f3 100%)',
        }}
      >
        <AnimatePresence>
          {items.map((item) => (
            <motion.button
              key={item.id}
              className="absolute cursor-pointer border-none bg-transparent p-0 select-none"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translateX(-50%)',
              }}
              whileTap={{ scale: 0.3, opacity: 0 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
              onClick={() => handleClick(item.id, item.isBroken)}
              aria-label={item.isBroken ? 'Broken heart - avoid' : 'Heart - catch'}
            >
              {item.isBroken ? (
                <HeartCrack
                  size={32}
                  className="text-slate-400 drop-shadow"
                  strokeWidth={1.5}
                />
              ) : (
                <Heart
                  size={32}
                  fill="currentColor"
                  strokeWidth={0}
                  className="text-rose-400 drop-shadow"
                  style={{ filter: 'drop-shadow(0 2px 6px rgba(225,29,72,0.4))' }}
                />
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
