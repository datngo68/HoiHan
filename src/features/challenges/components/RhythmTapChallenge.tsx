import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Music, Zap, CheckCircle } from 'lucide-react'

interface Props {
  pattern: boolean[]
  bpm: number
  onComplete: (success: boolean) => void
}

const HIT_WINDOW_MS = 160 // ±160ms tolerance

export default function RhythmTapChallenge({ pattern, bpm, onComplete }: Props) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const beatDurationMs = (60 / bpm) * 1000

  const [started, setStarted] = useState(false)
  const [currentBeatIdx, setCurrentBeatIdx] = useState(-1)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [passed, setPassed] = useState(false)
  const [pulsing, setPulsing] = useState(false)

  const beatStartRef = useRef<number>(0)
  const done = useRef(false)
  const patternLen = pattern.length
  const requiredHits = pattern.filter(Boolean).length

  // Advance beats
  useEffect(() => {
    if (!started || done.current) return
    let idx = 0
    const interval = setInterval(() => {
      if (idx >= patternLen) {
        clearInterval(interval)
        done.current = true
        const accuracy = requiredHits > 0 ? (hits / requiredHits) * 100 : 0
        const success = accuracy >= 75
        setPassed(success)
        setShowResult(true)
        setTimeout(() => onComplete(success), 1800)
        return
      }
      beatStartRef.current = Date.now()
      setCurrentBeatIdx(idx)
      setPulsing(true)
      setTimeout(() => setPulsing(false), beatDurationMs * 0.4)
      idx++
    }, beatDurationMs)

    return () => clearInterval(interval)
  }, [started, patternLen, beatDurationMs, requiredHits, hits, onComplete])

  const handleTap = useCallback(() => {
    if (done.current) return
    if (!started) {
      setStarted(true)
      return
    }

    const elapsed = Date.now() - beatStartRef.current
    const isHitBeat = pattern[currentBeatIdx] === true
    const inWindow = elapsed <= HIT_WINDOW_MS

    if (isHitBeat && inWindow) {
      setHits((h) => h + 1)
      setFeedbackText(isEn ? 'Perfect!' : 'Chuẩn!')
    } else if (!isHitBeat) {
      setMisses((m) => m + 1)
      setFeedbackText(isEn ? 'Wrong beat!' : 'Sai nhịp!')
    } else {
      setMisses((m) => m + 1)
      setFeedbackText(isEn ? 'Too late!' : 'Trễ rồi!')
    }

    setTimeout(() => setFeedbackText(''), 400)
  }, [started, currentBeatIdx, pattern, isEn])

  const accuracy = requiredHits > 0 ? Math.round((hits / requiredHits) * 100) : 0

  return (
    <div className="w-full max-w-sm mx-auto text-center select-none">
      {/* Pattern indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {pattern.map((beat, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              scale: i === currentBeatIdx && pulsing ? 1.4 : 1,
              backgroundColor:
                i < currentBeatIdx
                  ? '#94a3b8'
                  : i === currentBeatIdx
                    ? beat ? '#e11d48' : '#64748b'
                    : beat ? '#fda4af' : '#e2e8f0',
            }}
            transition={{ duration: 0.1 }}
            style={{
              width: beat ? 16 : 10,
              height: beat ? 16 : 10,
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* Stats row */}
      <div className="flex justify-between items-center text-sm font-medium text-slate-500 mb-6 px-2">
        <span className="text-green-600 font-bold">{isEn ? `${hits} hits` : `${hits} đúng`}</span>
        <span className="text-rose-400 font-bold">{bpm} BPM</span>
        <span className="text-red-400">{isEn ? `${misses} miss` : `${misses} trễ`}</span>
      </div>

      {/* Main tap button */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer pulse rings when beat active */}
        {pulsing && pattern[currentBeatIdx] && (
          <>
            <motion.div
              className="absolute rounded-full border-4 border-rose-400"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ width: 140, height: 140 }}
            />
            <motion.div
              className="absolute rounded-full border-2 border-pink-300"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2.8, opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ width: 140, height: 140 }}
            />
          </>
        )}

        <motion.button
          className="w-36 h-36 rounded-full flex flex-col items-center justify-center cursor-pointer border-none relative z-10"
          style={{
            background: started && pulsing && pattern[currentBeatIdx]
              ? 'linear-gradient(135deg, #e11d48, #f43f5e)'
              : 'linear-gradient(135deg, #fecdd3, #fda4af)',
            boxShadow: started && pulsing && pattern[currentBeatIdx]
              ? '0 8px 40px rgba(225, 29, 72, 0.5)'
              : '0 4px 20px rgba(225, 29, 72, 0.2)',
          }}
          whileTap={{ scale: 0.88 }}
          animate={{ scale: pulsing && pattern[currentBeatIdx] ? [1, 1.06, 1] : 1 }}
          transition={{ duration: 0.15 }}
          onClick={handleTap}
        >
          <Music
            size={40}
            className={started && pulsing && pattern[currentBeatIdx] ? 'text-white' : 'text-rose-500'}
            strokeWidth={1.5}
          />
          {!started && (
            <span className="text-xs font-bold text-rose-400 mt-1">
              {isEn ? 'Tap!' : 'Bấm!'}
            </span>
          )}
        </motion.button>
      </div>

      {/* Feedback popup */}
      <AnimatePresence>
        {feedbackText && (
          <motion.div
            key={feedbackText + Date.now()}
            className="text-lg font-bold text-rose-600 mb-2"
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-center gap-1">
              <Zap size={18} className="text-amber-500" />
              {feedbackText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instruction */}
      {!started && (
        <p className="text-sm text-slate-400 font-medium">
          {isEn ? 'Tap the button on red dots — avoid gray dots!' : 'Bấm khi chấm đỏ sáng lên — tránh chấm xám!'}
        </p>
      )}

      {/* Result overlay */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl z-20"
            style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1.3, 1] }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="mb-3"
            >
              <CheckCircle
                size={56}
                className={passed ? 'text-green-500' : 'text-slate-400'}
                strokeWidth={1.5}
              />
            </motion.div>
            <div className="text-3xl font-bold text-slate-800 mb-1">{accuracy}%</div>
            <div className="text-sm font-semibold text-slate-500">
              {passed
                ? (isEn ? 'You nailed it!' : 'Xuất sắc lắm!')
                : (isEn ? 'Keep practicing!' : 'Luyện thêm nha!')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
