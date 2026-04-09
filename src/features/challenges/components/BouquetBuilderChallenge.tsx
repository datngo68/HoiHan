import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Heart, CheckCircle } from 'lucide-react'

interface Props {
  requiredFlowers: number
  timeLimitSeconds: number
  onComplete: (success: boolean) => void
}

// SVG flower data — each has a color and petal shape
const FLOWERS = [
  { id: 'rose', label: 'Hồng', labelEn: 'Rose', color: '#f43f5e', bg: '#fff1f2' },
  { id: 'daisy', label: 'Cúc', labelEn: 'Daisy', color: '#fbbf24', bg: '#fffbeb' },
  { id: 'lavender', label: 'Oải Hương', labelEn: 'Lavender', color: '#a78bfa', bg: '#f5f3ff' },
  { id: 'tulip', label: 'Tulip', labelEn: 'Tulip', color: '#fb923c', bg: '#fff7ed' },
  { id: 'sunflower', label: 'Hướng Dương', labelEn: 'Sunflower', color: '#facc15', bg: '#fefce8' },
  { id: 'lily', label: 'Loa Kèn', labelEn: 'Lily', color: '#38bdf8', bg: '#f0f9ff' },
]

function FlowerSVG({ color, size = 36 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* 5 petals */}
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <ellipse
          key={i}
          cx={20 + 10 * Math.cos((deg * Math.PI) / 180)}
          cy={20 + 10 * Math.sin((deg * Math.PI) / 180)}
          rx={6}
          ry={9}
          transform={`rotate(${deg}, ${20 + 10 * Math.cos((deg * Math.PI) / 180)}, ${20 + 10 * Math.sin((deg * Math.PI) / 180)})`}
          fill={color}
          opacity={0.85}
        />
      ))}
      {/* Center */}
      <circle cx={20} cy={20} r={6} fill="#fef9c3" />
      <circle cx={20} cy={20} r={3} fill="#fde68a" />
      {/* Stem */}
      <line x1={20} y1={26} x2={20} y2={40} stroke="#86efac" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  )
}

export default function BouquetBuilderChallenge({ requiredFlowers, onComplete }: Props) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const [bouquet, setBouquet] = useState<typeof FLOWERS>([])
  const [completed, setCompleted] = useState(false)
  const done = useRef(false)

  const addFlower = useCallback((flower: typeof FLOWERS[0]) => {
    if (done.current || bouquet.length >= 7) return
    setBouquet((prev) => [...prev, flower])
  }, [bouquet.length])

  const removeFlower = useCallback((idx: number) => {
    if (done.current) return
    setBouquet((prev) => prev.filter((_, i) => i !== idx))
  }, [])

  const handleDone = useCallback(() => {
    if (done.current || bouquet.length < requiredFlowers) return
    done.current = true
    setCompleted(true)
    setTimeout(() => onComplete(true), 1600)
  }, [bouquet.length, requiredFlowers, onComplete])

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Bouquet vase */}
      <div className="relative mb-4">
        <div
          className="w-full rounded-2xl border-2 border-rose-100 bg-gradient-to-b from-rose-50/60 to-rose-100/40 flex items-end justify-center gap-1 px-3 pt-4"
          style={{ minHeight: 110 }}
        >
          <AnimatePresence>
            {bouquet.length === 0 && (
              <motion.p
                className="text-slate-400 text-xs text-center pb-4 absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {isEn ? 'Pick flowers below to build bouquet' : 'Chọn hoa bên dưới để xếp bó hoa'}
              </motion.p>
            )}
            {bouquet.map((f, i) => (
              <motion.button
                key={`${f.id}-${i}`}
                className="cursor-pointer border-none bg-transparent p-0 flex-shrink-0"
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', bounce: 0.6 }}
                whileHover={{ y: -4 }}
                onClick={() => removeFlower(i)}
                aria-label="Remove flower"
              >
                <FlowerSVG color={f.color} size={38} />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Vase */}
        <div className="mx-auto mt-1 w-16 h-8 rounded-b-xl border-2 border-rose-200 bg-rose-50 flex items-center justify-center">
          <Heart size={14} className="text-rose-300" fill="currentColor" strokeWidth={0} />
        </div>
      </div>

      {/* Progress */}
      <div className="flex justify-between items-center mb-3 px-1 text-xs font-medium text-slate-500">
        <span>{isEn ? `${bouquet.length}/${requiredFlowers} flowers` : `${bouquet.length}/${requiredFlowers} hoa`}</span>
        <span>{isEn ? 'Tap flower to remove' : 'Nhấn hoa để xóa'}</span>
      </div>

      {/* Flower palette */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {FLOWERS.map((f) => (
          <motion.button
            key={f.id}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 cursor-pointer"
            style={{ background: f.bg, borderColor: `${f.color}40` }}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => addFlower(f)}
          >
            <FlowerSVG color={f.color} size={30} />
            <span className="text-xs font-semibold" style={{ color: f.color }}>
              {isEn ? f.labelEn : f.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Submit / Result */}
      <AnimatePresence mode="wait">
        {!completed ? (
          <motion.button
            key="submit"
            className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer border-none flex items-center justify-center gap-2"
            style={{
              background: bouquet.length >= requiredFlowers
                ? 'linear-gradient(135deg, #e11d48, #f43f5e)'
                : 'linear-gradient(135deg, #fda4af, #fecdd3)',
              color: bouquet.length >= requiredFlowers ? 'white' : '#be123c',
              boxShadow: bouquet.length >= requiredFlowers ? '0 6px 20px rgba(225,29,72,0.3)' : 'none',
            }}
            whileTap={bouquet.length >= requiredFlowers ? { scale: 0.96 } : undefined}
            onClick={handleDone}
          >
            <Heart size={16} fill="currentColor" strokeWidth={0} />
            {isEn
              ? bouquet.length >= requiredFlowers ? 'Gift the Bouquet!' : `Need ${requiredFlowers - bouquet.length} more`
              : bouquet.length >= requiredFlowers ? 'Tặng bó hoa!' : `Cần thêm ${requiredFlowers - bouquet.length} hoa`}
          </motion.button>
        ) : (
          <motion.div
            key="done"
            className="flex items-center justify-center gap-3 py-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            <CheckCircle size={36} className="text-green-500" />
            <span className="font-bold text-slate-700 text-lg">
              {isEn ? 'Beautiful bouquet!' : 'Bó hoa tuyệt đẹp!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
