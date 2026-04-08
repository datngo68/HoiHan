import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface LinkPreviewProps {
  senderName: string
  receiverName: string
  themeColor: string
  isFree: boolean
}

export default function LinkPreview({ senderName, receiverName, themeColor, isFree }: LinkPreviewProps) {
  const sender = senderName || 'Anh'
  const receiver = receiverName || 'Em'

  return (
    <div
      className="mx-auto"
      style={{
        width: '100%',
        maxWidth: '280px',
        background: '#0d0d0d',
        border: `1px solid ${themeColor}30`,
        padding: '1.5rem',
        position: 'relative',
      }}
    >
      {/* Badge */}
      <div
        className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 uppercase tracking-widest"
        style={{
          background: isFree ? 'rgba(255,255,255,0.08)' : themeColor,
          color: isFree ? 'rgba(255,255,255,0.5)' : '#fff',
          fontSize: '0.65rem',
        }}
      >
        {isFree ? 'FREE' : 'PAID'}
      </div>

      {/* Mini header */}
      <div className="flex items-center gap-1.5 mb-4">
        <div className="w-2 h-2 rounded-full" style={{ background: themeColor }} />
        <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
          lovetrap.app
        </span>
      </div>

      {/* Main content preview */}
      <div className="text-center space-y-3">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart
            size={32}
            fill={themeColor}
            stroke="none"
            className="mx-auto"
          />
        </motion.div>

        <p className="font-bold text-sm leading-snug" style={{ color: '#fff' }}>
          {receiver} ơi,
        </p>

        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {sender} muốn hỏi bạn<br />một câu quan trọng...
        </p>

        {/* Fake button */}
        <div
          className="text-center py-2 text-xs font-bold mt-2"
          style={{
            background: themeColor,
            color: '#fff',
          }}
        >
          Bắt đầu 💌
        </div>
      </div>

      {/* Color accent bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: themeColor }}
      />
    </div>
  )
}
