import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppScreen, UserConfig, SessionState, JourneyState } from '../types'

interface AppStore {
  screen: AppScreen
  setScreen: (screen: AppScreen) => void

  config: UserConfig
  updateConfig: (partial: Partial<UserConfig>) => void

  session: SessionState
  recordRefusal: () => void
  recordChallenge: (challengeId: string) => void
  resetSession: () => void

  journeyState: JourneyState
  recordJourneyStep: (step: number) => void
  resetJourney: () => void

  settingsOpen: boolean
  toggleSettings: () => void
}

const defaultConfig: UserConfig = {
  senderName: 'Anh',
  receiverName: 'Em',
  themeColor: '#e11d48',
  language: 'vi',
  autoPlayMusic: false,
}

const defaultSession: SessionState = {
  refusalCount: 0,
  completedChallengeIds: [],
  currentChallengeIndex: 0,
}

const defaultJourney: JourneyState = {
  currentStep: 0,
  completedSteps: [],
  isReward: false,
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      screen: 'splash',
      setScreen: (screen) => set({ screen }),

      config: defaultConfig,
      updateConfig: (partial) =>
        set((state) => ({ config: { ...state.config, ...partial } })),

      session: defaultSession,
      recordRefusal: () =>
        set((state) => ({
          session: {
            ...state.session,
            refusalCount: state.session.refusalCount + 1,
          },
        })),
      recordChallenge: (challengeId) =>
        set((state) => ({
          session: {
            ...state.session,
            completedChallengeIds: [
              ...state.session.completedChallengeIds,
              challengeId,
            ],
            currentChallengeIndex: state.session.currentChallengeIndex + 1,
          },
        })),
      resetSession: () => set({ session: defaultSession, screen: 'splash' }),

      journeyState: defaultJourney,
      recordJourneyStep: (step) =>
        set((state) => ({
          journeyState: {
            ...state.journeyState,
            completedSteps: [...state.journeyState.completedSteps, step],
            currentStep: step + 1,
          },
        })),
      resetJourney: () => set({ journeyState: { ...defaultJourney, isReward: true } }),

      settingsOpen: false,
      toggleSettings: () =>
        set((state) => ({ settingsOpen: !state.settingsOpen })),
    }),
    {
      name: 'love-app-storage',
      partialize: (state) => ({
        config: state.config,
        session: state.session,
      }),
    },
  ),
)
