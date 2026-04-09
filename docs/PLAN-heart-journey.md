# PLAN: Heart Journey — Reward Feature

> **Feature:** Chuỗi Micro-Challenge thưởng khi nhấn "CÓ"
> **Project Type:** WEB — React + Vite + TypeScript
> **Agent:** `frontend-specialist`
> **Status:** 📋 PLANNING

---

## 📐 Overview

Khi người dùng nhấn nút **"CÓ"** ở `QuestionScreen`, thay vì chuyển thẳng sang `CelebrationScreen`, họ sẽ đi qua một **"Heart Journey"** — chuỗi 3 micro-game ngắn theo narrative tình yêu có chủ đề. Mỗi bước mở khoá một mảnh confetti/nội dung, đến cuối cùng vào Celebration với animation đặc biệt hơn.

### Flow Hiện Tại

```
YES → CelebrationScreen
NO  → ChallengeScreen (phạt)
```

### Flow Sau Khi Có Feature

```
YES → HeartJourneyScreen ─────────────────────────────────────────────────┐
         ├── Step 1: Tap Hearts (Bấm tim nhanh 10 lần / 30s)             │
         ├── Step 2: Quiz Câu Hỏi Tình Yêu (1 câu trắc nghiệm ngọt)     │
         ├── Step 3: Type Love (Gõ câu bí mật)                           │
         └──────────────────────────────────────────→ CelebrationScreen ✨
NO  → ChallengeScreen (phạt, giữ nguyên)
```

---

## 🎯 Success Criteria

| # | Tiêu chí | Đo lường |
|---|----------|----------|
| 1 | YES button → HeartJourneyScreen (không phải Celebration trực tiếp) | Manual test |
| 2 | 3 bước journey hiển thị tuần tự với progress indicator | Visual check |
| 3 | Mỗi bước hoàn thành → confetti/unlock animation | Visual check |
| 4 | Skip button luôn khả dụng (không ép người dùng) | Manual test |
| 5 | Cuối journey → CelebrationScreen với flag `isReward: true` | DevTools |
| 6 | Hỗ trợ đa ngôn ngữ VI/EN đầy đủ | Kiểm tra ngôn ngữ |
| 7 | TypeScript `npm run build` pass không lỗi | Terminal |
| 8 | Mobile-responsive tốt ở 375px | DevTools |

---

## 🛠️ Tech Stack

| Layer | Technology | Lý do |
|-------|-----------|-------|
| Framework | React + TypeScript | Đồng bộ codebase hiện tại |
| Animation | Framer Motion (`AnimatePresence`, `motion`) | Đang dùng cho tất cả transitions |
| State | Zustand (`useAppStore`) | Single source of truth |
| i18n | react-i18next | Đồng bộ VI/EN toàn app |
| Reuse | `ChallengeDispatcher` + challenge components | Tránh viết lại mini-games |

---

## 📁 File Structure

```
src/
├── features/
│   ├── heart-journey/                ← NEW FOLDER
│   │   ├── HeartJourneyScreen.tsx    ← Main orchestrator
│   │   ├── JourneyStep.tsx           ← Wrapper cho mỗi bước
│   │   ├── JourneyProgress.tsx       ← Thanh progress tracker 3 bước
│   │   ├── StepResult.tsx            ← Confetti/unlock animation per step
│   │   └── data/
│   │       └── journeyData.ts        ← Cấu hình 3 steps
│   ├── question/
│   │   └── QuestionScreen.tsx        ← MODIFY: YES → 'heart-journey'
│   └── celebration/
│       └── CelebrationScreen.tsx     ← MODIFY: enhanced khi isReward=true
├── store/
│   └── useAppStore.ts                ← MODIFY: screen + journeyState
├── types/
│   └── index.ts                     ← MODIFY: AppScreen union type
├── i18n/
│   ├── vi.ts                        ← MODIFY: heartJourney namespace
│   └── en.ts                        ← MODIFY: heartJourney namespace
└── App.tsx                          ← MODIFY: route HeartJourneyScreen
```

---

## 📋 Task Breakdown

### PHASE 1 — Foundation

---

#### TASK 1.1 — Thêm Screen Type & Store State
**Agent:** `frontend-specialist` | **Skill:** `clean-code`
**Priority:** P0 — Blocking (mọi task khác phụ thuộc)

**INPUT:** `src/types/index.ts`, `src/store/useAppStore.ts`

**OUTPUT:**
- `AppScreen` union type thêm `'heart-journey'`
- `useAppStore` thêm state:
```ts
journeyState: {
  currentStep: number       // 0 = step 1, 1 = step 2, 2 = step 3
  completedSteps: number[]  // array index các bước đã hoàn thành
  isReward: boolean         // true khi đến từ YES button
}
recordJourneyStep: (step: number) => void
resetJourney: () => void
```
- `journeyState` **KHÔNG** persist (memory-only, không lưu localStorage)

**VERIFY:** `npm run build` pass không lỗi TypeScript

---

#### TASK 1.2 — Tạo Journey Data
**Agent:** `frontend-specialist` | **Skill:** `clean-code`
**Priority:** P0 — Blocking TASK 2.3

**INPUT:** Config mini-games, dùng lại `ClickChallengeConfig`, `QuizConfig`, `TypeLoveConfig` từ `data/interactiveData.ts`

**OUTPUT:** `src/features/heart-journey/data/journeyData.ts`

```ts
interface JourneyStepDef {
  id: string
  stepNumber: 1 | 2 | 3
  titleKey: string         // i18n key
  descriptionKey: string   // i18n key
  unlockMessageKey: string // i18n key
  challengeCategory: string
  config: Record<string, unknown>
}

// 3 Bước mặc định:
// Step 1: click-hearts — targetCount: 10, timeLimitSeconds: 30
// Step 2: quiz — Câu hỏi tình yêu ngọt ngào (tùy chọn)
// Step 3: text — Gõ phrase động dựa trên tên "{{receiver}} yêu {{sender}}"
```

**VERIFY:** File import OK không lỗi TypeScript

---

#### TASK 1.3 — Thêm i18n Keys
**Agent:** `frontend-specialist` | **Skill:** `clean-code`
**Priority:** P1 | **Parallel với 1.1, 1.2**

**INPUT:** `src/i18n/vi.ts`, `src/i18n/en.ts`

**OUTPUT:** Thêm namespace `heartJourney` vào cả hai file:

```ts
heartJourney: {
  title: 'Hành Trình Tình Yêu',
  subtitle: 'Hoàn thành {{total}} thử thách để mở khoá khoảnh khắc đặc biệt!',
  stepBadge: 'Bước {{step}}/{{total}}',
  skip: 'Bỏ qua hành trình',
  step1Title: 'Chứng minh trái tim bạn đang đập!',
  step1Desc: 'Bấm tim {{target}} lần trong {{seconds}}s',
  step2Title: 'Câu hỏi tình yêu ngọt ngào',
  step2Desc: 'Chọn đáp án đúng nhé!',
  step3Title: 'Lời hứa bí mật',
  step3Desc: 'Gõ lại câu này để xác nhận tình yêu',
  unlockStep1: 'Trái tim đã được xác nhận!',
  unlockStep2: 'Câu trả lời hoàn hảo!',
  unlockStep3: 'Lời hứa đã được ghi lại!',
  allUnlocked: 'Tình yêu đã được chứng minh!',
  continueBtn: 'Tiếp tục',
  rewardTitle: 'Tình Yêu Đã Được Chứng Minh!',
  rewardSubtitle: '{{receiver}} thực sự yêu {{sender}}!',
}
```

**VERIFY:** Reload app, không lỗi missing translation

---

### PHASE 2 — Core Components

---

#### TASK 2.1 — JourneyProgress Component
**Agent:** `frontend-specialist` | **Skill:** `frontend-design`
**Priority:** P1 | **Depends:** TASK 1.1

**INPUT:** Thiết kế step tracker 3 bước dạng circle + line

**OUTPUT:** `src/features/heart-journey/JourneyProgress.tsx`

```tsx
interface Props {
  totalSteps: number       // = 3
  currentStep: number      // 0-based index
  completedSteps: number[] // index các bước đã xong
}
```

UI Spec:
- 3 circles (Heart icon) nối bằng horizontal line
- Completed: filled rose, check icon, scale-up animation
- Current: pulsing rose outline
- Upcoming: slate gray
- Responsive: fit trong max-w-sm container

**VERIFY:** Hiển thị 3 bước, animation transition đúng khi props thay đổi

---

#### TASK 2.2 — StepResult (Unlock Animation)
**Agent:** `frontend-specialist` | **Skill:** `frontend-design`
**Priority:** P1 | **Depends:** TASK 1.1, 1.3

**INPUT:** Thiết kế overlay "Bước X hoàn thành"

**OUTPUT:** `src/features/heart-journey/StepResult.tsx`

```tsx
interface Props {
  stepNumber: 1 | 2 | 3
  unlockMessageKey: string  // i18n key
  onContinue: () => void    // callback sau khi dismiss
  autoAdvanceMs?: number    // default: 2500
}
```

UI Spec:
- Backdrop blur overlay
- Icon lớn (Heart/Sparkles/PenLine tùy step) bounce in với spring
- Unlock message fade in sau 0.4s
- 8-12 confetti hearts bay từ icon ra xung quanh
- Nút "Tiếp tục" hoặc auto-dismiss sau `autoAdvanceMs`

**VERIFY:** Overlay xuất hiện, confetti hoạt động, onContinue gọi đúng

---

#### TASK 2.3 — JourneyStep Wrapper
**Agent:** `frontend-specialist` | **Skill:** `clean-code`
**Priority:** P2 | **Depends:** TASK 1.2

**INPUT:** `ChallengeDispatcher.tsx` (reuse nguyên xi), `journeyData.ts`

**OUTPUT:** `src/features/heart-journey/JourneyStep.tsx`

```tsx
interface Props {
  stepDef: JourneyStepDef
  onComplete: (success: boolean) => void
}
```

Logic:
- Map `JourneyStepDef` → `ChallengeDefinition` format
- Render `<ChallengeDispatcher>` với config đã map
- Bọc trong `motion.div` với slide-in từ right
- **Không viết lại game logic** — reuse 100% challenge components

**VERIFY:** Mỗi step render đúng game component tương ứng

---

#### TASK 2.4 — HeartJourneyScreen (Orchestrator)
**Agent:** `frontend-specialist` | **Skill:** `clean-code`
**Priority:** P2 | **Depends:** TASK 2.1, 2.2, 2.3

**INPUT:** `journeyData`, `JourneyProgress`, `JourneyStep`, `StepResult`, `useAppStore`

**OUTPUT:** `src/features/heart-journey/HeartJourneyScreen.tsx`

State nội bộ:
```ts
const [currentStepIdx, setCurrentStepIdx] = useState(0)
const [showResult, setShowResult] = useState(false)
const [completedSteps, setCompletedSteps] = useState<number[]>([])
```

Flow:
1. Header: title + JourneyProgress
2. AnimatePresence → JourneyStep hiện tại
3. Khi step complete → `showResult = true` → StepResult overlay
4. StepResult onContinue → advance hoặc kết thúc
5. Khi tất cả 3 xong → `setScreen('celebration')`
6. Skip button (top right) → `setScreen('celebration')` luôn

**VERIFY:** 3 bước chạy tuần tự, kết thúc vào Celebration

---

### PHASE 3 — Integration

---

#### TASK 3.1 — Cập nhật QuestionScreen (YES handler)
**Agent:** `frontend-specialist` | **Skill:** `clean-code`
**Priority:** P2 | **Depends:** TASK 1.1

**INPUT:** `src/features/question/QuestionScreen.tsx` lines 73-76

**OUTPUT:**
```tsx
// Before:
const handleYes = useCallback(() => {
  playSfx('pop')
  setScreen('celebration')
}, [setScreen])

// After:
const { setScreen, resetJourney } = useAppStore()
const handleYes = useCallback(() => {
  playSfx('pop')
  resetJourney()
  setScreen('heart-journey')
}, [setScreen, resetJourney])
```

**VERIFY:** Nhấn YES → navigate đến HeartJourneyScreen

---

#### TASK 3.2 — Cập nhật App.tsx Route
**Agent:** `frontend-specialist` | **Skill:** `clean-code`
**Priority:** P2 | **Depends:** TASK 2.4

**INPUT:** `src/App.tsx`

**OUTPUT:**
```tsx
import HeartJourneyScreen from './features/heart-journey/HeartJourneyScreen'

// Bên trong AnimatePresence block:
{screen === 'heart-journey' && <HeartJourneyScreen key="heart-journey" />}
```

**VERIFY:** `npm run build` pass, screen route hoạt động

---

#### TASK 3.3 — Enhanced CelebrationScreen (isReward mode)
**Agent:** `frontend-specialist` | **Skill:** `frontend-design`
**Priority:** P3 | **Depends:** TASK 3.2

**INPUT:** `src/features/celebration/CelebrationScreen.tsx`

**OUTPUT:**
- Đọc `useAppStore((s) => s.journeyState.isReward)`
- Nếu `isReward === true`:
  - Title: `t('heartJourney.rewardTitle')` thay vì `t('celebration.title')`
  - Subtitle: `t('heartJourney.rewardSubtitle', {...names})`
  - Confetti count tăng gấp đôi (hoặc thêm màu rose/gold)
  - Badge "Heart Journey Complete" nhỏ phía trên title
- Nếu `isReward === false`: giữ nguyên hành vi cũ

**VERIFY:** Celebration enhanced khi đến từ HeartJourney; bình thường khi không

---

### PHASE 4 — Polish

---

#### TASK 4.1 — Mobile Responsive
**Priority:** P3 | **Depends:** TASK 2.4, 3.3

Kiểm tra tại 375px (iPhone SE):
- Progress tracker không overflow
- Step card fit trong viewport
- Skip button không bị che bởi safe-area
- StepResult overlay căn giữa đúng

**VERIFY:** DevTools Mobile 375px — layout đẹp, không overflow

---

#### TASK 4.2 — Full Build Verification
**Priority:** P3 | **Depends:** Tất cả tasks

```bash
npm run build
```

**VERIFY:** `✓ built in Xms` không warning TypeScript hay ESLint

---

## ⚠️ Risk Registry

| Risk | Xác suất | Impact | Mitigation |
|------|----------|--------|------------|
| TypeLove challenge gõ khó → frustrate | Medium | High | Cho gợi ý sau 5s, hoặc skip tự động |
| Journey quá dài → người dùng bỏ | Medium | High | Mỗi step MAX 30s, Skip luôn visible |
| ChallengeDispatcher không map được JourneyStep | Low | Medium | Viết adapter nhỏ trong JourneyStep.tsx |
| isReward state persist sai khi reload | Low | Low | Không persist journeyState (memory-only) |

---

## 📅 Timeline Ước Tính

| Phase | Tasks | Thời gian |
|-------|-------|-----------|
| Phase 1 — Foundation | 1.1, 1.2, 1.3 | ~30 phút |
| Phase 2 — Components | 2.1, 2.2, 2.3, 2.4 | ~60 phút |
| Phase 3 — Integration | 3.1, 3.2, 3.3 | ~20 phút |
| Phase 4 — Polish | 4.1, 4.2 | ~15 phút |
| **Tổng** | | **~2 giờ 5 phút** |

---

## 🔗 Task Dependency Graph

```
1.1 ──┬──→ 2.1 ──→ 2.4 ──→ 3.2 ──→ 3.3
      ├──→ 2.3 ──┘
      └──→ 3.1
1.2 ──────→ 2.3
1.3 ──────→ 2.2 ──→ 2.4
           Tất cả ──→ 4.1 ──→ 4.2
```

**Parallel an toàn:** 1.1 + 1.2 + 1.3 cùng lúc, 2.1 + 2.2 cùng lúc

---

## ✅ Phase X: Verification Checklist

- [ ] YES → HeartJourneyScreen (không bypass Celebration)
- [ ] 3 steps chạy tuần tự, progress tracker update đúng
- [ ] Mỗi step: game load + kết quả hiển thị đúng
- [ ] Skip button hoạt động ở bất kỳ step nào
- [ ] StepResult overlay hiển thị + confetti + auto-dismiss
- [ ] Sau step 3: chuyển sang CelebrationScreen (isReward=true)
- [ ] CelebrationScreen enhanced (title, confetti đặc biệt)
- [ ] Tiếng Anh: tất cả text dịch đúng
- [ ] Mobile 375px: layout không vỡ
- [ ] `npm run build` pass không lỗi
- [ ] Không có hardcoded string Tiếng Việt trong JSX

---

*Plan created: 2026-04-09 | Author: Project Planner Agent*
