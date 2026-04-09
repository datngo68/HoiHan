import { challengeRegistry } from '../../challenges/registry'
import type { JourneyStepDef } from '../../../types'

/** 
 * Lấy ra 3 trò chơi NGẪU NHIÊN từ toàn bộ 20+ Challenge 
 * Lọc bỏ những game khó (hard) để phần thưởng bớt căng thẳng.
 */
export function generateRandomJourneySteps(): JourneyStepDef[] {
  // 1. Lọc tất cả các game có category minigame, click, text, v.v., ngoại trừ difficulty 'hard'
  const availableChallenges = Array.from(challengeRegistry.getAll())
    .filter(c => c.difficulty !== 'hard' && c.category !== 'quiz') // Có thể loại quiz nếu muốn, hoặc cứ giữ hết.

  // 2. Thuật toán Fisher-Yates Shuffle mảng
  const shuffled = [...availableChallenges]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  // 3. Lấy đúng 3 challenge đầu tiên
  const selectedChallenges = shuffled.slice(0, 3)

  // 4. Map thành JourneyStepDef
  return selectedChallenges.map((challenge, idx) => {
    return {
      id: challenge.id,
      stepNumber: (idx + 1) as 1 | 2 | 3,
      titleKey: challenge.titleKey,
      descriptionKey: challenge.descriptionKey,
      unlockMessageKey: `heartJourney.unlockStep${idx + 1}`,
    }
  })
}
