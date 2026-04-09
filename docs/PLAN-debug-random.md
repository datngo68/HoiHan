# PLAN: Debug & Fix Heart Journey Randomization

> **Feature:** Sửa lỗi màn hình "Cắm hoa" bị cố định, biến Heart Journey thành trải nghiệm ngẫu nhiên thực sự sử dụng toàn bộ pool 20+ game.

---

## 🔍 Phân tích nguyên nhân (Root Cause)
1. Trong bản thử nghiệm trước, tôi tạo ra 4 "Combo cố định" (Option C). Điều này dẫn đến sự trùng lặp (25% xác suất vào lại Combo 1).
2. Khi người dùng bấm "CÓ", hàm `useMemo` bên trong component `HeartJourneyScreen` chạy. Do cơ chế render của React/Vite (hot reload hoặc component re-mount nhanh), kết quả `Math.random()` có thể chạy vào Combo 1 liên tiếp hoặc state bị dính (stale state) trên môi trường phát triển cục bộ.
3. User muốn tận dụng triệt để "20 game bên phần thử thách" vào Heart Journey để không bị nghèo nàn màn chơi.

## 🛠️ Giải pháp & Kế hoạch (Fix Plan)

### Phá bỏ Combo Cố Định —> Random Từ Toàn Bộ Pool (True Random 3-Step)
Sử dụng chính nguồn tài nguyên dồi dào từ `challengeRegistry` thay vì 4 Combo cứng.

**TASK 1: Cập nhật `journeyData.ts`**
- Xóa mảng `themedJourneys` cũ (cố định).
- Viết lại hàm `getRandomJourney()`: Lấy ra toàn bộ danh sách ID của các minigame từ `challengeRegistry`, `xáo trộn (shuffle)` mảng này và cắt ra **đúng 3 game hoàn toàn ngẫu nhiên**.
- Có thể lọc bớt các màn chơi khó (Hard) để "Heart Journey" mang tính phần thưởng hơn là try-hard.

**TASK 2: Ràng buộc State vào Global Store để an toàn tuyệt đối**
- **`src/types/index.ts` & `src/store/useAppStore.ts`**: Thêm state `currentJourneySteps: JourneyStepDef[]` vào `useAppStore`.
- Tạo một action `generateRandomJourney()` trong store.
- **`QuestionScreen.tsx`**: Khi user bấm *YES*, chạy lệnh `generateRandomJourney()` ngay lập tức để khoá cứng mảng 3 game vào store.
- **`HeartJourneyScreen.tsx`**: Đọc `currentJourneySteps` trực tiếp từ store, dọn sạch `useMemo`. Cách này đảm bảo logic khởi tạo game bị tách hoàn toàn khỏi quá trình render UI, xóa bỏ 100% rủi ro "cố định màn cắm hoa" hay "stale component".

### Lợi ích cốt lõi
Sau cú fix này, mỗi lần nhấn nút "YES", bạn sẽ được cấp 3 trò chơi (như Cắm Hoa, Mad Libs, Xếp Hình, Trắc Nghiệm, v.v) bốc từ xấp 20 bài một cách **trung thực nhất**. Không bao giờ có chuyện bị kẹt ở màn cắm hoa nữa.
