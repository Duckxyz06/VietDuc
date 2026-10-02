# Định dạng bảng lời chúc

Bảng `LoiChuc` (10 cột, gồm tiêu đề và các dòng lời chúc) dùng **Times New Roman, cỡ 14, căn giữa theo chiều ngang và chiều dọc, kẻ tất cả ô**. Mười cột A–J có chiều rộng bằng nhau (240 px); nội dung tự xuống dòng và chiều cao hàng tự điều chỉnh theo nội dung. Mỗi lần nhận lời chúc hợp lệ, mã tự áp dụng định dạng cho bảng. Các dữ liệu và chức năng trên website không thay đổi.

## Cập nhật Apps Script đang dùng

1. Thay nội dung `Code.gs` trong dự án Apps Script của bạn bằng mã mới trong thư mục này.
2. Giữ nguyên Script Properties `SPREADSHEET_ID` và `SITE_ORIGIN` đã cấu hình.
3. Để định dạng ngay các lời chúc hiện có, chọn hàm `formatWishesSheet` và bấm **Run / Chạy**. Cấp quyền Google khi được yêu cầu. Hàm chỉ định dạng bảng `LoiChuc`, không xóa hay thay nội dung các dòng.
4. Chọn **Deploy → Manage deployments → Edit → New version → Deploy** để bộ nhận lời chúc dùng mã mới. Cập nhật deployment hiện có để giữ nguyên URL đã kết nối với website.

Đẩy mã lên GitHub không tự cập nhật dự án Apps Script hay Google Sheets. Các bước trên cần thực hiện trong dự án Google của bạn.
