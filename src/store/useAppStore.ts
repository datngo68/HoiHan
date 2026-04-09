import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppScreen, UserConfig, SessionState, JourneyState } from '../types'
import { generateRandomJourneySteps } from '../features/heart-journey/data/journeyData'

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
  generateJourneySteps: () => void

  settingsOpen: boolean
  toggleSettings: () => void
}

const defaultConfig: UserConfig = {
  senderName: 'Anh',
  receiverName: 'Em',
  themeColor: '#e11d48',
  language: 'vi',
  autoPlayMusic: false,
  enableHeartJourney: true,
}

const createDefaultSession = (): SessionState => ({
  refusalCount: 0,
  completedChallengeIds: [],
  currentChallengeIndex: 0,
})

const createDefaultJourney = (): JourneyState => ({
  steps: [],
  currentStep: 0,
  completedSteps: [],
  isReward: false,
})

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      screen: 'splash',
      setScreen: (screen) => set({ screen }),

      config: defaultConfig,
      updateConfig: (partial) =>
        set((state) => ({ config: { ...state.config, ...partial } })),

      session: createDefaultSession(),
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
      resetSession: () =>
        set({
          session: createDefaultSession(),
          journeyState: createDefaultJourney(),
          screen: 'splash',
        }),

      journeyState: createDefaultJourney(),
      recordJourneyStep: (step) =>
        set((state) => ({
          journeyState: {
            ...state.journeyState,
            completedSteps: [...state.journeyState.completedSteps, step],
            currentStep: step + 1,
          },
        })),
      resetJourney: () => set({ journeyState: { ...createDefaultJourney(), isReward: true } }),
      generateJourneySteps: () =>
        set((state) => ({
          journeyState: {
            ...state.journeyState,
            steps: generateRandomJourneySteps(state.session.completedChallengeIds),
            currentStep: 0,
            completedSteps: [],
          },
        })),

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
