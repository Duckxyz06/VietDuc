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
2. **Add file → Upload files**, thả ảnh JPG/PNG/WebP/GIF/AVIF/TIFF/BMP/ICO/SVG/PSD/HEIC/HEIF rồi **Commit changes** vào main.
3. Chờ Actions xanh và tải lại web. Mọi ảnh trong thư mục và thư mục con sẽ tự có trong album, không phụ thuộc API GitHub hay giới hạn request. Bảy ảnh đầu xuất hiện quanh lâu đài để giữ nhẹ; toàn bộ ảnh xuất hiện ở bộ sưu tập. Không có giới hạn 7 ảnh trong album.

Tên ảnh trở thành tiêu đề. Ví dụ `Ngày_tốt_nghiệp.jpg` → `Ngày tốt nghiệp`. Không cần tự chỉnh chiều rộng hoặc chiều cao trước khi đăng. Web tạo bản hiển thị tối đa 2400 px và thumbnail 600 px, giữ tỉ lệ và xử lý xoay EXIF; ảnh gốc vẫn được giữ trong repo. Chỉ tải ảnh bạn muốn công khai vì repository và album là công khai. Ảnh được kiểm tra và tự tạo bản WebP tương thích trình duyệt. Bộ sưu tập có ảnh ngay sau khi bước Deploy thành công.

## Định dạng ảnh và kích thước

- Nhận diện nội dung file, kể cả ảnh không có đuôi hoặc đuôi bị đặt sai. JPEG/JFIF, PNG/APNG, WebP, GIF, AVIF, TIFF và SVG dùng Sharp. HEIC/HEIF dùng bộ giải mã HEIF; BMP/ICO/PSD và một số định dạng ảnh máy ảnh dùng ImageMagick. Khả năng mở các biến thể RAW/HEIF phụ thuộc codec; file mã hóa, bị hỏng hoặc biến thể chưa hỗ trợ sẽ có thông báo cụ thể, không thể đảm bảo mọi định dạng ảnh từng tồn tại. GIF động được xuất WebP động khi bộ giải mã hỗ trợ; ảnh nhiều trang/layer dùng trang hoặc lớp tổng hợp đầu tiên.
- Không đặt giới hạn chiều rộng, chiều cao hoặc dung lượng riêng trong mã nhập ảnh. Quá trình xử lý vẫn phụ thuộc RAM, thời gian và khả năng của bộ giải mã. Ảnh hiển thị tự co vừa tối đa 2400×2400, không méo; thumbnail vừa 600×600.
- **GitHub giới hạn 25 MiB/file khi Upload files qua trình duyệt, 100 MiB/file với Git thông thường.** Mã website không thay đổi giới hạn này. Với ảnh lớn hơn, chuẩn bị bản nhẹ trước khi đăng:

```bash
npm ci
npm run prepare-photos -- "C:\AnhGoc" "C:\AnhDeDang"
```

Sau đó tải các file `.webp` trong `AnhDeDang` lên `public/photos`. Trên Windows, nếu một định dạng cần ImageMagick, cài ImageMagick và đảm bảo lệnh `convert` của ImageMagick được dùng; cũng có thể chạy trong WSL. Ảnh gốc không bị chỉnh sửa. Bộ xử lý được kiểm thử với ảnh gốc trên 25 MiB.

- Một ảnh lỗi không chặn toàn bộ lần triển khai. Xem mục **ảnh chưa mở được** dưới thanh công cụ album hoặc báo cáo tại Actions → Summary. Con trỏ Git LFS chưa chứa bytes ảnh sẽ được báo riêng.
- Dấu đỏ/xám cạnh commit là trạng thái workflow, không đồng nghĩa ảnh chưa lên repo. Các lần cập nhật liên tiếp tự hủy lần chạy cũ; chờ lần mới nhất Deploy xanh rồi tải lại trang.

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
