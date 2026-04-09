import type { ChallengeDefinition } from '../../types'
import { quizChallenges } from './data/quizData'
import { interactiveChallenges } from './data/interactiveData'
import { quizChallengesExtra } from './data/quizDataExtra'
import { interactiveChallengesExtra } from './data/interactiveDataExtra'
import { wowChallenges } from './data/wowChallengesData'
import { tier1Tier2Challenges } from './data/tier1Tier2Data'

/**
 * Challenge Registry — single source of all challenge definitions.
 * Adding new challenges = adding to data files. No core engine changes needed (NFR-06).
 */
class ChallengeRegistry {
  private challenges: Map<string, ChallengeDefinition> = new Map()

  register(challenge: ChallengeDefinition) {
    this.challenges.set(challenge.id, challenge)
  }

  registerMany(challenges: ChallengeDefinition[]) {
    challenges.forEach((c) => this.register(c))
  }

  get(id: string): ChallengeDefinition | undefined {
    return this.challenges.get(id)
  }

  getAll(): ChallengeDefinition[] {
    return Array.from(this.challenges.values())
  }

  getByCategory(category: string): ChallengeDefinition[] {
    return this.getAll().filter((c) => c.category === category)
  }

  count(): number {
    return this.challenges.size
  }
}

export const challengeRegistry = new ChallengeRegistry()

// Auto-register all challenges on import
challengeRegistry.registerMany(quizChallenges)
challengeRegistry.registerMany(interactiveChallenges)
challengeRegistry.registerMany(quizChallengesExtra)
challengeRegistry.registerMany(interactiveChallengesExtra)
challengeRegistry.registerMany(wowChallenges)
challengeRegistry.registerMany(tier1Tier2Challenges)
