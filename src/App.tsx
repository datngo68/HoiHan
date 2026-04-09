import { AnimatePresence, motion } from 'framer-motion'
import { Settings, Music, Volume2, VolumeX, BellRing } from 'lucide-react'
import { useAppStore } from './store/useAppStore'
import { useBackgroundMusic, useAudioStore } from './hooks/useAudio'
import { useAppInitialization } from './hooks/useAppInitialization'
import SplashScreen from './features/splash/SplashScreen'
import QuestionScreen from './features/question/QuestionScreen'
import ChallengeScreen from './features/challenges/ChallengeScreen'
import CelebrationScreen from './features/celebration/CelebrationScreen'
import HeartJourneyScreen from './features/heart-journey/HeartJourneyScreen'
import SettingsModal from './features/settings/SettingsModal'

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

export default function App() {
  const screen = useAppStore((s) => s.screen)
  
  useAppInitialization()

  return (
    <>
      <SettingsButton />
      <AudioControls />
      <SettingsModal />

      <AnimatePresence mode="wait">
        {screen === 'splash' && <SplashScreen key="splash" />}
        {screen === 'question' && <QuestionScreen key="question" />}
        {screen === 'challenge' && <ChallengeScreen key="challenge" />}
        {screen === 'heart-journey' && <HeartJourneyScreen key="heart-journey" />}
        {screen === 'celebration' && <CelebrationScreen key="celebration" />}
      </AnimatePresence>
    </>
  )
}
