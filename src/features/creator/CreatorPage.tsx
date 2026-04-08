import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, ArrowLeft, Loader2, Sparkles, CreditCard, Link2, Plus } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useLinks } from '../../hooks/useLinks'
import { encodeConfigToURL } from '../../utils/urlConfig'
import { navigateTo } from '../../pages/router'
import ThemePicker from './ThemePicker'
import LinkPreview from './LinkPreview'
import PayOSCheckout from '../pricing/PayOSCheckout'
import type { UserConfig } from '../../types'

const FONT = "'Plus Jakarta Sans', system-ui, sans-serif"

const DEFAULT_CONFIG: UserConfig = {
  senderName: '',
  receiverName: '',
  themeColor: '#e11d48',
  language: 'vi',
}

export default function CreatorPage() {
  const { user } = useAuth()
  const { canFree, loading: linksLoading, create } = useLinks()

  const [config, setConfig] = useState<UserConfig>(DEFAULT_CONFIG)
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [creating, setCreating] = useState(false)
  const [showPayOS, setShowPayOS] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) {
    navigateTo('login')
    return null
  }

  const set = (partial: Partial<UserConfig>) => setConfig((c) => ({ ...c, ...partial }))
  const isValid = config.senderName.trim().length > 0 && config.receiverName.trim().length > 0

  async function handleCreate(isPaid: boolean) {
    if (!isValid) return
    setCreating(true)
    setError(null)
    try {
      await create(config, isPaid)
      const url = encodeConfigToURL(config)
      setGeneratedUrl(url)
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setCreating(false)
    }
  }

  async function copyLink() {
    if (!generatedUrl) return
    await navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareZalo() {
    window.open(`https://zalo.me/share?url=${encodeURIComponent(generatedUrl ?? '')}`)
  }

  function shareFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generatedUrl ?? '')}`)
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #080808 0%, #140306 60%, #080808 100%)', fontFamily: FONT }}
    >
      {/* Top nav */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={() => navigateTo('dashboard')}
          className="flex items-center gap-2 bg-transparent border-none cursor-pointer text-sm"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          <ArrowLeft size={15} />
          Quay lại
        </button>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#e11d48' }}>
          Tạo link mới
        </span>
        <div className="w-16" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Left: Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="space-y-6"
        >
          <div>
            <h1
              className="font-black mb-2"
              style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', letterSpacing: '-0.04em' }}
            >
              Tạo link tình yêu
            </h1>
            <p className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
              {canFree && !linksLoading ? (
                <><Sparkles size={13} style={{ color: '#e11d48' }} /> Link đầu hoàn toàn miễn phí</>
              ) : (
                <><CreditCard size={13} style={{ color: 'rgba(255,255,255,0.4)' }} /> 19.999₫ · Thanh toán qua VietQR</>
              )}
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Tên bạn (người gửi)
              </label>
              <input
                id="input-sender"
                type="text"
                value={config.senderName}
                onChange={(e) => set({ senderName: e.target.value })}
                placeholder="Nguyễn Văn A"
                maxLength={30}
                className="w-full px-4 py-3 text-sm font-medium outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  caretColor: '#e11d48',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#e11d48' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Tên người ấy (người nhận)
              </label>
              <input
                id="input-receiver"
                type="text"
                value={config.receiverName}
                onChange={(e) => set({ receiverName: e.target.value })}
                placeholder="Nguyễn Thị B"
                maxLength={30}
                className="w-full px-4 py-3 text-sm font-medium outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  caretColor: '#e11d48',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#e11d48' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>

          {/* Theme */}
          <ThemePicker value={config.themeColor} onChange={(c) => set({ themeColor: c })} />

          {/* Language */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Ngôn ngữ
            </p>
            <div className="flex gap-2">
              {(['vi', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  id={`btn-lang-${lang}`}
                  onClick={() => set({ language: lang })}
                  className="px-4 py-1.5 text-xs font-semibold cursor-pointer border-none transition-all"
                  style={{
                    background: config.language === lang ? '#e11d48' : 'rgba(255,255,255,0.07)',
                    color: config.language === lang ? '#fff' : 'rgba(255,255,255,0.45)',
                  }}
                >
                  {lang === 'vi' ? 'VI — Tiếng Việt' : 'EN — English'}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm" style={{ color: '#e11d48' }}>{error}</p>
          )}

          {/* CTA */}
          {!generatedUrl ? (
            <motion.button
              id="btn-create-link"
              onClick={() => {
                if (!isValid) return
                if (canFree) {
                  handleCreate(false)
                } else {
                  setShowPayOS(true)
                }
              }}
              disabled={!isValid || creating || linksLoading}
              className="w-full font-bold text-sm cursor-pointer border-none flex items-center justify-center gap-2"
              style={{
                background: isValid ? '#e11d48' : 'rgba(255,255,255,0.06)',
                color: isValid ? '#fff' : 'rgba(255,255,255,0.25)',
                height: '52px',
                letterSpacing: '-0.01em',
                transition: 'all 0.2s',
              }}
              whileHover={isValid ? { y: -1, boxShadow: '0 8px 24px rgba(225,29,72,0.25)' } : {}}
              whileTap={isValid ? { scale: 0.98, y: 0 } : {}}
            >
              {creating ? (
                <><Loader2 size={16} className="animate-spin" /> Đang tạo...</>
              ) : canFree ? (
                <><Sparkles size={15} /> Tạo link miễn phí</>
              ) : (
                <><CreditCard size={15} /> Tạo link mới — 19.999₫</>
              )}
            </motion.button>
          ) : (
            /* Generated link area */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#16a34a' }}>
                <Check size={13} /> Link đã tạo thành công!
              </p>

              <div
                className="flex items-center gap-2"
                style={{ border: '1px solid rgba(22,163,74,0.4)', background: 'rgba(22,163,74,0.05)' }}
              >
                <input
                  readOnly
                  value={generatedUrl}
                  className="flex-1 px-3 py-2.5 text-xs font-mono bg-transparent border-none outline-none"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                />
                <button
                  id="btn-copy-link"
                  onClick={copyLink}
                  className="px-3 py-2.5 border-none cursor-pointer flex items-center gap-1.5"
                  style={{ background: copied ? '#16a34a' : '#e11d48', color: '#fff' }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span className="text-xs font-bold">{copied ? 'Đã copy' : 'Copy'}</span>
                </button>
              </div>

              {/* Share buttons */}
              <div className="flex gap-2">
                <button
                  id="btn-share-zalo"
                  onClick={shareZalo}
                  className="flex-1 py-2.5 text-xs font-semibold border-none cursor-pointer flex items-center justify-center gap-1.5"
                  style={{ background: '#0068ff', color: '#fff' }}
                >
                  <Link2 size={12} /> Zalo
                </button>
                <button
                  id="btn-share-fb"
                  onClick={shareFacebook}
                  className="flex-1 py-2.5 text-xs font-semibold border-none cursor-pointer flex items-center justify-center gap-1.5"
                  style={{ background: '#1877f2', color: '#fff' }}
                >
                  <Link2 size={12} /> Facebook
                </button>
                <button
                  onClick={() => { setGeneratedUrl(null); setConfig(DEFAULT_CONFIG) }}
                  className="px-3 py-2.5 text-xs font-semibold border-none cursor-pointer flex items-center gap-1"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
                >
                  <Plus size={12} /> Tạo thêm
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right: Sticky Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 }}
          className="lg:sticky lg:top-8 self-start"
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Preview
          </p>
          <LinkPreview
            senderName={config.senderName}
            receiverName={config.receiverName}
            themeColor={config.themeColor}
            isFree={canFree}
          />
        </motion.div>
      </div>

      {/* PayOS Modal */}
      <AnimatePresence>
        {showPayOS && (
          <PayOSCheckout
            config={config}
            onSuccess={async () => {
              setShowPayOS(false)
              await handleCreate(true)
            }}
            onClose={() => setShowPayOS(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
