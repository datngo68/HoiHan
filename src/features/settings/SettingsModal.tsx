import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Settings, User, Heart, Globe, X, Check, ChevronDown, Share2, Music } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { encodeConfigToURL } from '../../utils/urlConfig'
import { playBgm, pauseBgm } from '../../hooks/useAudio'

export default function SettingsModal() {
  const { t, i18n } = useTranslation()
  const { config, updateConfig, settingsOpen, toggleSettings } = useAppStore()
  const [localConfig, setLocalConfig] = useState(config)

  const handleSave = () => {
    updateConfig(localConfig)
    i18n.changeLanguage(localConfig.language)
    localStorage.setItem('app-language', localConfig.language)
    
    // Update the browser URL without reloading
    const newUrl = encodeConfigToURL(localConfig)
    window.history.replaceState(null, '', newUrl)

    if (localConfig.autoPlayMusic) {
      playBgm()
    } else {
      pauseBgm()
    }

    toggleSettings()
  }

  const handleShare = useCallback(async () => {
    // Ensure we are sharing the latest typed config
    const shareUrl = encodeConfigToURL(localConfig)
    const shareData = {
      title: 'Em Có Yêu Anh Không?',
      text: `Gửi trọn yêu thương từ ${localConfig.senderName}`,
      url: shareUrl,
    }
    if (navigator.share) {
      await navigator.share(shareData).catch(() => {})
    } else {
      await navigator.clipboard.writeText(shareUrl)
      alert("Đã copy link chia sẻ!")
    }
  }, [localConfig])

  // Sync local when modal opens
  useEffect(() => {
    if (settingsOpen) {
      setLocalConfig(config)
    }
  }, [settingsOpen, config])

  return (
    <AnimatePresence>
      {settingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSettings}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            {/* Modal */}
            <motion.div
              className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto overflow-x-hidden rounded-3xl p-6 pointer-events-auto"
              style={{
                background: 'linear-gradient(180deg, #ffffff, #fff5f6)',
                boxShadow: '0 20px 60px rgba(225, 29, 72, 0.15), 0 4px 16px rgba(0,0,0,0.08)',
              }}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #fecdd3, #fda4af)' }}
                >
                  <Settings size={16} className="text-rose-600" strokeWidth={2.5} />
                </div>
                <h2
                  className="text-2xl font-bold text-rose-800"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {t('settings.title')}
                </h2>
              </div>
              <motion.button
                className="w-8 h-8 rounded-full flex items-center justify-center bg-rose-50 cursor-pointer border-none"
                whileHover={{ scale: 1.1, backgroundColor: '#fecdd3' }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleSettings}
                aria-label="Close"
              >
                <X size={16} className="text-rose-400" strokeWidth={2.5} />
              </motion.button>
            </div>

            <div className="space-y-5">
              {/* Receiver name */}
              <div>
                <label
                  htmlFor="input-receiver"
                  className="flex items-center gap-1.5 text-sm font-semibold text-rose-700 mb-1.5"
                >
                  <Heart size={14} className="text-rose-400" />
                  {t('settings.receiverName')}
                </label>
                <input
                  id="input-receiver"
                  type="text"
                  value={localConfig.receiverName}
                  onChange={(e) =>
                    setLocalConfig((c) => ({ ...c, receiverName: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 text-rose-900 font-medium focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 focus:outline-none transition-all placeholder:text-rose-300"
                  style={{ background: 'rgba(255,241,242,0.6)' }}
                  placeholder="Nhập tên..."
                />
              </div>

              {/* Sender name */}
              <div>
                <label
                  htmlFor="input-sender"
                  className="flex items-center gap-1.5 text-sm font-semibold text-rose-700 mb-1.5"
                >
                  <User size={14} className="text-rose-400" />
                  {t('settings.senderName')}
                </label>
                <input
                  id="input-sender"
                  type="text"
                  value={localConfig.senderName}
                  onChange={(e) =>
                    setLocalConfig((c) => ({ ...c, senderName: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 text-rose-900 font-medium focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 focus:outline-none transition-all placeholder:text-rose-300"
                  style={{ background: 'rgba(255,241,242,0.6)' }}
                  placeholder="Nhập tên..."
                />
              </div>

              {/* Language */}
              <div>
                <label
                  htmlFor="select-language"
                  className="flex items-center gap-1.5 text-sm font-semibold text-rose-700 mb-1.5"
                >
                  <Globe size={14} className="text-rose-400" />
                  {t('settings.language')}
                </label>
                <div className="relative">
                  <select
                    id="select-language"
                    value={localConfig.language}
                    onChange={(e) =>
                      setLocalConfig((c) => ({
                        ...c,
                        language: e.target.value as 'vi' | 'en',
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 text-rose-900 font-medium focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 focus:outline-none transition-all appearance-none cursor-pointer"
                    style={{ background: 'rgba(255,241,242,0.6)' }}
                  >
                    <option value="vi">🇻🇳 Tiếng Việt</option>
                    <option value="en">🇺🇸 English</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <ChevronDown size={18} className="text-rose-400" />
                  </div>
                </div>
              </div>
              {/* Autoplay Music Toggle */}
              <div
                className="flex items-center justify-between p-4 rounded-xl border-2 border-rose-200 cursor-pointer"
                style={{ background: 'rgba(255,241,242,0.6)' }}
                onClick={() => setLocalConfig(c => ({ ...c, autoPlayMusic: !c.autoPlayMusic }))}
              >
                <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
                  <Music size={16} className="text-rose-400" />
                  Tự động phát nhạc nền
                </div>
                
                {/* Custom Toggle Switch */}
                <div 
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center ${localConfig.autoPlayMusic ? 'bg-rose-500' : 'bg-rose-200'}`}
                >
                  <motion.div 
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{ x: localConfig.autoPlayMusic ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </div>

              {/* Heart Journey Toggle */}
              <div
                className="flex items-center justify-between p-4 rounded-xl border-2 border-rose-200 cursor-pointer mt-3"
                style={{ background: 'rgba(255,241,242,0.6)' }}
                onClick={() => setLocalConfig(c => ({ ...c, enableHeartJourney: !c.enableHeartJourney }))}
              >
                <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
                  <Heart size={16} className="text-rose-400" />
                  {t('settings.enableHeartJourney')}
                </div>
                
                {/* Custom Toggle Switch */}
                <div 
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center ${localConfig.enableHeartJourney ? 'bg-rose-500' : 'bg-rose-200'}`}
                >
                  <motion.div 
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{ x: localConfig.enableHeartJourney ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 mt-8">
              <div className="flex gap-3">
                <motion.button
                  id="btn-save-settings"
                  className="flex-[2] py-3 text-base font-bold text-white rounded-xl cursor-pointer border-none flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
                    boxShadow: '0 4px 16px rgba(225, 29, 72, 0.25)',
                  }}
                  whileHover={{ scale: 1.03, boxShadow: '0 6px 24px rgba(225, 29, 72, 0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                >
                  <Check size={16} strokeWidth={3} />
                  {t('settings.save')}
                </motion.button>
                <motion.button
                  id="btn-share-settings"
                  className="flex-1 py-3 text-base font-bold text-rose-600 bg-rose-50 rounded-xl border-2 border-rose-200 cursor-pointer flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.03, backgroundColor: '#fecdd3' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleShare}
                >
                  <Share2 size={16} strokeWidth={2.5} />
                  Chia sẻ
                </motion.button>
              </div>
              <motion.button
                id="btn-close-settings"
                className="w-full py-3 text-base font-medium text-rose-500 bg-transparent rounded-xl border-2 border-transparent hover:bg-rose-50 cursor-pointer flex items-center justify-center transition-colors"
                whileTap={{ scale: 0.98 }}
                onClick={toggleSettings}
              >
                {t('settings.close')}
              </motion.button>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
