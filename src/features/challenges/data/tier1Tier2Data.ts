import type { ChallengeDefinition } from '../../../types'

export interface HeartShooterConfig {
  type: 'heart-shooter'
  targetCount: number
  brokenCount: number
  timeLimitSeconds: number
  spawnInterval: number
}

export interface MadLibsConfig {
  type: 'mad-libs'
  templates: { vi: string; en: string }[]
  options: { vi: string[]; en: string[] }[]
}

export interface TruthDareConfig {
  type: 'truth-dare'
  truths: { vi: string; en: string }[]
  dares: { vi: string; en: string }[]
}

export interface BouquetConfig {
  type: 'bouquet-builder'
  requiredFlowers: number
  timeLimitSeconds: number
}

export interface MemoryLaneConfig {
  type: 'memory-lane'
  scenes: { icon: string; captionVi: string; captionEn: string }[]
}

export const tier1Tier2Challenges: ChallengeDefinition[] = [
  // B1 — Heart Shooter
  {
    id: 'heart-shooter-1',
    category: 'click',
    difficulty: 'medium',
    titleKey: 'Bắn Tim Yêu!',
    descriptionKey: 'Bắt tim hồng, tránh tim đen!',
    timeLimitSeconds: 15,
    config: {
      type: 'heart-shooter',
      targetCount: 12,
      brokenCount: 6,
      timeLimitSeconds: 15,
      spawnInterval: 700,
    } satisfies HeartShooterConfig,
  },
  {
    id: 'heart-shooter-2',
    category: 'click',
    difficulty: 'hard',
    titleKey: 'Bắn Tim Cấp Cao!',
    descriptionKey: 'Nhanh hơn, nhiều tim đen hơn!',
    timeLimitSeconds: 12,
    config: {
      type: 'heart-shooter',
      targetCount: 15,
      brokenCount: 10,
      timeLimitSeconds: 12,
      spawnInterval: 500,
    } satisfies HeartShooterConfig,
  },
  // C1 — Mad Libs
  {
    id: 'mad-libs-1',
    category: 'minigame',
    difficulty: 'easy',
    titleKey: 'Câu Chuyện Tình Yêu',
    descriptionKey: 'Hoàn thành câu tình yêu!',
    config: {
      type: 'mad-libs',
      templates: [
        { vi: '{{receiver}} yêu {{sender}} vì {{sender}} ___', en: '{{receiver}} loves {{sender}} because {{sender}} is ___' },
        { vi: 'Mỗi ngày gặp {{sender}}, {{receiver}} cảm thấy ___', en: 'Every day with {{sender}}, {{receiver}} feels ___' },
        { vi: '{{receiver}} và {{sender}} cùng nhau ___ mãi mãi', en: '{{receiver}} and {{sender}} will ___ together forever' },
      ],
      options: [
        { vi: ['dễ thương quá', 'ngầu lắm', 'ấm áp lắm', 'thần kỳ lắm'], en: ['so adorable', 'so cool', 'so warm', 'so magical'] },
        { vi: ['hạnh phúc', 'tim đập nhanh', 'nhẹ nhàng lắm', 'rất bình yên'], en: ['happy', 'heart fluttering', 'so light', 'at peace'] },
        { vi: ['yêu thương nhau', 'cười thật nhiều', 'đi khắp nơi', 'hạnh phúc hoài'], en: ['love each other', 'laugh a lot', 'travel everywhere', 'be happy'] },
      ],
    } satisfies MadLibsConfig,
  },
  // D2 — Truth or Dare
  {
    id: 'truth-dare-1',
    category: 'truthdare',
    difficulty: 'easy',
    titleKey: 'Thật hay Thách?',
    descriptionKey: 'Chọn và hoàn thành thử thách!',
    config: {
      type: 'truth-dare',
      truths: [
        { vi: 'Khi nào {{receiver}} có cảm tình với {{sender}} lần đầu?', en: 'When did {{receiver}} first develop feelings for {{sender}}?' },
        { vi: '{{receiver}} thích nhất điều gì ở {{sender}}?', en: 'What does {{receiver}} like most about {{sender}}?' },
        { vi: 'Kỷ niệm nào với {{sender}} làm {{receiver}} nhớ nhất?', en: "What memory with {{sender}} does {{receiver}} cherish most?" },
        { vi: '{{receiver}} có bao giờ mơ về {{sender}} không?', en: 'Has {{receiver}} ever dreamed about {{sender}}?' },
      ],
      dares: [
        { vi: 'Nhắn tin cho {{sender}} một câu thật ngọt!', en: 'Send {{sender}} the sweetest message right now!' },
        { vi: 'Kể cho {{sender}} nghe lý do yêu bằng 3 từ!', en: 'Tell {{sender}} why you love them in 3 words!' },
        { vi: 'Hát 1 câu bài hát yêu thích của {{sender}}!', en: "Hum one line of {{sender}}'s favorite song!" },
        { vi: 'Vẽ trái tim tặng {{sender}} trên tay!', en: 'Draw a heart on your hand as a gift to {{sender}}!' },
      ],
    } satisfies TruthDareConfig,
  },
  // C4 — Bouquet Builder
  {
    id: 'bouquet-builder-1',
    category: 'minigame',
    difficulty: 'easy',
    titleKey: 'Bó Hoa Tình Yêu',
    descriptionKey: 'Xếp bó hoa tặng người ấy!',
    timeLimitSeconds: 30,
    config: {
      type: 'bouquet-builder',
      requiredFlowers: 5,
      timeLimitSeconds: 30,
    } satisfies BouquetConfig,
  },
  // C3 — Memory Lane
  {
    id: 'memory-lane-1',
    category: 'minigame',
    difficulty: 'easy',
    titleKey: 'Khoảnh Khắc Ký Ức',
    descriptionKey: 'Chọn khoảnh khắc nói lên tình yêu của bạn!',
    config: {
      type: 'memory-lane',
      scenes: [
        { icon: 'sunset', captionVi: 'Hoàng hôn cùng nhau', captionEn: 'Watching sunsets together' },
        { icon: 'coffee', captionVi: 'Buổi sáng cà phê', captionEn: 'Morning coffee dates' },
        { icon: 'rain', captionVi: 'Ngắm mưa qua cửa sổ', captionEn: 'Watching rain by the window' },
        { icon: 'stars', captionVi: 'Đếm sao ban đêm', captionEn: 'Counting stars at night' },
        { icon: 'dance', captionVi: 'Khiêu vũ tự phát', captionEn: 'Spontaneous dancing' },
        { icon: 'letters', captionVi: 'Viết thư tay', captionEn: 'Handwritten letters' },
      ],
    } satisfies MemoryLaneConfig,
  },
]
