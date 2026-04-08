# PLAN: Love Trap SaaS — Firebase + PayOS

> **Project Type:** WEB (React + Vite + TypeScript + Firebase)
> **Created:** 2026-04-08
> **Status:** 🟡 APPROVED — READY FOR IMPLEMENTATION
> **Stack Change:** Pure Frontend → Firebase Auth + Firestore + Firebase Hosting

---

## 🎯 Overview

Chuyển Love Trap thành **SaaS platform** với:

| Tính năng | Mô tả |
|---|---|
| **Google Login** | Firebase Auth — Sign in with Google |
| **Link đầu free mãi** | Mỗi user được 1 link miễn phí vĩnh viễn |
| **Link thứ 2+ trả tiền** | 19.999 VNĐ/link — thanh toán PayOS |
| **Quản lý link** | Dashboard xem, xoá, share link đã tạo |
| **Hosting** | Firebase Hosting (all-in-one) |

### Business Logic Core
```
User đăng nhập Google
    → Có 0 link → Tạo link đầu MIỄN PHÍ
    → Có ≥ 1 link → Muốn tạo thêm → Trả 19.999đ qua PayOS → Link mới được tạo
    → Link đã tạo → Free mãi, share không giới hạn, không watermark
```

---

## ✅ Success Criteria

| Tiêu chí | Đo lường |
|---|---|
| Google login hoạt động | Click "Đăng nhập Google" → auth thành công < 3s |
| Link đầu tạo được free | User mới → tạo link → lưu Firestore, không charge |
| Link thứ 2 bị chặn | User có 1 link → tạo thêm → mở PayOS modal |
| Thanh toán thành công | PayOS confirm → link mới tạo trong Firestore |
| Dashboard hiển thị links | User thấy danh sách link đã tạo + nút share/xoá |
| Firebase Hosting deploy | `firebase deploy` → app live |

---

## 🧰 Tech Stack

| Thành phần | Công nghệ | Ghi chú |
|---|---|---|
| Frontend | React 19 + Vite + TypeScript | Hiện có |
| Styling | Tailwind CSS v4 + Framer Motion | Hiện có |
| Auth | Firebase Authentication (Google Provider) | **MỚI** |
| Database | Cloud Firestore | **MỚI** |
| Hosting | Firebase Hosting | **MỚI** |
| Payment | PayOS API (QR + webhook-less polling) | **MỚI** |
| State | Zustand (extend thêm authSlice) | Extend |

### Firestore Schema

```
users/
  {uid}/
    email: string
    displayName: string
    photoURL: string
    createdAt: Timestamp
    linkCount: number          ← track số link đã tạo

links/
  {linkId}/
    uid: string               ← owner
    senderName: string
    receiverName: string
    themeColor: string
    language: "vi" | "en"
    encodedUrl: string        ← ?id=<base64>
    isPaid: boolean           ← false nếu link đầu
    paidAmount: number        ← 0 hoặc 19999
    createdAt: Timestamp
    views: number             ← optional analytics
```

---

## 📁 File Structure

```
love-trap/
├── src/
│   ├── features/
│   │   ├── auth/                          [NEW]
│   │   │   ├── AuthPage.tsx               [NEW] - Landing/Login page
│   │   │   └── UserAvatar.tsx             [NEW] - Header user badge
│   │   ├── creator/                       [NEW]
│   │   │   ├── CreatorPage.tsx            [NEW] - Form tạo link
│   │   │   ├── LinkPreview.tsx            [NEW] - Preview card real-time
│   │   │   └── ThemePicker.tsx            [NEW] - Chọn màu theme
│   │   ├── dashboard/                     [NEW]
│   │   │   ├── DashboardPage.tsx          [NEW] - Quản lý links
│   │   │   └── LinkCard.tsx               [NEW] - Card 1 link
│   │   └── pricing/                       [NEW]
│   │       └── PayOSCheckout.tsx          [NEW] - Modal thanh toán
│   ├── hooks/
│   │   ├── useAuth.ts                     [NEW] - Firebase auth hook
│   │   └── useLinks.ts                    [NEW] - Firestore CRUD hook
│   ├── services/
│   │   ├── firebase.ts                    [NEW] - Firebase init
│   │   ├── authService.ts                 [NEW] - signIn/signOut/onAuthState
│   │   └── linksService.ts                [NEW] - Firestore link CRUD
│   ├── store/
│   │   ├── useAppStore.ts                 [KEEP] - App state (unchanged)
│   │   └── useAuthStore.ts                [NEW] - Auth + user state
│   ├── pages/
│   │   └── router.ts                      [NEW] - Hash-based page routing
│   ├── utils/
│   │   └── urlConfig.ts                   [KEEP] - encodeConfigToURL (reuse)
│   └── App.tsx                            [MODIFY] - Add routing + auth guard
├── firebase.json                          [NEW] - Firebase Hosting config
├── .firebaserc                            [NEW] - Firebase project binding
├── .env.local                             [NEW] - Firebase + PayOS credentials
└── .env.example                           [NEW] - Template credentials
```

---

## 📋 Task Breakdown

---

### 🔵 PHASE 0 — Firebase Setup (Prerequisite)

> ⚠️ **Manual steps** — Bạn cần làm trước khi code:
> 1. Tạo project Firebase tại https://console.firebase.google.com
> 2. Enable Authentication → Google Provider
> 3. Enable Firestore Database (production mode)
> 4. Enable Firebase Hosting
> 5. Copy Firebase config → `.env.local`
> 6. Install Firebase CLI: `npm install -g firebase-tools`
> 7. `firebase login` + `firebase init`

---

#### Task 0.1 — Install Dependencies
- **Agent:** `frontend-specialist`
- **Skill:** `nodejs-best-practices`
- **Priority:** P0 — Blocker tuyệt đối
- **Input:** `package.json` hiện có
- **Output:** Firebase SDK được install

```bash
npm install firebase
npm install -D firebase-tools
```

- **Verify:** `import { initializeApp } from 'firebase/app'` không lỗi
- **Dependencies:** None
- **Rollback:** `npm uninstall firebase`

---

#### Task 0.2 — Firebase Init + Environment Config
- **Agent:** `frontend-specialist`
- **Skill:** `clean-code`
- **Priority:** P0
- **Input:** Firebase console credentials
- **Output:** `src/services/firebase.ts`, `.env.example`, `.env.local`

```typescript
// src/services/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
```

```env
# .env.example
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# PayOS
VITE_PAYOS_CLIENT_ID=
VITE_PAYOS_API_KEY=
VITE_PAYOS_CHECKSUM_KEY=
VITE_BANK_ID=
VITE_BANK_ACCOUNT=
VITE_ACCOUNT_NAME=
```

- **Verify:** App load không console error Firebase
- **Dependencies:** Task 0.1
- **Rollback:** Xoá `firebase.ts`, remove env vars

---

### 🔵 PHASE 1 — Authentication

#### Task 1.1 — Auth Service
- **Agent:** `frontend-specialist`
- **Skill:** `clean-code`
- **Priority:** P0
- **Input:** `src/services/firebase.ts`
- **Output:** `src/services/authService.ts`

```typescript
// Expose:
signInWithGoogle()    // → GoogleAuthProvider popup
signOut()             // → Firebase signOut
onAuthStateChanged()  // → callback(user | null)
createOrUpdateUser()  // → upsert user doc in Firestore users/{uid}
```

- **Verify:** signInWithGoogle() → Google popup → user object returned
- **Dependencies:** Task 0.2
- **Rollback:** Xoá file

---

#### Task 1.2 — Auth Store (Zustand)
- **Agent:** `frontend-specialist`
- **Skill:** `react-best-practices`
- **Priority:** P0
- **Input:** `authService.ts`
- **Output:** `src/store/useAuthStore.ts`

```typescript
interface AuthStore {
  user: FirebaseUser | null
  loading: boolean
  setUser: (user) => void
  setLoading: (v) => void
}
```

- **Verify:** `useAuthStore.getState().user` → user sau login, null sau logout
- **Dependencies:** Task 1.1

---

#### Task 1.3 — useAuth Hook
- **Agent:** `frontend-specialist`
- **Skill:** `react-best-practices`
- **Priority:** P1
- **Input:** `useAuthStore`, `authService`
- **Output:** `src/hooks/useAuth.ts`

```typescript
// Returns: { user, loading, signIn, signOut }
// Effect: onAuthStateChanged → setUser, createOrUpdateUser
```

- **Verify:** Component dùng `useAuth()` → reactive khi auth state thay đổi
- **Dependencies:** Task 1.1, 1.2

---

#### Task 1.4 — AuthPage (Landing + Login UI)
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P1
- **Input:** `useAuth` hook
- **Output:** `src/features/auth/AuthPage.tsx`

```
UI Layout:
- Background: gradient rose/pink (nhất quán với app)
- Hero: "Tạo Link Tình Yêu Của Bạn 💌"
- Subtitle: "1 link miễn phí · Share ngay · Không giới hạn lượt xem"
- CTA Button: [Đăng nhập bằng Google] (Google Icon + text)
- Footer: "19.999đ/link thêm • Thanh toán qua PayOS"
```

> 🔴 **Design rules:**
> - KHÔNG dùng màu violet/purple trong UI chính
> - KHÔNG copy Google's standard login template
> - Glassmorphism card, subtle animation

- **Verify:** Click Google button → Firebase popup → redirect đến Dashboard
- **Dependencies:** Task 1.3

---

#### Task 1.5 — UserAvatar Header Component
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P2
- **Input:** `useAuth` hook
- **Output:** `src/features/auth/UserAvatar.tsx`

```
UI:
- Fixed top-left (hoặc right, tránh đè Settings button)
- Avatar ảnh Google (img từ photoURL)
- Hover → dropdown: "Trang chủ", "Quản lý link", "Đăng xuất"
```

- **Verify:** Sau login → avatar + tên hiện, click "Đăng xuất" → về AuthPage
- **Dependencies:** Task 1.3, 1.4

---

### 🟡 PHASE 2 — Firestore Link Service

#### Task 2.1 — Links Service
- **Agent:** `frontend-specialist`
- **Skill:** `clean-code`
- **Priority:** P0 (core business logic)
- **Input:** `src/services/firebase.ts`
- **Output:** `src/services/linksService.ts`

```typescript
// Expose:
getUserLinks(uid: string): Promise<Link[]>
getUserLinkCount(uid: string): Promise<number>
createLink(uid: string, config: LinkConfig, isPaid: boolean): Promise<string>  // returns linkId
deleteLink(uid: string, linkId: string): Promise<void>
incrementLinkViews(linkId: string): Promise<void>

// Business rule ENFORCED HERE:
canCreateFreeLink(uid: string): Promise<boolean>
// → true nếu user chưa có link nào
// → false nếu đã có ≥ 1 link
```

- **Verify:** Unit test logic: user linkCount 0 → canCreateFreeLink = true, linkCount 1 → false
- **Dependencies:** Task 0.2
- **Rollback:** Xoá file, revert Firestore writes

---

#### Task 2.2 — useLinks Hook
- **Agent:** `frontend-specialist`
- **Skill:** `react-best-practices`
- **Priority:** P1
- **Input:** `linksService.ts`, `useAuthStore`
- **Output:** `src/hooks/useLinks.ts`

```typescript
// Returns:
{
  links: Link[],
  loading: boolean,
  canCreateFree: boolean,  ← derived from linkCount
  createLink: (config) => Promise<void>,
  deleteLink: (id) => Promise<void>,
}
```

- **Verify:** `canCreateFree` = true khi links.length === 0
- **Dependencies:** Task 2.1, 1.2

---

### 🟡 PHASE 3 — Creator Page

#### Task 3.1 — ThemePicker Component
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P1
- **Input:** None
- **Output:** `src/features/creator/ThemePicker.tsx`

```
UI:
- 8 swatches màu preset (rose, coral, amber, emerald, sky, indigo, pink, red)
- 1 ô "custom" → <input type="color">
- Click → visual selection + callback onChange(color)
```

- **Verify:** Chọn màu → preview component nhận đúng color value
- **Dependencies:** None

---

#### Task 3.2 — LinkPreview Component
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P1
- **Input:** FormState (senderName, receiverName, themeColor)
- **Output:** `src/features/creator/LinkPreview.tsx`

```
UI:
- Card glassmorphism 320px
- Mockup nhỏ: "💌 {receiverName}, {senderName} muốn hỏi bạn điều gì..."
- Theme color applied (button, accent)
- Badge: FREE (link đầu) hoặc PAID (link thứ 2+)
```

- **Verify:** Real-time update khi form thay đổi (debounce 100ms)
- **Dependencies:** Task 3.1

---

#### Task 3.3 — CreatorPage
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P2
- **Input:** `useLinks`, `useAuth`, ThemePicker, LinkPreview, `encodeConfigToURL`
- **Output:** `src/features/creator/CreatorPage.tsx`

```
Layout (2-col desktop, 1-col mobile):
Left Column:
  - "Tạo Link Tình Yêu 💌" header
  - Input: Tên người gửi (bạn)
  - Input: Tên người nhận (người ấy)
  - ThemePicker
  - Language toggle (VI / EN)

  Điều kiện CTA:
  - canCreateFree === true  → [Tạo link miễn phí ✨]
  - canCreateFree === false → [Tạo link mới — 19.999đ →]
                               (click → mở PayOSCheckout modal)

Right Column:
  - LinkPreview (sticky)

Bottom (sau khi tạo):
  - Generated link (input copyable)
  - Share buttons: [📋 Copy] [📱 Zalo] [📘 Facebook]
```

**Auth Guard:** Nếu user chưa login → redirect `/?page=login`

- **Verify:**
  - User 0 links → tạo → Firestore có document mới, không charge
  - User 1+ links → click CTA → PayOS modal mở
- **Dependencies:** Task 2.2, 3.1, 3.2

---

### 🟠 PHASE 4 — Dashboard

#### Task 4.1 — LinkCard Component
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P2
- **Input:** Link object từ Firestore
- **Output:** `src/features/dashboard/LinkCard.tsx`

```
UI mỗi card:
- Tên người gửi → người nhận  (vd: "Nam → Linh")
- Theme color preview dot
- Ngày tạo
- Lượt xem (views count)
- Badges: FREE | PAID
- Actions: [🔗 Copy link] [🗑 Xoá]
```

- **Verify:** Click copy → clipboard có URL đúng, click xoá → confirm dialog → xoá khỏi Firestore
- **Dependencies:** Task 2.2

---

#### Task 4.2 — DashboardPage
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P2
- **Input:** `useLinks`, LinkCard
- **Output:** `src/features/dashboard/DashboardPage.tsx`

```
Layout:
- Header: "Link của bạn" + UserAvatar
- Stats bar: "X link đã tạo · 1 free"
- Grid LinkCards (2-col desktop, 1-col mobile)
- Empty state: "Bạn chưa có link nào. Tạo ngay →"
- FAB Button [+ Tạo link mới] → `/create`
```

**Auth Guard:** Redirect về login nếu chưa auth

- **Verify:** Load → hiện đúng links từ Firestore của user đó
- **Dependencies:** Task 4.1, 2.2

---

### 🔴 PHASE 5 — Payment (PayOS)

#### Task 5.1 — PayOS Checkout Modal
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P3
- **Input:** `useLinks`, `useAuth`, PayOS API config
- **Output:** `src/features/pricing/PayOSCheckout.tsx`

```
Flow:
1. Modal mở: "Tạo link mới — 19.999 VNĐ"
2. Hiển thị VietQR (static image từ vietqr.io API):
   https://img.vietqr.io/image/{BANK}-{ACCOUNT}-compact2.png
   ?amount=19999&addInfo=LOVETRAP-{uid}&accountName={NAME}
3. Nội dung chuyển khoản: "LOVETRAP {uid 6 ký tự}"
4. Button: [Tôi đã chuyển khoản]
   → Polling check (2s interval × 30 lần = 1 phút timeout)
   → MOCK mode: auto-confirm sau 3s (khi chưa có PayOS key)
   → REAL mode: PayOS webhook confirm → Firestore update isPaid=true
5. Confirm → gọi createLink() → đóng modal → link mới xuất hiện
```

> ⚠️ **PayOS Polling Strategy** (browser-safe, không cần server):
> - Sau khi user click "Đã chuyển khoản", gọi PayOS GET order status
> - `GET https://api-merchant.payos.vn/v2/payment-requests/{orderCode}`
> - Nếu `status === "PAID"` → createLink() trong Firestore

- **Verify:**
  - Mock: Click xác nhận → link tạo thành công
  - Real: Quét QR, chuyển khoản → auto detect, link được tạo
- **Dependencies:** Task 2.1, 3.3

---

#### Task 5.2 — Firestore Security Rules
- **Agent:** `frontend-specialist`
- **Skill:** `clean-code`
- **Priority:** P0 (security)
- **Input:** Firestore console
- **Output:** `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User doc: chỉ owner đọc/ghi
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    // Links: chỉ owner tạo/xoá, MỌI NGƯỜI đọc (để share link hoạt động)
    match /links/{linkId} {
      allow read: if true;  // Public read (share link)
      allow create: if request.auth != null
                    && request.resource.data.uid == request.auth.uid;
      allow delete: if request.auth != null
                    && resource.data.uid == request.auth.uid;
      allow update: if request.auth != null
                    && resource.data.uid == request.auth.uid;
    }
  }
}
```

- **Verify:** Unauthenticated user không tạo được link, chủ link xoá được link của mình
- **Dependencies:** Task 0.2

---

### 🟢 PHASE 6 — Routing & App Integration

#### Task 6.1 — Hash Router
- **Agent:** `frontend-specialist`
- **Skill:** `react-best-practices`
- **Priority:** P0
- **Input:** `App.tsx`
- **Output:** `src/pages/router.ts`

```typescript
// Đọc ?page= param
// page === 'login'     → AuthPage
// page === 'create'    → CreatorPage (auth required)
// page === 'dashboard' → DashboardPage (auth required)
// (default)            → App gốc (game flow)
```

- **Verify:** URL change → đúng component render
- **Dependencies:** None

---

#### Task 6.2 — App.tsx Update
- **Agent:** `frontend-specialist`
- **Skill:** `react-best-practices`
- **Priority:** P1
- **Input:** Router, Auth state, tất cả page components
- **Output:** `App.tsx` updated

```tsx
// Pattern:
// 1. Init Firebase auth listener (onAuthStateChanged)
// 2. Early return based on ?page param
// 3. Auth guard: redirect to /login nếu chưa auth và page cần auth
// 4. Default: render game flow (unchanged)
```

- **Verify:** 4 routes đều hoạt động, auth guard block đúng
- **Dependencies:** Task 6.1, tất cả page components

---

#### Task 6.3 — Firebase Hosting Config
- **Agent:** `frontend-specialist`
- **Skill:** `deployment-procedures`
- **Priority:** P3
- **Input:** Vite build output (`dist/`)
- **Output:** `firebase.json`, `.firebaserc`

```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

- **Verify:** `npm run build && firebase deploy` → app live trên Firebase Hosting URL
- **Dependencies:** Task 6.2

---

### 🟢 PHASE X — Verification

#### Automated Scripts
```bash
# P0: Lint + Type Check
npm run lint && npx tsc --noEmit

# P0: Security
python .agent/skills/vulnerability-scanner/scripts/security_scan.py .

# P1: UX Audit
python .agent/skills/frontend-design/scripts/ux_audit.py .

# P2: Build
npm run build

# P3: Deploy preview
firebase hosting:channel:deploy preview --expires 1d
```

#### Manual QA Checklist

**Auth Flow:**
- [ ] `/?page=login` → AuthPage hiện đúng
- [ ] Click "Đăng nhập Google" → popup Firebase → redirect dashboard
- [ ] `/?page=dashboard` khi chưa login → redirect về login
- [ ] Đăng xuất → về login page, user state cleared

**Creator Flow:**
- [ ] User 0 links → form điền → "Tạo link miễn phí" → link xuất hiện trong dashboard
- [ ] User 1+ links → "Tạo link mới — 19.999đ" → PayOS modal mở
- [ ] Copy link → paste tab mới → game load đúng tên
- [ ] ThemePicker → preview cập nhật real-time

**Dashboard Flow:**
- [ ] Link cards hiện đúng thông tin
- [ ] Copy link từ card → đúng URL
- [ ] Xoá link → confirm → biến mất khỏi list

**Payment Flow (Mock):**
- [ ] PayOS modal mở → QR VietQR hiện
- [ ] Nội dung chuyển khoản hiện đúng
- [ ] Mock confirm → link được tạo → modal đóng

**Security:**
- [ ] Firestore rules: user B không xoá được link của user A
- [ ] `.env.local` không commit lên git (.gitignore check)

**Design:**
- [ ] Mobile 375px → tất cả responsive
- [ ] Không có màu violet/purple trong UI chính
- [ ] Không dùng standard template layout

---

## 📊 Task Dependency Graph

```
PHASE 0:
  0.1 (npm install) → 0.2 (Firebase init)

PHASE 1 (Auth):
  0.2 → 1.1 (authService)
       → 1.2 (authStore)
       → [1.1 + 1.2] → 1.3 (useAuth hook)
                      → 1.4 (AuthPage)
                      → 1.5 (UserAvatar)

PHASE 2 (Firestore):
  0.2 → 2.1 (linksService)
       → [2.1 + 1.2] → 2.2 (useLinks hook)

PHASE 3 (Creator):
  3.1 (ThemePicker) → 3.2 (LinkPreview)
  [3.1 + 3.2 + 2.2] → 3.3 (CreatorPage)

PHASE 4 (Dashboard):
  2.2 → 4.1 (LinkCard) → 4.2 (DashboardPage)

PHASE 5 (Payment):
  [2.1 + 3.3] → 5.1 (PayOS Checkout Modal)
  0.2 → 5.2 (Firestore Rules) ← PARALLEL

PHASE 6 (Integration):
  6.1 (Router) → [6.1 + all pages] → 6.2 (App.tsx) → 6.3 (Firebase Hosting)
```

---

## ⚡ Parallel Execution Map

| Batch | Tasks (chạy song song) | Wait for |
|---|---|---|
| **Batch 1** | 0.1, 3.1 | Nothing |
| **Batch 2** | 0.2, 5.2 | Batch 1 |
| **Batch 3** | 1.1, 1.2, 2.1, 6.1 | Batch 2 |
| **Batch 4** | 1.3, 2.2, 3.2 | Batch 3 |
| **Batch 5** | 1.4, 1.5, 3.3, 4.1 | Batch 4 |
| **Batch 6** | 4.2, 5.1 | Batch 5 |
| **Batch 7** | 6.2 | Batch 6 |
| **Batch 8** | 6.3 | Batch 7 |

---

## 🚨 Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Firebase quota vượt free tier | Low | Medium | Free tier: 50k reads/day, 20k writes/day — đủ cho MVP |
| PayOS chưa có credentials | High | Medium | Mock flow VietQR tĩnh trước, điền credentials sau |
| CORS khi gọi PayOS API từ browser | High | High | Dùng PayOS direct payment link thay vì API call |
| User bypass free limit (clear localStorage) | N/A | N/A | Logic ở Firestore, không phụ thuộc localStorage |
| Google popup bị chặn (mobile) | Medium | Medium | Fallback signInWithRedirect() |
| Firestore writes race condition (2 tabs) | Low | Medium | Dùng Firestore transaction cho createLink |

---

## 📅 Estimated Timeline

| Phase | Tasks | Estimate |
|---|---|---|
| Phase 0 (Firebase setup) | 0.1 → 0.2 | ~15 phút |
| Phase 1 (Auth) | 1.1 → 1.5 | ~45 phút |
| Phase 2 (Firestore service) | 2.1 → 2.2 | ~20 phút |
| Phase 3 (Creator page) | 3.1 → 3.3 | ~40 phút |
| Phase 4 (Dashboard) | 4.1 → 4.2 | ~30 phút |
| Phase 5 (PayOS) | 5.1 → 5.2 | ~30 phút |
| Phase 6 (Integration + Deploy) | 6.1 → 6.3 | ~20 phút |
| Phase X (Verification) | Scripts + manual | ~20 phút |
| **Total** | **17 tasks** | **~3.5 giờ** |

---

## 🔑 Quick Reference

### Firebase Firestore Collections
```
users/{uid}     → user profile
links/{linkId}  → link data (public read, owner write)
```

### PayOS VietQR (No API key needed)
```
https://img.vietqr.io/image/{BANK_ID}-{ACCOUNT}-compact2.png
  ?amount=19999
  &addInfo=LOVETRAP+{uid_6chars}
  &accountName={YOUR_NAME}
```

### Routing Rules
```
/?page=login      → AuthPage (public)
/?page=create     → CreatorPage (auth required)
/?page=dashboard  → DashboardPage (auth required)
/?id=<encoded>    → Game flow (public, no change)
/                 → Game flow (public, no change)
```

---

*Plan v2.0 — Updated: 2026-04-08 | Firebase + PayOS Architecture*
*Approved decisions: Firebase Auth + Firestore, 1 free link forever, 19.999đ/link mới, Firebase Hosting*
