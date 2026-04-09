import type { ChallengeDefinition } from '../../../types'

export interface RhythmConfig {
  type: 'rhythm-tap'
  /** true = tap beat, false = rest */
  pattern: boolean[]
  bpm: number
  timeLimitSeconds: number
}

export interface DrawHeartConfig {
  type: 'draw-heart'
  timeLimitSeconds: number
  /** 0-100, pixel overlap threshold to pass */
  passingScore: number
}

export const wowChallenges: ChallengeDefinition[] = [
  {
    id: 'rhythm-tap-1',
    category: 'rhythm',
    difficulty: 'easy',
    titleKey: 'Nhịp Yêu',
    descriptionKey: 'Bấm đúng nhịp theo pattern trái tim!',
    timeLimitSeconds: 16,
    config: {
      type: 'rhythm-tap',
      pattern: [true, false, true, true, false, true, false, true],
      bpm: 80,
      timeLimitSeconds: 16,
    } satisfies RhythmConfig,
  },
  {
    id: 'rhythm-tap-2',
    category: 'rhythm',
    difficulty: 'hard',
    titleKey: 'Nhịp Yêu Nâng Cao',
    descriptionKey: 'Pattern nhanh hơn — thử tài phản xạ!',
    timeLimitSeconds: 14,
    config: {
      type: 'rhythm-tap',
      pattern: [true, true, false, true, false, false, true, true, false, true],
      bpm: 100,
      timeLimitSeconds: 14,
    } satisfies RhythmConfig,
  },
  {
    id: 'draw-heart-1',
    category: 'draw',
    difficulty: 'easy',
    titleKey: 'Vẽ Trái Tim',
    descriptionKey: 'Vẽ hình trái tim thật đẹp nhé!',
    timeLimitSeconds: 30,
    config: {
      type: 'draw-heart',
      timeLimitSeconds: 30,
      passingScore: 55,
    } satisfies DrawHeartConfig,
  },
  {
    id: 'draw-heart-2',
    category: 'draw',
    difficulty: 'medium',
    titleKey: 'Họa Sĩ Tình Yêu',
    descriptionKey: 'Trái tim của bạn phải đạt 70% độ chính xác!',
    timeLimitSeconds: 25,
    config: {
      type: 'draw-heart',
      timeLimitSeconds: 25,
      passingScore: 70,
    } satisfies DrawHeartConfig,
  },
]
