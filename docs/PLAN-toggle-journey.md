# PLAN: Toggle Heart Journey Feature

> **Feature:** Thêm tùy chọn bật/tắt (Toggle) tính năng Heart Journey (các màn chơi sau khi bấm "Có").
> **Agent:** `project-planner`

---

## 🎯 Mục Tiêu
Cho phép người tạo link có quyền quyết định người nhận có phải chơi chuỗi Heart Journey sau khi bấm "VÂNG / CÓ" hay không. Tùy chọn `enableHeartJourney` sẽ được lưu, cấu hình trên modal Settings và mã hóa vào URL share link.

## 📋 Task Breakdown

### TASK 1: Update Data Model (Settings & Types)
- **`src/types/index.ts`**: Thêm `enableHeartJourney: boolean` vào interface `UserConfig`.
- **`src/store/useAppStore.ts`**: Đặt giá trị mặc định cho `enableHeartJourney` (mặc định: `true`).

### TASK 2: URL & Link Sharing
- **`src/features/settings/hooks/useShareLink.ts`** (hoặc nơi tạo link): Cập nhật logic để đọc thêm thuộc tính `journey` hoặc `enableJourney` vào URL (e.g. `&journey=1` hoặc `&journey=0`).
- **`src/hooks/useUrlParams.ts`**: Đọc param từ URL (e.g. `journey=0/1` hoặc `route=...`) và cập nhật vào `UserConfig` lúc ứng dụng khởi tạo.

### TASK 3: UI Toggles in Settings
- **`src/features/settings/SettingsModal.tsx`**: Thêm switch (toggle) cho thuộc tính "Cần vượt thử thách sau khi đồng ý" bên dưới danh sách tùy chọn (cùng với Autoplay Music).
- **`src/i18n/vi.ts` & `src/i18n/en.ts`**: Bổ sung text dịch cho phần cài đặt này (Ví dụ: `Thêm trò chơi sau khi CÓ` / `Include minigames after YES`).

### TASK 4: Routing Logic
- **`src/features/question/QuestionScreen.tsx`**: Tại nút YES, kiểm tra điều kiện:
  - Nếu `config.enableHeartJourney` === `true`: Chạy flow cũ (Sang màn `heart-journey`).
  - Nếu `config.enableHeartJourney` === `false`: Sang ngay màn `celebration`.

---
## ✅ Tiêu Chí Hoàn Thành
- Nút toggle phải hoạt động hoàn hảo trong màn cài đặt.
- Có chia sẻ được Link chứa param mới.
- Nếu tắt, click "Yes" đi thẳng tới màn chúc mừng y như luồng nguyên thuỷ.
