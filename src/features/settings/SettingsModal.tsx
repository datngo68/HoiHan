import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Settings, User, Heart, Globe, X, Check, ChevronDown } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export default function SettingsModal() {
  const { t, i18n } = useTranslation()
  const { config, updateConfig, settingsOpen, toggleSettings } = useAppStore()
  const [localConfig, setLocalConfig] = useState(config)

  const handleSave = () => {
    updateConfig(localConfig)
    i18n.changeLanguage(localConfig.language)
    localStorage.setItem('app-language', localConfig.language)
    toggleSettings()
  }

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

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-md rounded-3xl p-6"
            style={{
              background: 'linear-gradient(180deg, #ffffff, #fff5f6)',
              boxShadow: '0 20px 60px rgba(225, 29, 72, 0.15), 0 4px 16px rgba(0,0,0,0.08)',
            }}
            initial={{ opacity: 0, scale: 0.9, y: '-45%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: '-45%' }}
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
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <motion.button
                id="btn-save-settings"
                className="flex-1 py-3 text-base font-bold text-white rounded-xl cursor-pointer border-none flex items-center justify-center gap-2"
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
                id="btn-close-settings"
                className="px-6 py-3 text-base font-medium text-rose-600 bg-rose-50 rounded-xl border-2 border-rose-200 cursor-pointer flex items-center justify-center gap-1.5"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={toggleSettings}
              >
                {t('settings.close')}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
