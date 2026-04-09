export type AppScreen = 'splash' | 'question' | 'challenge' | 'celebration' | 'heart-journey'

export interface JourneyStepDef {
  id: string
  stepNumber: 1 | 2 | 3
  titleKey: string
  descriptionKey: string
  unlockMessageKey: string
}

export interface JourneyState {
  steps: JourneyStepDef[]
  currentStep: number
  completedSteps: number[]
  isReward: boolean
}

export interface UserConfig {
  senderName: string
  receiverName: string
  themeColor: string
  language: 'vi' | 'en'
  autoPlayMusic: boolean
  enableHeartJourney: boolean
}

export type ChallengeCategory = 'quiz' | 'click' | 'text' | 'minigame' | 'truthdare' | 'rhythm' | 'draw'
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard'

export interface ChallengeDefinition {
  id: string
  category: ChallengeCategory
  difficulty: ChallengeDifficulty
  titleKey: string
  descriptionKey: string
  timeLimitSeconds?: number
  config: Record<string, unknown>
}

export interface ChallengeResult {
  challengeId: string
  completed: boolean
  score?: number
  timeSpent?: number
}

export interface SessionState {
  refusalCount: number
  completedChallengeIds: string[]
  currentChallengeIndex: number
}
