export interface JourneyStepDef {
  id: string
  stepNumber: 1 | 2 | 3
  titleKey: string
  descriptionKey: string
  unlockMessageKey: string
  // Maps to ChallengeDispatcher fields
  challengeCategory: 'click' | 'quiz' | 'text'
  challengeType?: string // for click category sub-types
}

/** The 3 fixed journey steps — config is built dynamically at render time */
export const journeySteps: JourneyStepDef[] = [
  {
    id: 'journey-tap-hearts',
    stepNumber: 1,
    titleKey: 'heartJourney.step1Title',
    descriptionKey: 'heartJourney.step1Desc',
    unlockMessageKey: 'heartJourney.unlockStep1',
    challengeCategory: 'click',
    challengeType: 'tap-counter',
  },
  {
    id: 'journey-quiz-love',
    stepNumber: 2,
    titleKey: 'heartJourney.step2Title',
    descriptionKey: 'heartJourney.step2Desc',
    unlockMessageKey: 'heartJourney.unlockStep2',
    challengeCategory: 'quiz',
  },
  {
    id: 'journey-type-love',
    stepNumber: 3,
    titleKey: 'heartJourney.step3Title',
    descriptionKey: 'heartJourney.step3Desc',
    unlockMessageKey: 'heartJourney.unlockStep3',
    challengeCategory: 'text',
  },
]

/** Build runtime ChallengeDefinition config for each journey step */
export function buildJourneyConfig(
  stepId: string,
  senderName: string,
  receiverName: string,
): Record<string, unknown> {
  switch (stepId) {
    case 'journey-tap-hearts':
      return { type: 'tap-counter', targetTaps: 10, timeLimitSeconds: 30 }
    case 'journey-quiz-love':
      return {
        question: `${receiverName} yêu quý ai nhất?`,
        questionEn: `Who does ${receiverName} love the most?`,
        options: [
          { text: senderName, textEn: senderName, isCorrect: true },
          { text: 'Chính mình', textEn: 'Themselves', isCorrect: false },
          { text: 'Không ai cả', textEn: 'No one', isCorrect: false },
        ],
        correctIndex: 0,
        timeLimitSeconds: 15,
      }
    case 'journey-type-love':
      return {
        phrase: `${receiverName} yêu ${senderName}`,
        phraseEn: `${receiverName} loves ${senderName}`,
        timeLimitSeconds: 45,
      }
    default:
      return {}
  }
}
