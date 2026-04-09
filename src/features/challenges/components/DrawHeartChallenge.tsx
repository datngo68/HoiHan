import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Trash2, CheckCircle, RotateCcw } from 'lucide-react'

interface Props {
  timeLimitSeconds: number
  passingScore: number
  onComplete: (success: boolean) => void
}

/** Generate ideal heart path points (normalized 0-1) */
function getIdealHeartPoints(cx: number, cy: number, size: number): [number, number][] {
  const pts: [number, number][] = []
  for (let t = 0; t <= Math.PI * 2; t += 0.05) {
    const x = size * 16 * Math.pow(Math.sin(t), 3)
    const y = -size * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    pts.push([cx + x, cy + y])
  }
  return pts
}

/** Score: how many ideal heart pixels are covered by drawn stroke */
function scoreDrawing(userCanvas: HTMLCanvasElement, width: number, height: number): number {
  const offscreen = document.createElement('canvas')
  offscreen.width = width
  offscreen.height = height
  const ctx = offscreen.getContext('2d')!

  const cx = width / 2
  const cy = height / 2.2
  const size = Math.min(width, height) * 0.022

  // Draw ideal heart stroked to offscreen
  const pts = getIdealHeartPoints(cx, cy, size)
  ctx.beginPath()
  ctx.moveTo(pts[0][0], pts[0][1])
  pts.forEach(([x, y]) => ctx.lineTo(x, y))
  ctx.closePath()
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 22
  ctx.stroke()

  const idealData = ctx.getImageData(0, 0, width, height).data
  const userCtx = userCanvas.getContext('2d')!
  const userData = userCtx.getImageData(0, 0, width, height).data

  let idealPixels = 0
  let coveredPixels = 0

  for (let i = 3; i < idealData.length; i += 4) {
    if (idealData[i] > 50) {
      idealPixels++
      if (userData[i] > 50) coveredPixels++
    }
  }

  if (idealPixels === 0) return 0
  return Math.min(100, Math.round((coveredPixels / idealPixels) * 100))
}

export default function DrawHeartChallenge({ timeLimitSeconds, passingScore, onComplete }: Props) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds)
  const [started, setStarted] = useState(false)
  const done = useRef(false)

  // Timer
  useEffect(() => {
    if (!started || done.current) return
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [started])

  // Draw guide heart on canvas mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const { width, height } = canvas

    ctx.clearRect(0, 0, width, height)

    // Guide heart
    const cx = width / 2
    const cy = height / 2.2
    const size = Math.min(width, height) * 0.022
    const pts = getIdealHeartPoints(cx, cy, size)

    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    pts.forEach(([x, y]) => ctx.lineTo(x, y))
    ctx.closePath()
    ctx.strokeStyle = 'rgba(225, 29, 72, 0.12)'
    ctx.lineWidth = 3
    ctx.stroke()
  }, [])

  const getPos = (e: React.MouseEvent | React.TouchEvent): [number, number] => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      const t = e.touches[0]
      return [(t.clientX - rect.left) * scaleX, (t.clientY - rect.top) * scaleY]
    }
    return [(e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY]
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (done.current || score !== null) return
    if (!started) setStarted(true)
    const ctx = canvasRef.current!.getContext('2d')!
    const [x, y] = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.strokeStyle = '#e11d48'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    setDrawing(true)
    setHasDrawn(true)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing || score !== null) return
    e.preventDefault()
    const ctx = canvasRef.current!.getContext('2d')!
    const [x, y] = getPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDraw = () => setDrawing(false)

  const handleSubmit = useCallback(() => {
    if (done.current) return
    done.current = true
    const canvas = canvasRef.current
    if (!canvas) {
      onComplete(false)
      return
    }
    const s = scoreDrawing(canvas, canvas.width, canvas.height)
    setScore(s)
    const success = s >= passingScore
    setTimeout(() => onComplete(success), 1800)
  }, [passingScore, onComplete])

  const handleClear = () => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    // Redraw guide
    const cx = width / 2
    const cy = height / 2.2
    const size = Math.min(width, height) * 0.022
    const pts = getIdealHeartPoints(cx, cy, size)
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    pts.forEach(([x, y]) => ctx.lineTo(x, y))
    ctx.closePath()
    ctx.strokeStyle = 'rgba(225, 29, 72, 0.12)'
    ctx.lineWidth = 3
    ctx.stroke()

    setHasDrawn(false)
    done.current = false
    setScore(null)
  }

  return (
    <div className="w-full max-w-sm mx-auto text-center">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="text-rose-500 font-bold text-sm">
          {isEn ? 'Draw a heart!' : 'Vẽ trái tim nhé!'}
        </span>
        <span className="text-slate-500 text-sm font-medium bg-white/70 px-3 py-1 rounded-full border border-slate-200">
          {started ? `${timeLeft}s` : (isEn ? 'Start drawing!' : 'Bắt đầu vẽ!')}
        </span>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-rose-100 bg-[#fff9f9] mb-4">
        <canvas
          ref={canvasRef}
          width={320}
          height={280}
          className="w-full touch-none cursor-crosshair block"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />

        {/* Score result overlay */}
        <AnimatePresence>
          {score !== null && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, bounce: 0.6 }}
              >
                <CheckCircle
                  size={52}
                  className={score >= passingScore ? 'text-green-500' : 'text-slate-400'}
                  strokeWidth={1.5}
                />
              </motion.div>
              <div className="text-4xl font-bold text-slate-800 mt-3">{score}%</div>
              <div className="text-sm font-semibold text-slate-500 mt-1">
                {score >= passingScore
                  ? (isEn ? 'Beautiful heart!' : 'Trái tim đẹp lắm!')
                  : (isEn ? 'Try again!' : 'Vẽ lại nào!')}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      {score === null && (
        <div className="flex gap-3">
          <motion.button
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border-none flex-1"
            whileTap={{ scale: 0.95 }}
            onClick={handleClear}
            disabled={!hasDrawn}
          >
            <RotateCcw size={14} strokeWidth={2.5} />
            {isEn ? 'Clear' : 'Vẽ lại'}
          </motion.button>

          <motion.button
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer border-none flex-1"
            style={{
              background: hasDrawn
                ? 'linear-gradient(135deg, #e11d48, #f43f5e)'
                : 'linear-gradient(135deg, #fda4af, #fecdd3)',
              boxShadow: hasDrawn ? '0 4px 15px rgba(225, 29, 72, 0.3)' : 'none',
            }}
            whileTap={hasDrawn ? { scale: 0.95 } : undefined}
            onClick={hasDrawn ? handleSubmit : undefined}
            disabled={!hasDrawn}
          >
            <Trash2 size={14} strokeWidth={2.5} />
            {isEn ? 'Submit' : 'Nộp bài'}
          </motion.button>
        </div>
      )}

      <p className="text-xs text-slate-400 mt-3">
        {isEn ? `Pass at ${passingScore}% similarity` : `Đạt khi đạt ${passingScore}% độ tương đồng`}
      </p>
    </div>
  )
}
