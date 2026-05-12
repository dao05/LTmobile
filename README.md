# Thiết kế app Quản lý phòng trọ Sanctuary

## 1. Giới thiệu project

Sanctuary là ứng dụng quản lý phòng trọ được xây dựng nhằm hỗ trợ chủ trọ và người quản lý trong việc quản lý thông tin phòng, khách thuê, hóa đơn, hợp đồng và người dùng.

Hệ thống giúp thay thế cách quản lý thủ công bằng sổ sách, hỗ trợ theo dõi dữ liệu nhanh chóng, trực quan và thuận tiện hơn. Người dùng có thể dễ dàng kiểm tra tình trạng phòng, số lượng khách thuê, hóa đơn chưa thanh toán, hợp đồng sắp hết hạn và doanh thu trong hệ thống.

Project được phát triển bằng React Native kết hợp Expo, có thể chạy trên trình duyệt web hoặc thiết bị di động thông qua Expo Go.

## 2. Các thành viên trong nhóm

- Tạ Thành Công - 23810310268
- Nguyễn Xuân Đạo - 23810310258
- Hoàng Lê Duẩn - 23810310256

## 3. Phân công nhiệm vụ cụ thể

- Tạ Thành Công: Phân tích và xây dựng các chức năng quản lý người thuê, hợp đồng; xử lý logic và chức năng báo cáo.
- Nguyễn Xuân Đạo: Xây dựng giao diện hệ thống, chức năng đăng nhập, đăng ký, quản lý phòng trọ, phân quyền và màn hình Home.
- Hoàng Lê Duẩn: Xây dựng chức năng hóa đơn, thông tin người dùng, thông báo đến người dùng và chức năng báo cáo.

## 4. Công nghệ sử dụng

- React Native: xây dựng giao diện mobile app.
- Expo: hỗ trợ chạy, build và export app React Native.
- JavaScript / React Hooks: xử lý logic bằng JavaScript, sử dụng useState, useEffect, useContext, useMemo.
- Context API: quản lý dữ liệu toàn app thông qua AuthContext và DataContext.
- React Navigation: điều hướng màn hình, gồm Stack Navigator và Bottom Tab Navigator.
- React Native Paper: thư viện UI component.
- Expo Vector Icons / MaterialCommunityIcons: sử dụng icon trong ứng dụng.
- AsyncStorage: lưu dữ liệu cục bộ trên thiết bị.
- Node.js HTTP Server: xây dựng API local trong server/file-server.js.
- JSON File Storage: lưu dữ liệu trong data/database.json.
- Fetch API: app gọi API local thông qua src/services/fileStorage.js.
- Axios: có sẵn trong src/services/api.js, hiện chủ yếu dùng làm service mẫu/mock.

## 5. Hướng dẫn cài đặt

## 5.1. Yêu cầu cài đặt

- Trước khi cài đặt project, máy cần có:
- Node.js bản LTS
- npm
- Git
- Visual Studio Code
- Expo Go trên điện thoại nếu chạy bằng thiết bị thật

- Kiểm tra Node.js, npm và Git bằng các lệnh:
- node -v
- npm -v
- git --version

## 5.2. Clone project từ GitHub

- Mở Terminal hoặc Command Prompt tại thư mục muốn lưu project.
- Chạy lệnh: git clone https://github.com/dao05/LTmobile.git
- Sau khi clone xong, truy cập vào thư mục project bằng lệnh: cd LTmobile

## 5.3. Cài đặt thư viện

- Chạy lệnh: npm install
- Lệnh này sẽ đọc file package.json và tải toàn bộ dependencies của project.

## 5.4. Chạy API local

- Project sử dụng API local để lưu dữ liệu vào file JSON.
- Mở Terminal thứ nhất và chạy lệnh: npm run api
- API sẽ chạy tại: http://localhost:3001
- Dữ liệu được lưu tại: data/database.json

## 5.5. Chạy ứng dụng

- Mở Terminal thứ hai trong cùng thư mục project.
- Chạy lệnh: npm start
- Sau khi Expo khởi động, có thể chọn:
- Nhấn w để chạy trên trình duyệt web.
- Quét mã QR bằng Expo Go để chạy trên điện thoại.
- Chạy trên Android Emulator nếu đã cài giả lập.

## 6. Tài khoản demo

## 6.1. Tài khoản Admin

- Email: admin@rental.com
- Mật khẩu: admin123

## 6.2. Tài khoản Manager

- Email: manager@rental.com
- Mật khẩu: manager123

## 7. Hình ảnh minh họa hệ thống

## 7.1. Giao diện đăng nhập, đăng ký

- Giao diện đăng nhập:

<img width="1170" height="2532" alt="Giao diện đăng nhập" src="https://github.com/user-attachments/assets/d7bbe9df-0e09-4f06-81a9-9b5100339a24" />

- Giao diện đăng ký:

<img width="1170" height="2532" alt="Giao diện đăng ký" src="https://github.com/user-attachments/assets/a0bac9e2-5763-4fcc-9597-18bb37bb496f" />

## 7.2. Giao diện trang chủ

- Giao diện trang chủ Admin:

<img width="1170" height="2532" alt="Trang chủ admin" src="https://github.com/user-attachments/assets/9c5b7d19-bd48-4151-b7be-1a37f99c0a52" />

- Giao diện trang chủ Manager:

<img width="1170" height="2532" alt="Trang chủ manager" src="https://github.com/user-attachments/assets/330afa55-5ede-4cdc-a20b-4787161d0e76" />

## 7.3. Giao diện thông báo

- Giao diện thông báo:

<img width="1170" height="2532" alt="Giao diện thông báo" src="https://github.com/user-attachments/assets/f6161f3c-f065-4189-9d92-b98c0a80fa00" />

## 7.4. Giao diện quản lý phòng

- Danh sách phòng:

<img width="1170" height="2532" alt="Danh sách phòng" src="https://github.com/user-attachments/assets/b70abd18-3a64-4787-9832-88e4c7d17cbd" />

- Thêm hoặc sửa phòng:

<img width="1170" height="2532" alt="Thêm hoặc sửa phòng" src="https://github.com/user-attachments/assets/f1807bf9-1615-4afd-82de-76546fb6f5ce" />

## 7.5. Giao diện quản lý khách thuê

- Danh sách khách thuê:

<img width="1170" height="2532" alt="Danh sách khách thuê" src="https://github.com/user-attachments/assets/77b971ab-3486-4791-aaaa-7508cd52244c" />

- Thêm hoặc sửa khách thuê:

<img width="1170" height="2532" alt="Thêm hoặc sửa khách thuê" src="https://github.com/user-attachments/assets/f89a337f-e4c6-4c76-8cb1-6e0b5010fa23" />

## 7.6. Giao diện quản lý hóa đơn

- Danh sách hóa đơn:

<img width="1170" height="2532" alt="Danh sách hóa đơn" src="https://github.com/user-attachments/assets/fe35067f-18b2-49a5-a53d-5aecf531ccdb" />

- Lập hóa đơn mới:

<img width="1170" height="2532" alt="Lập hóa đơn mới" src="https://github.com/user-attachments/assets/64e944ce-a562-4d15-8d73-9591427a4ec0" />

## 7.7. Giao diện quản lý hợp đồng

- Danh sách hợp đồng:

<img width="1170" height="2532" alt="Danh sách hợp đồng" src="https://github.com/user-attachments/assets/03bf9a34-d9d5-45d5-a49c-4216cd28e3eb" />

- Thêm hoặc sửa hợp đồng:

<img width="1170" height="2532" alt="Thêm hoặc sửa hợp đồng" src="https://github.com/user-attachments/assets/85b69def-1200-41e3-893e-59b69dcde1ad" />

## 7.8. Giao diện báo cáo

- Báo cáo doanh thu:

<img width="1170" height="2532" alt="Báo cáo doanh thu" src="https://github.com/user-attachments/assets/99070627-7a87-41b5-9c08-f9a4e3842926" />

- Báo cáo hệ thống:

<img width="1170" height="2532" alt="Báo cáo hệ thống" src="https://github.com/user-attachments/assets/552ac9f1-dde6-49ed-85af-2f2a6934b151" />

## 7.9. Giao diện phân quyền

- Phân quyền người dùng:

<img width="1170" height="2532" alt="Phân quyền người dùng" src="https://github.com/user-attachments/assets/27b0d501-74ea-4653-81b7-f06ed8ba6cd3" />

## 7.10. Giao diện người dùng

- Thông tin người dùng:

<img width="1170" height="2532" alt="Thông tin người dùng" src="https://github.com/user-attachments/assets/21187024-ca3d-4413-b50a-9d7fb9042842" />

- Cập nhật thông tin người dùng:

<img width="1170" height="2532" alt="Cập nhật thông tin người dùng" src="https://github.com/user-attachments/assets/d0df2e1d-4e52-4590-ad36-90142ed637cf" />

## 8. Link video demo

- Link video demo hệ thống: https://drive.google.com/drive/folders/1aFryKCt8QaQjGD7RUAKf6I72UQw29trC?usp=sharing
