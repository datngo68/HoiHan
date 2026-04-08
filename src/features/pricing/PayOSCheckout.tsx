import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, RefreshCw, ShieldCheck } from 'lucide-react'
import type { UserConfig } from '../../types'

const FONT = "'Plus Jakarta Sans', system-ui, sans-serif"

interface PayOSCheckoutProps {
  config: UserConfig
  onSuccess: () => Promise<void>
  onClose: () => void
}

const MOCK_DELAY_MS = 3000 // Simulate payment confirm delay

/** Build VietQR image URL (no API key required) */
function buildVietQR(amount: number, description: string): string {
  const bankId = import.meta.env.VITE_BANK_ID || 'MB'
  const account = import.meta.env.VITE_BANK_ACCOUNT || '0000000000'
  const name = import.meta.env.VITE_ACCOUNT_NAME || 'LOVETRAP'
  return (
    `https://img.vietqr.io/image/${bankId}-${account}-compact2.png` +
    `?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(name)}`
  )
}

export default function PayOSCheckout({ config, onSuccess, onClose }: PayOSCheckoutProps) {
  const AMOUNT = 19999
  const description = `LOVETRAP ${config.senderName.slice(0, 6).toUpperCase()}`

  const [confirming, setConfirming] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Countdown spinner after "Đã chuyển khoản" click
  useEffect(() => {
    if (!confirming) return
    setCountdown(MOCK_DELAY_MS / 1000)
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(t)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [confirming])

  async function handleConfirm() {
    setConfirming(true)
    // Mock: wait MOCK_DELAY_MS then succeed
    // Real: poll PayOS API status endpoint here
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS))
    await onSuccess()
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="fixed z-50 left-1/2 top-1/2"
        style={{
          transform: 'translate(-50%, -50%)',
          width: 'min(380px, 92vw)',
          background: '#0d0d0d',
          border: '1px solid rgba(225,29,72,0.25)',
          fontFamily: FONT,
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
        aria-label="Thanh toán VietQR"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(225,29,72,0.05)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center" style={{ background: '#e11d48' }}>
              <ShieldCheck size={15} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-sm leading-none" style={{ color: '#fff' }}>Thanh toán an toàn</p>
              <p className="text-xs mt-0.5" style={{ color: '#e11d48', fontWeight: 700, letterSpacing: '-0.01em' }}>
                {AMOUNT.toLocaleString('vi-VN')}₫ / link
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-none cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
            aria-label="Đóng"
          >
            <X size={14} />
          </button>
        </div>

        {/* QR Code */}
        <div className="px-5 py-4 text-center">
          <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Quét mã QR để chuyển khoản
          </p>

          <div
            className="mx-auto mb-3 relative"
            style={{ width: 200, height: 200, background: '#fff', padding: '8px' }}
          >
            <img
              src={buildVietQR(AMOUNT, description)}
              alt="VietQR thanh toán"
              width={184}
              height={184}
              style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <div
            className="text-center py-2 px-3 mb-4"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Nội dung chuyển khoản</p>
            <p className="font-mono font-bold text-sm mt-0.5" style={{ color: '#e11d48' }}>{description}</p>
          </div>

          {/* Confirm button */}
          {!confirming ? (
            <motion.button
              id="btn-payos-confirm"
              onClick={handleConfirm}
              className="w-full py-3 font-bold text-sm border-none cursor-pointer"
              style={{ background: '#e11d48', color: '#fff' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              ✅ Tôi đã chuyển khoản
            </motion.button>
          ) : (
            <div
              className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
            >
              <RefreshCw size={14} className="animate-spin" />
              Đang xác nhận{countdown > 0 ? ` (${countdown}s)` : '...'}
            </div>
          )}

          <p className="text-center mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Hệ thống sẽ tự động xác nhận sau khi nhận được thanh toán
          </p>
        </div>
      </motion.div>
    </>
  )
}
