# Viet Office

Văn phòng AI 3D tiếng Việt, xây bằng Three.js, Vite và Express. Giao diện và mô hình được tạo riêng bằng hình học, không dùng tài sản từ My Office.

## Chạy ứng dụng

Cần Node.js 22.12 trở lên (đã kiểm tra với Node 24).

```sh
npm ci
npm run dev
```

Máy chủ mặc định chỉ lắng nghe tại `127.0.0.1`, cổng `4310`. Chế độ demo hoạt động ngay, không cần tài khoản hay key. Kéo để xoay văn phòng; cuộn để thu phóng.

## Kết nối OpenAI

Sao chép `.env.example` thành `.env`, điền `OPENAI_API_KEY` trên máy chủ và khởi động lại ứng dụng. Không commit `.env` hoặc đưa key vào mã frontend. `OPENAI_MODEL` mặc định là `gpt-4.1-mini`; có thể chọn model tương thích Responses API mà tài khoản được phép dùng. Nếu dùng cloud proxy, giữ nguyên cấu hình proxy và CA của môi trường; cần cho phép đích `api.openai.com`.

Chọn **OpenAI thật** trước khi giao việc. API được tính phí riêng với gói ChatGPT. Chưa có key, ứng dụng hiển thị lỗi rõ ràng và không tự đổi sang kết quả mô phỏng.

## Kiểm tra

```sh
npm test
npm run build
# Trong terminal khác, để npm run dev tiếp tục chạy:
npx playwright install chromium
npm run test:e2e
```

Bản production: `npm run build`, sau đó `npm start`.

## Phạm vi phiên bản đầu

- Văn phòng 3D, một nhân vật Minh, góc nhìn xoay và bố cục responsive.
- Demo mô phỏng có nhãn rõ ràng; nhật ký, kết quả và sao chép văn bản.
- OpenAI Responses API chạy phía máy chủ, timeout và giới hạn hai yêu cầu đồng thời.
- Mỗi nhiệm vụ OpenAI là một yêu cầu độc lập. Chưa có bộ nhớ hội thoại.
- **Chưa tích hợp Codex:** không đọc/sửa tệp, không chạy test/lệnh, không tạo agent con. Hoạt ảnh biểu thị trạng thái ứng dụng, không phải telemetry công cụ.
- Nhật ký/kết quả chỉ nằm trong bộ nhớ trang và mất khi tải lại. Chưa có đăng nhập hay lưu lịch sử; không công khai máy chủ ra Internet trước khi bổ sung xác thực và giới hạn theo người dùng.

Mỗi cloud task đã có môi trường riêng. Dùng checkout hiện tại, không tạo Git worktree trừ khi người dùng yêu cầu.

## Bản demo web trên GitHub Pages

Workflow `.github/workflows/pages.yml` tự build và deploy khi đẩy lên `main`. Vào **Settings → Pages → Build and deployment → Source**, chọn **GitHub Actions** một lần. Mở tab **Actions**, chọn lần chạy **Publish demo to GitHub Pages** để xem kết quả và link deployment. GitHub Pages cần được hỗ trợ bởi gói tài khoản/quyền repository hiện tại.

`npm run build:demo` tạo bản tĩnh có đường dẫn asset tương đối, dùng được dưới thư mục repository. Bản này chỉ có demo: không gọi `/api`, không có API key và không hỗ trợ OpenAI thật. Cần hosting Node.js riêng để dùng backend OpenAI.

## Trải nghiệm v0.2

Văn phòng mở rộng gồm thư viện, studio, phòng máy, phòng họp và khu cà phê. Minh di chuyển theo các giai đoạn demo (khoảng 19 giây), rồi đến phòng họp bàn giao và nghỉ ngơi. An và Linh là nhân vật mô phỏng, không phải agent độc lập. Chạm nhân vật để xem hoạt động, chọn khu vực để chuyển góc nhìn, dùng Họp nhanh để tập trung mọi người, Buổi tối để đổi ánh sáng và Mở rộng để xem cả văn phòng. Escape thu gọn góc nhìn.

Các hoạt cảnh đọc/kiểm tra là mô phỏng; backend vẫn chỉ trả lời văn bản. Bản này ưu tiên trải nghiệm; chỉ kiểm tra build, chưa chạy lại bộ test giao diện/API cho v0.2.
