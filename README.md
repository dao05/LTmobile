-Thiết kế app Quản lý phòng trọ Sanctuary-

1. Các thành viên trong nhóm:
Tạ Thành Công - 23810310268
Nguyễn Xuân Đạo - 23810310258
Hoàng Lê Duẩn - 23810310256

2. Phân công nhiệm vụ cụ thể:
Tạ Thành Công: Phân tích và xây dựng các chức năng quản lý người thuê, hợp đồng; xử lý logic, chức năng báo cáo
Nguyễn Xuân Đạo: Xây dựng giao diện hệ thống, chức năng đăng nhập, đăng ký và quản lý phòng trọ, chức năng phân quyền, màn hình Home
Hoàng Lê Duẩn: Xây dựng chức năng hóa đơn, thông tin người dùng, thông báo đến người dùng và chức năng báo cáo

3. Công nghệ sử dụng:
React Native: xây dựng giao diện mobile app.
Expo: chạy, build và export app React Native dễ hơn.
JavaScript / React Hooks: code logic bằng JS, dùng useState, useEffect, useContext, useMemo.
Context API: quản lý dữ liệu toàn app qua AuthContext và DataContext.
React Navigation: điều hướng màn hình, gồm Stack Navigator và Bottom Tab Navigator.
React Native Paper: thư viện UI component.
Expo Vector Icons / MaterialCommunityIcons: icon trong app.
AsyncStorage: lưu dữ liệu cục bộ trên thiết bị.
Node.js HTTP Server: API local trong server/file-server.js.
JSON File Storage: dữ liệu được lưu trong data/database.json.
Fetch API: app gọi API local qua src/services/fileStorage.js.
Axios: có sẵn trong src/services/api.js, nhưng hiện chủ yếu là service mẫu/mock.

4. Hướng dẫn cài đặt:
4.1. Yêu cầu cài đặt
Trước khi cài đặt project, máy cần có:
Node.js bản LTS
npm
Git
Visual Studio Code
Expo Go trên điện thoại nếu chạy bằng thiết bị thật
Kiểm tra Node.js, npm và Git:

node -v
npm -v
git --version

4.2. Clone project từ GitHub
Mở Terminal hoặc Command Prompt tại thư mục muốn lưu project, sau đó chạy:

git clone https://github.com/dao05/LTmobile.git

Sau khi clone xong, truy cập vào thư mục project:

cd LTmobile

4.3. Cài đặt thư viện
Chạy lệnh sau để cài đặt các thư viện cần thiết:

npm install

Lệnh này sẽ đọc file package.json và tải toàn bộ dependencies của project.

4.4. Chạy API local
Project sử dụng API local để lưu dữ liệu vào file JSON. Mở Terminal thứ nhất và chạy:

npm run api

API sẽ chạy tại:

http://localhost:3001

Dữ liệu được lưu tại:

data/database.json

4.5. Chạy ứng dụng
Mở Terminal thứ hai trong cùng thư mục project và chạy:

npm start

Sau khi Expo khởi động, có thể chọn:
Nhấn w để chạy trên trình duyệt web
Quét mã QR bằng Expo Go để chạy trên điện thoại
Chạy trên Android Emulator nếu đã cài giả lập

5. Tài khoản Demo:
5.1. Tài khoản admin :
   admin@rental.com
   admin123
5.2. Tài khoản manager:
   manager@rental.com
   manager123

6. Hình ảnh minh họa hệ thống:
6.1. Giao diện đăng nhập, đăng ký:
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/d7bbe9df-0e09-4f06-81a9-9b5100339a24" />
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/a0bac9e2-5763-4fcc-9597-18bb37bb496f" />
   
6.2. Giao diện trang chủ:
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/9c5b7d19-bd48-4151-b7be-1a37f99c0a52" />
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/330afa55-5ede-4cdc-a20b-4787161d0e76" />
   
6.3. Giao diện thông báo:
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/f6161f3c-f065-4189-9d92-b98c0a80fa00" />
6.4. Giao diện quản lý phòng:
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/b70abd18-3a64-4787-9832-88e4c7d17cbd" />
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/f1807bf9-1615-4afd-82de-76546fb6f5ce" />
   
6.5. Giao diện quản lý khách thuê:
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/77b971ab-3486-4791-aaaa-7508cd52244c" />
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/f89a337f-e4c6-4c76-8cb1-6e0b5010fa23" />
   
6.6. Giao diện quản lý hóa đơn:
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/fe35067f-18b2-49a5-a53d-5aecf531ccdb" />
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/64e944ce-a562-4d15-8d73-9591427a4ec0" />
   
6.7. Giao diện quản lý hợp đồng:
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/03bf9a34-d9d5-45d5-a49c-4216cd28e3eb" />
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/85b69def-1200-41e3-893e-59b69dcde1ad" />
   
6.8. Giao diện báo cáo:
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/99070627-7a87-41b5-9c08-f9a4e3842926" />
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/552ac9f1-dde6-49ed-85af-2f2a6934b151" />
   
6.9. Giao diện phân quyền:
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/27b0d501-74ea-4653-81b7-f06ed8ba6cd3" />
   
6.10. Giao diện người dùng:
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/21187024-ca3d-4413-b50a-9d7fb9042842" />
   <img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/d0df2e1d-4e52-4590-ad36-90142ed637cf" />

7. Link video Demo: https://drive.google.com/drive/folders/1aFryKCt8QaQjGD7RUAKf6I72UQw29trC?usp=sharing















