import { motion } from 'framer-motion'
import { Gift, Gamepad2, Palette, Share2, Loader2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { navigateTo } from '../../pages/router'

const FEATURES = [
  { Icon: Gift, text: '1 link miễn phí mãi mãi', sub: 'Không cần thẻ tín dụng' },
  { Icon: Gamepad2, text: 'Mini-game tình yêu độc đáo', sub: 'Không thể từ chối' },
  { Icon: Palette, text: 'Tùy chỉnh theo ý bạn', sub: 'Màu sắc, tên, ngôn ngữ' },
  { Icon: Share2, text: 'Share link chỉ trong 1 giây', sub: 'Zalo, Facebook, copy link' },
]

/** Official Google "G" logo SVG — correct colors */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  )
}

/** Decorative cross/plus mark used as visual texture */
function Cross({ size = 12, opacity = 0.15 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ opacity }}>
      <line x1="6" y1="0" x2="6" y2="12" stroke="#e11d48" strokeWidth="1.5" />
      <line x1="0" y1="6" x2="12" y2="6" stroke="#e11d48" strokeWidth="1.5" />
    </svg>
  )
}

export default function AuthPage() {
  const { signIn, loading } = useAuth()

  async function handleGoogleLogin() {
    try {
      await signIn()
      navigateTo('dashboard')
    } catch {
      // Popup blocked → authService handles redirect
    }
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden flex"
      style={{
        background: '#08060A',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* ── Decorative noise texture overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.6,
        }}
        aria-hidden
      />

      {/* ── Background glow: bottom-left warm red ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(225,29,72,0.12) 0%, transparent 65%)',
          bottom: '-200px',
          left: '-150px',
        }}
        aria-hidden
      />
      {/* ── Background glow: top-right cool rose ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(190,18,60,0.08) 0%, transparent 65%)',
          top: '-100px',
          right: '-80px',
        }}
        aria-hidden
      />

      {/* ── Scattered cross texture marks ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[
          { top: '8%', left: '6%', size: 10, opacity: 0.18 },
          { top: '22%', right: '8%', size: 14, opacity: 0.12 },
          { top: '55%', left: '4%', size: 8, opacity: 0.1 },
          { bottom: '15%', right: '6%', size: 12, opacity: 0.15 },
          { bottom: '30%', left: '12%', size: 7, opacity: 0.09 },
          { top: '75%', right: '15%', size: 10, opacity: 0.08 },
        ].map((pos, i) => (
          <div key={i} className="absolute" style={pos as React.CSSProperties}>
            <Cross size={pos.size} opacity={pos.opacity} />
          </div>
        ))}
      </div>

      {/* ── Main content: asymmetric 60/40 split on desktop ── */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row min-h-screen">

        {/* LEFT COLUMN — Brand & Story (hidden on mobile, shown on desktop) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 xl:p-16"
          style={{ borderRight: '1px solid rgba(225,29,72,0.1)' }}
        >
          {/* Brand mark */}
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{ background: '#e11d48' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden>
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                </svg>
              </div>
              <span
                className="font-bold text-lg tracking-tight"
                style={{ color: '#fff', letterSpacing: '-0.03em' }}
              >
                LoveTrap
              </span>
            </div>

            {/* Hero heading */}
            <div className="mb-12">
              <p
                className="text-sm font-semibold uppercase tracking-[0.2em] mb-4"
                style={{ color: '#e11d48' }}
              >
                Dành cho những người dũng cảm
              </p>
              <h1
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                  color: '#fff',
                  lineHeight: 1.15,
                  marginBottom: '1.5rem',
                }}
              >
                Hỏi câu hỏi<br />
                <span style={{ color: '#e11d48' }}>quan trọng nhất</span>
              </h1>
              <p
                className="text-base leading-relaxed max-w-sm"
                style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}
              >
                Tạo một link tình yêu độc đáo, gửi cho người ấy, và xem điều kỳ diệu xảy ra.
              </p>
            </div>

            {/* Feature list — minimal, no boxes */}
            <div className="space-y-5">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                  className="flex items-start gap-4"
                >
                  <div
                    className="mt-0.5 w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(225,29,72,0.12)', border: '1px solid rgba(225,29,72,0.2)' }}
                  >
                    <f.Icon size={15} style={{ color: '#e11d48' }} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      {f.text}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {f.sub}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <div style={{ borderLeft: '2px solid rgba(225,29,72,0.35)', paddingLeft: '1rem' }}>
            <p
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '1.4rem',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              "Yêu là can đảm hỏi"
            </p>
          </div>
        </motion.div>

        {/* RIGHT COLUMN — Login form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="w-full lg:w-[45%] flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-16"
        >

          {/* Mobile-only brand header */}
          <div className="lg:hidden text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div
                className="w-7 h-7 flex items-center justify-center"
                style={{ background: '#e11d48' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white" aria-hidden>
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                </svg>
              </div>
              <span className="font-bold text-base tracking-tight text-white">LoveTrap</span>
            </div>
            <h1
              style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.2rem', color: '#fff' }}
            >
              Tạo link tình yêu
            </h1>
          </div>

          {/* Login card */}
          <div className="max-w-sm w-full mx-auto lg:mx-0">
            <div className="mb-8">
              <h2
                className="font-bold mb-2"
                style={{
                  color: '#fff',
                  fontSize: '1.5rem',
                  letterSpacing: '-0.03em',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Bắt đầu miễn phí
              </h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Đăng nhập để tạo và quản lý link của bạn
              </p>
            </div>

            {/* Google Sign-in Button — premium styling */}
            <motion.button
              id="btn-google-login"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 cursor-pointer border-none"
              style={{
                background: loading ? 'rgba(255,255,255,0.06)' : '#fff',
                color: loading ? 'rgba(255,255,255,0.4)' : '#1a1a1a',
                height: '52px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: '0.9rem',
                letterSpacing: '-0.01em',
                transition: 'all 0.2s ease',
              }}
              whileHover={loading ? {} : { y: -1, boxShadow: '0 8px 24px rgba(225,29,72,0.2)' }}
              whileTap={loading ? {} : { scale: 0.98, y: 0 }}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" style={{ color: 'rgba(255,255,255,0.4)' }} />
              ) : (
                <GoogleIcon />
              )}
              {loading ? 'Đang xử lý...' : 'Tiếp tục với Google'}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>hoặc</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Demo CTA */}
            <button
              onClick={() => navigateTo('game' as never)}
              className="w-full cursor-pointer border-none text-sm font-medium"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
                height: '44px',
                transition: 'all 0.2s',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(225,29,72,0.4)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
            >
              Xem demo game trước
            </button>

            {/* Trust footer */}
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="font-bold text-lg" style={{ color: '#fff', letterSpacing: '-0.03em' }}>1</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Link miễn phí</p>
                </div>
                <div className="h-6 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <div className="text-center">
                  <p className="font-bold text-lg" style={{ color: '#fff', letterSpacing: '-0.03em' }}>19.999₫</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Mỗi link thêm</p>
                </div>
                <div className="h-6 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <div className="text-center">
                  <p className="font-bold text-lg" style={{ color: '#fff', letterSpacing: '-0.03em' }}>∞</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Lượt share</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
