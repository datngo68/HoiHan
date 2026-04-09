import { challengeRegistry } from '../../challenges/registry'
import type { ChallengeCategory, ChallengeDefinition, JourneyStepDef } from '../../../types'

const JOURNEY_STEP_COUNT = 3 as const
const INTERACTIVE_CATEGORIES: ChallengeCategory[] = [
  'click',
  'text',
  'minigame',
  'truthdare',
  'rhythm',
  'draw',
]

type JourneyStepNumber = JourneyStepDef['stepNumber']

function shuffleChallenges(challenges: ChallengeDefinition[]): ChallengeDefinition[] {
  const shuffled = [...challenges]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const currentItem = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = currentItem
  }

  return shuffled
}

function isJourneyEligible(challenge: ChallengeDefinition): boolean {
  return (
    challenge.difficulty !== 'hard' &&
    INTERACTIVE_CATEGORIES.includes(challenge.category)
  )
}

function pickJourneyChallenges(
  selectionPool: ChallengeDefinition[],
  stepCount: number,
): ChallengeDefinition[] {
  if (selectionPool.length === 0) {
    return []
  }

  const picked = shuffleChallenges(selectionPool).slice(0, Math.min(stepCount, selectionPool.length))

  while (picked.length < stepCount) {
    const refillBatch = shuffleChallenges(selectionPool)

    for (const challenge of refillBatch) {
      picked.push(challenge)

      if (picked.length >= stepCount) {
        break
      }
    }
  }

  return picked
}

function toJourneySteps(challenges: ChallengeDefinition[]): JourneyStepDef[] {
  return challenges.map((challenge, idx) => ({
    id: challenge.id,
    stepNumber: (idx + 1) as JourneyStepNumber,
    titleKey: challenge.titleKey,
    descriptionKey: challenge.descriptionKey,
    unlockMessageKey: `heartJourney.unlockStep${idx + 1}`,
  }))
}

/**
 * Tạo 3 thử thách random cho Heart Journey:
 * - Ưu tiên challenge chưa hoàn thành trong session hiện tại
 * - Pool mặc định: interactive + không hard + không quiz
 * - Fallback theo tầng để luôn trả về đủ 3 step
 */
export function generateRandomJourneySteps(completedChallengeIds: string[] = []): JourneyStepDef[] {
  const allChallenges = challengeRegistry.getAll()

  if (allChallenges.length === 0) {
    return []
  }

  const completedSet = new Set(completedChallengeIds)

  const eligibleChallenges = allChallenges.filter(isJourneyEligible)
  const freshEligibleChallenges = eligibleChallenges.filter(
    (challenge) => !completedSet.has(challenge.id),
  )

  let selectionPool =
    freshEligibleChallenges.length >= JOURNEY_STEP_COUNT
      ? freshEligibleChallenges
      : eligibleChallenges

  if (selectionPool.length === 0) {
    selectionPool = allChallenges.filter((challenge) => challenge.difficulty !== 'hard')
  }

  if (selectionPool.length === 0) {
    selectionPool = allChallenges
  }

  const selectedChallenges = pickJourneyChallenges(selectionPool, JOURNEY_STEP_COUNT)

  return toJourneySteps(selectedChallenges)
}
