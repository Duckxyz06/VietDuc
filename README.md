# Lâu đài kỷ niệm — Nguyễn Việt Đức

Web 3D thật bằng Three.js: đảo nổi, lâu đài, ánh sáng, cửa sổ, cây, cờ và khung ảnh. Kéo để xoay, cuộn để zoom, nút xoay để tham quan. Nhịp xuất hiện dùng spring của Remotion; hỗ trợ giảm chuyển động, điện thoại và SVG dự phòng khi thiết bị không có WebGL (vẫn xoay được lâu đài; ảnh hiển thị đầy đủ ở album, không làm texture quanh lâu đài trong chế độ SVG). Phong cách chuyển cảnh, vật thể ở trung tâm và ánh sáng lấy cảm hứng từ hai video Pinterest đã cung cấp; không sao chép nội dung video.

## Xem thử

Bản snapshot đã build ở nhánh `preview`: https://raw.githack.com/Duckxyz06/VietDuc/preview/index.html . Đây là bản xem thử qua CDN bên thứ ba, có thể có màn hình xác nhận trước khi mở. Ảnh mới trên main sẽ tự xuất hiện ở bản GitHub Pages sau khi bật Pages; nhánh preview là snapshot, không tự cập nhật khi bạn thêm ảnh.

## Đưa web lên mạng

1. Repo → **Settings → Pages → Source → GitHub Actions**.
2. Vào **Actions → Build and deploy the memory castle → Run workflow** nếu chưa chạy. Sau khi bước Deploy xanh, xem URL trong trang workflow hoặc Settings → Pages.
3. Địa chỉ Pages dự kiến: https://duckxyz06.github.io/VietDuc/ . URL chỉ hoạt động sau khi Pages được bật và deploy thành công.

## Đăng ảnh — không cần sửa code

1. Mở thư mục **public/photos** trên GitHub.
2. **Add file → Upload files**, thả ảnh JPG/PNG/WebP/AVIF/GIF rồi **Commit changes** vào main.
3. Chờ Actions xanh và tải lại web. Mọi ảnh trong thư mục và thư mục con sẽ tự có trong album, không phụ thuộc API GitHub hay giới hạn request. Bảy ảnh đầu xuất hiện quanh lâu đài để giữ nhẹ; toàn bộ ảnh xuất hiện ở bộ sưu tập. Không có giới hạn 7 ảnh trong album.

Tên ảnh trở thành tiêu đề. Ví dụ `Ngày_tốt_nghiệp.jpg` → `Ngày tốt nghiệp`. Khuyến nghị ảnh dưới 2 MB, chiều rộng khoảng 1600 px. Chỉ tải ảnh bạn muốn công khai vì repository và album là công khai. Hiện chưa có ảnh cá nhân: web hiển thị trạng thái album trống và vẫn cho viết lời chúc chung.

## Kết nối Google Sheets (làm một lần)

Hiện **chưa kết nối**: form không báo gửi thành công giả. Bản nháp được giữ trong trình duyệt người viết đến khi nhận được xác nhận thật. Không có tài khoản hay mật khẩu Google trong repo.

1. Tạo một Google Sheet riêng, đặt tên tùy thích. Không cần chia sẻ công khai Sheet.
2. Trong Sheet chọn **Extensions / Tiện ích mở rộng → Apps Script**.
3. Xóa mã mẫu, dán toàn bộ file [google-apps-script/Code.gs](google-apps-script/Code.gs), lưu.
4. Mở **Project Settings / Cài đặt dự án → Script properties / Thuộc tính tập lệnh → Add script property**:
   - `SPREADSHEET_ID`: phần ở giữa `/d/` và `/edit` trong link Sheet.
   - `SITE_ORIGIN`: `https://duckxyz06.github.io` (không thêm `/VietDuc/` hay dấu `/` cuối).
5. **Deploy / Triển khai → New deployment / Triển khai mới → Web app / Ứng dụng web**.
6. **Execute as / Thực thi với tư cách: Me / Tôi**; **Who has access / Ai có quyền truy cập: Anyone / Bất kỳ ai**. Bấm Deploy, cấp quyền cho chính dự án của bạn.
7. Sao chép URL kết thúc `/exec`. Mở `public/config.json` trên GitHub, sửa `appsScriptUrl` thành URL đó rồi commit. Không dùng URL `/dev`.
8. Khi web cập nhật, gửi thử một lời chúc. Kiểm tra form báo đã nhận **và** hàng mới trong tab `LoiChuc`. Nếu không có xác nhận, giữ bản nháp và kiểm tra Apps Script → Executions. Chưa thể xác minh trực tiếp với Sheet của bạn trước khi bạn triển khai endpoint.

Sheet lưu thời gian, mã gửi, tên, mã/tên ảnh, lời chúc, câu hỏi của chủ trang, câu trả lời và câu hỏi của khách. Dùng khóa để chống ghi đồng thời và mã gửi để tránh trùng khi thử lại. Nội dung có dấu bắt đầu công thức được lưu dạng văn bản. Hộp thư có honeypot chống bot cơ bản; endpoint công khai vẫn có thể nhận spam, cần thêm CAPTCHA/backend nếu quy mô lớn. Không trả dữ liệu lời chúc qua doGet.

Đổi câu hỏi và tên trong `public/config.json`. Nếu dùng tên miền khác, cập nhật `SITE_ORIGIN` trong Apps Script rồi triển khai phiên bản mới. Sau sửa Code.gs chọn **Manage deployments → Edit → New version → Deploy**.

## Chạy trên máy

```bash
npm ci
npm run dev
npm test
npm run build
npm run preview
```

`npm run build` tự tạo `public/photos.json` rồi build Vite, dùng đường dẫn tương đối để không lỗi assets khi chạy dưới `/VietDuc/`. Font Google có dự phòng Georgia/sans-serif. Không phụ thuộc Insta Website Builder vì dịch vụ đó tạo trang từ block/ảnh stock và không hỗ trợ đưa source tùy chỉnh cùng cơ chế GitHub/Sheets này.
