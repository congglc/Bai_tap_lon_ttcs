# Football Field Management System

Hệ thống quản lý sân bóng đá, cho phép người dùng đặt sân, quản lý lịch đặt và quản lý các sân bóng.

## Cấu trúc dự án

Dự án được chia thành hai phần chính:
- **Backend (BE)**: API server xây dựng bằng Node.js, Express và MongoDB
- **Frontend (FE)**: Giao diện người dùng xây dựng bằng React

## Yêu cầu hệ thống

- Node.js (v14 trở lên)
- MongoDB
- npm hoặc yarn

## Hướng dẫn cài đặt

### 1. Clone dự án từ GitHub

```bash
git clone https://github.com/your-username/Web-sanbong.git
cd Web-sanbong
```

### 2. Cài đặt và chạy Backend

```bash
# Di chuyển vào thư mục Backend
cd BE

# Cài đặt các dependencies
npm install
# chạy file seed.js để tạo dữ liệu ban đầu
node src/utils/seed.js

# Tạo file .env từ file .env.example
cp .env.example .env
```

Mở file `.env` và cấu hình các thông số:
```
# Server Configuration
PORT=8081
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=DB_sanbong

# JWT Configuration
JWT_SECRET=cbd3b7f4aa5b426dbe43a0a3df97a50b913c97de1ad81e55b042a36f85b1c1b9d63c7584d3f4db6fc63c2c6c90e875fbacbe3edbd5e59d3c774221e1d6d3f7cc

JWT_ACCESS_EXPIRATION_MINUTES=15
JWT_REFRESH_EXPIRATION_DAYS=7

FRONTEND_URL=http://localhost:3000
```

Khởi động server:
```bash
# Chạy ở chế độ development
npm run dev

# Hoặc chạy ở chế độ production
npm start
```

### 3. Cài đặt và chạy Frontend

```bash
# Di chuyển vào thư mục Frontend
cd ../FE/sbonglc

# Cài đặt các dependencies
npm install

# Tạo file .env nếu cần thiết
touch .env
```

Thêm vào file `.env` (nếu cần):
```
REACT_APP_API_URL=http://localhost:8081/api
```

Khởi động ứng dụng:
```bash
npm start
```

## Tài khoản mặc định

Sau khi khởi động backend, hệ thống sẽ tự động tạo các tài khoản mặc định:

1. **Admin** Vào trang quản trị với đường dẫn http://localhost:3000/quan-tri/dang-nhap
   - Email: admin@gmail.com
   - Password: admin123

2. **User**
   - Email: user@gmail.com
   - Password: user123

## Các tính năng chính

### Người dùng thông thường
- Đăng ký, đăng nhập
- Xem thông tin sân bóng
- Đặt sân bóng
- Quản lý lịch đặt sân của mình
- Thanh toán (qua mã QR)

### Admin
- Quản lý người dùng
- Quản lý sân bóng
- Quản lý đơn đặt sân
- Xem thống kê

## API Documentation

### Authentication
- `POST /api/auth/register` - Đăng ký người dùng mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất

### Users
- `GET /api/users` - Lấy danh sách người dùng
- `GET /api/users/:userId` - Lấy thông tin người dùng theo ID
- `POST /api/users` - Tạo người dùng mới
- `PUT /api/users/:userId` - Cập nhật thông tin người dùng
- `DELETE /api/users/:userId` - Xóa người dùng

### Fields
- `GET /api/fields` - Lấy danh sách sân bóng
- `GET /api/fields/:fieldId` - Lấy thông tin sân bóng theo ID
- `POST /api/fields` - Tạo sân bóng mới
- `PUT /api/fields/:fieldId` - Cập nhật thông tin sân bóng
- `DELETE /api/fields/:fieldId` - Xóa sân bóng

### Bookings
- `GET /api/bookings` - Lấy danh sách đơn đặt sân
- `GET /api/bookings/:bookingId` - Lấy thông tin đơn đặt sân theo ID
- `POST /api/bookings` - Tạo đơn đặt sân mới
- `PUT /api/bookings/:bookingId` - Cập nhật đơn đặt sân
- `DELETE /api/bookings/:bookingId` - Xóa đơn đặt sân

