import { useEffect, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Settings, Music, Volume2, VolumeX, BellRing } from 'lucide-react'
import { useAppStore } from './store/useAppStore'
import { useBackgroundMusic, useAudioStore } from './hooks/useAudio'
import { decodeConfigFromURL } from './utils/urlConfig'
import { useAuthListener } from './hooks/useAuth'
import { useAuthStore } from './store/useAuthStore'
import { detectPage } from './pages/router'
import SplashScreen from './features/splash/SplashScreen'
import QuestionScreen from './features/question/QuestionScreen'
import ChallengeScreen from './features/challenges/ChallengeScreen'
import CelebrationScreen from './features/celebration/CelebrationScreen'
import SettingsModal from './features/settings/SettingsModal'

// Lazy-load SaaS pages (code-split, not loaded for game users)
const AuthPage = lazy(() => import('./features/auth/AuthPage'))
const CreatorPage = lazy(() => import('./features/creator/CreatorPage'))
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'))

function SettingsButton() {
  const toggleSettings = useAppStore((s) => s.toggleSettings)

  return (
    <motion.button
      id="btn-settings"
      className="fixed right-4 z-30 w-11 h-11 flex items-center justify-center rounded-full cursor-pointer border-none"
      style={{
        top: 'max(1rem, env(safe-area-inset-top, 1rem))',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,241,242,0.9))',
        boxShadow: '0 2px 12px rgba(225, 29, 72, 0.12), 0 1px 3px rgba(0,0,0,0.06)',
        backdropFilter: 'blur(8px)',
      }}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      onClick={toggleSettings}
      aria-label="Settings"
    >
      <Settings size={18} className="text-rose-500" strokeWidth={2.2} />
    </motion.button>
  )
}

function AudioControls() {
  const { musicPlaying, handleToggle } = useBackgroundMusic()
  const sfxEnabled = useAudioStore((s) => s.sfxEnabled)
  const toggleSfx = useAudioStore((s) => s.toggleSfx)

  return (
    <div className="fixed bottom-4 right-4 z-30 flex gap-2">
      <motion.button
        id="btn-music"
        className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer border-none"
        style={{
          background: musicPlaying
            ? 'linear-gradient(135deg, #fecdd3, #fda4af)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,241,242,0.9))',
          boxShadow: musicPlaying
            ? '0 2px 12px rgba(225, 29, 72, 0.25)'
            : '0 2px 10px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(8px)',
        }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        onClick={handleToggle}
        aria-label={musicPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
        title={musicPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
      >
        {musicPlaying ? (
          <Music size={16} className="text-rose-600" strokeWidth={2.2} />
        ) : (
          <VolumeX size={16} className="text-rose-400" strokeWidth={2} />
        )}
      </motion.button>

      <motion.button
        id="btn-sfx"
        className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer border-none"
        style={{
          background: sfxEnabled
            ? 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,241,242,0.9))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(241,241,241,0.8))',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(8px)',
        }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        onClick={toggleSfx}
        aria-label={sfxEnabled ? 'Tắt SFX' : 'Bật SFX'}
        title={sfxEnabled ? 'Tắt SFX' : 'Bật SFX'}
      >
        {sfxEnabled ? (
          <BellRing size={16} className="text-rose-500" strokeWidth={2.2} />
        ) : (
          <Volume2 size={16} className="text-rose-300" strokeWidth={2} />
        )}
      </motion.button>
    </div>
  )
}

/** Full-page loading spinner shown while Firebase resolves auth */
function AuthLoadingScreen() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: '#080808' }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-4xl"
      >
        💌
      </motion.div>
    </div>
  )
}

export default function App() {
  const screen = useAppStore((s) => s.screen)
  const config = useAppStore((s) => s.config)
  const updateConfig = useAppStore((s) => s.updateConfig)
  const { i18n } = useTranslation()

  // Firebase auth listener — must be initialized at root
  const initAuthListener = useAuthListener()
  const authLoading = useAuthStore((s) => s.loading)

  useEffect(() => {
    const unsubscribe = initAuthListener()
    return unsubscribe
  }, [initAuthListener])

  // Load config from URL on mount
  useEffect(() => {
    const urlConfig = decodeConfigFromURL()
    if (urlConfig) {
      updateConfig(urlConfig)
      if (urlConfig.language) {
        i18n.changeLanguage(urlConfig.language)
      }
    }
  }, [updateConfig, i18n])

  // Update document title
  useEffect(() => {
    const appTitle = i18n.t('splash.appTitle', {
      receiver: config.receiverName,
      sender: config.senderName,
      defaultValue: 'Em Có Yêu Anh Không?',
    })
    document.title = appTitle
  }, [config.receiverName, config.senderName, i18n.language])

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  // Detect current page from URL
  const page = detectPage()

  // Show loading while Firebase resolves initial auth state (only for SaaS pages)
  if (authLoading && (page === 'create' || page === 'dashboard')) {
    return <AuthLoadingScreen />
  }

  // --- SaaS Pages (lazy loaded, code-split) ---
  if (page === 'login') {
    return (
      <Suspense fallback={<AuthLoadingScreen />}>
        <AuthPage />
      </Suspense>
    )
  }

  if (page === 'create') {
    return (
      <Suspense fallback={<AuthLoadingScreen />}>
        <CreatorPage />
      </Suspense>
    )
  }

  if (page === 'dashboard') {
    return (
      <Suspense fallback={<AuthLoadingScreen />}>
        <DashboardPage />
      </Suspense>
    )
  }

  // --- Default: Original Love Trap Game ---
  return (
    <>
      <SettingsButton />
      <AudioControls />
      <SettingsModal />

      <AnimatePresence mode="wait">
        {screen === 'splash' && <SplashScreen key="splash" />}
        {screen === 'question' && <QuestionScreen key="question" />}
        {screen === 'challenge' && <ChallengeScreen key="challenge" />}
        {screen === 'celebration' && <CelebrationScreen key="celebration" />}
      </AnimatePresence>
    </>
  )
}
