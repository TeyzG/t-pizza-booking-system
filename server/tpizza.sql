-- T'Pizza Database - SQL Sample Data
-- This SQL script initializes the tpizza database with sample data
-- Run this after Django migrations are complete

-- ============================================================
-- 1. ROLES
-- ============================================================
INSERT INTO roles (name, description) VALUES
('admin', 'Admin'),
('staff', 'Staff'),
('customer', 'Customer');

-- ============================================================
-- 2. USERS
-- ============================================================
-- Password: admin123 (hashed by Django)
INSERT INTO users (username, password, email, first_name, last_name, phone, role_id, is_active, is_staff, is_superuser, created_at, updated_at)
VALUES 
('admin', 'pbkdf2_sha256$600000$SomeRandomHashHere$SomeHashValueHere', 'admin@tpizza.com', 'Admin', 'User', '0908888888', 1, 1, 1, 1, NOW(), NOW()),
('staff_1', 'pbkdf2_sha256$600000$AnotherHashHere$AnotherHashValueHere', 'staff1@tpizza.com', 'Staff', 'One', '0909999999', 2, 1, 0, 0, NOW(), NOW()),
('staff_2', 'pbkdf2_sha256$600000$ThirdHashHere$ThirdHashValueHere', 'staff2@tpizza.com', 'Staff', 'Two', '0909999998', 2, 1, 0, 0, NOW(), NOW()),
('customer_1', 'pbkdf2_sha256$600000$FourthHashHere$FourthHashValueHere', 'customer1@email.com', 'Nguyễn', 'Anh', '0912345678', 3, 1, 0, 0, NOW(), NOW()),
('customer_2', 'pbkdf2_sha256$600000$FifthHashHere$FifthHashValueHere', 'customer2@email.com', 'Trần', 'Thanh Vân', '0987654321', 3, 1, 0, 0, NOW(), NOW()),
('customer_3', 'pbkdf2_sha256$600000$SixthHashHere$SixthHashValueHere', 'customer3@email.com', 'Phạm', 'Bảo', '0934567890', 3, 1, 0, 0, NOW(), NOW());

-- ============================================================
-- 3. PERMISSIONS
-- ============================================================
INSERT INTO permissions (role_id, permission) VALUES
-- Admin permissions (all)
(1, 'view_bookings'),
(1, 'create_booking'),
(1, 'edit_booking'),
(1, 'delete_booking'),
(1, 'view_branches'),
(1, 'manage_branches'),
(1, 'view_tables'),
(1, 'manage_tables'),
(1, 'manage_users'),
(1, 'view_statistics'),
-- Staff permissions
(2, 'view_bookings'),
(2, 'edit_booking'),
(2, 'view_branches'),
(2, 'view_tables'),
(2, 'manage_tables'),
(2, 'view_statistics'),
-- Customer permissions
(3, 'view_bookings'),
(3, 'create_booking'),
(3, 'edit_booking');

-- ============================================================
-- 4. BRANCHES (6 locations)
-- ============================================================
INSERT INTO branches (name, location, address, phone, email, description, image_url, rating, status, latitude, longitude, is_active, created_at, updated_at)
VALUES
-- Hồ Chí Minh - 2 branches
(
    "T'Pizza Hai Bà Trưng",
    'Hồ Chí Minh',
    '180 Hai Bà Trưng, Phường Đa Kao, Quận 1, TP. HCM',
    '028 3622 0500',
    'haibatro.tpizza@email.com',
    'Chi nhánh trung tâm cổ kính, trang nhã. Có quầy bar dài lãng mạn và hai lò nướng củi trung tâm rực lửa thích hợp cho gia đình hoặc hẹn hò.',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    4.8,
    'active',
    10.7828,
    106.6958,
    1,
    NOW(),
    NOW()
),
(
    "T'Pizza Võ Văn Tần",
    'Hồ Chí Minh',
    '31 Võ Văn Tần, Phường 6, Quận 3, TP. HCM',
    '028 3622 0501',
    'voivantan.tpizza@email.com',
    'Phong cách sân vườn biệt thự Đông Dương cũ. Không gian ngoài trời ngập tràn bóng mát cây xanh, mang đến bầu không khí thư thái tĩnh lặng.',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    4.9,
    'active',
    10.7785,
    106.6908,
    1,
    NOW(),
    NOW()
),
-- Hà Nội - 2 branches
(
    "T'Pizza Lý Quốc Sư",
    'Hà Nội',
    '2 Lý Quốc Sư, Hàng Trống, Hoàn Kiếm, Hà Nội',
    '024 3622 0502',
    'lyquocsu.tpizza@email.com',
    'Nằm ngay sát Nhà Thờ Lớn cổ kính. Không gian gác mái ấm cúng với gạch mộc và dầm gỗ tự nhiên mang đậm hơi thở Hà Nội xưa.',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    4.7,
    'active',
    21.0289,
    105.8488,
    1,
    NOW(),
    NOW()
),
(
    "T'Pizza Phan Chu Trinh",
    'Hà Nội',
    '43 Phan Chu Trinh, Hoàn Kiếm, Hà Nội',
    '024 3622 0503',
    'phanchutrihnh.tpizza@email.com',
    'Không gian mở 2 tầng rộng lớn, phong cách Tây Âu kết hợp tối giản Nhật Bản. Nơi lý tưởng để tổ chức các buổi tiệc đông người.',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    4.8,
    'busy',
    21.0215,
    105.8562,
    1,
    NOW(),
    NOW()
),
-- Đà Nẵng - 1 branch
(
    "T'Pizza Bạch Đằng",
    'Đà Nẵng',
    '214 Bạch Đằng, Phước Ninh, Hải Châu, Đà Nẵng',
    '0236 3622 0504',
    'bachdang.tpizza@email.com',
    'Ôm trọn tầm nhìn ra Sông Hàn và Cầu Rồng thơ mộng. Khu vực seating ngoài trời lộng gió thích hợp ngắm hoàng hôn và nhâm nhi bia thủ công.',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    4.9,
    'active',
    16.0664,
    108.2238,
    1,
    NOW(),
    NOW()
),
-- Hải Phòng - 1 branch
(
    "T'Pizza Điện Biên Phủ",
    'Hải Phòng',
    '15 Điện Biên Phủ, Máy Tơ, Ngô Quyền, Hải Phòng',
    '0225 3622 0505',
    'dienbienphu.tpizza@email.com',
    'Thiết kế cải tạo từ một nhà kho hải cảng cũ, kiến trúc thô mộc Industrial đầy cuốn hút kết hợp cây xanh dây leo độc đáo.',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    4.6,
    'active',
    20.8654,
    106.6892,
    1,
    NOW(),
    NOW()
);

-- ============================================================
-- 5. TABLES (for each branch)
-- ============================================================
-- Branch 1: Hai Bà Trưng (ID=1)
INSERT INTO tables (branch_id, table_number, capacity, zone, is_available, created_at, updated_at) VALUES
(1, '01', 2, 'indoor', 1, NOW(), NOW()),
(1, '02', 4, 'indoor', 1, NOW(), NOW()),
(1, '03', 6, 'indoor', 1, NOW(), NOW()),
(1, '04', 8, 'indoor', 1, NOW(), NOW()),
(1, '05', 10, 'indoor', 1, NOW(), NOW()),
(1, '06', 4, 'indoor', 0, NOW(), NOW()),
(1, '07', 2, 'outdoor', 1, NOW(), NOW()),
(1, '08', 4, 'outdoor', 1, NOW(), NOW()),
(1, '09', 6, 'outdoor', 1, NOW(), NOW()),
(1, '10', 8, 'outdoor', 0, NOW(), NOW()),
(1, '11', 4, 'mezzanine', 1, NOW(), NOW()),
(1, '12', 6, 'mezzanine', 1, NOW(), NOW()),
(1, '13', 2, 'kiln', 1, NOW(), NOW()),
(1, '14', 4, 'kiln', 1, NOW(), NOW()),
(1, '15', 6, 'kiln', 1, NOW(), NOW());

-- Branch 2: Võ Văn Tần (ID=2)
INSERT INTO tables (branch_id, table_number, capacity, zone, is_available, created_at, updated_at) VALUES
(2, '01', 2, 'indoor', 1, NOW(), NOW()),
(2, '02', 4, 'indoor', 1, NOW(), NOW()),
(2, '03', 6, 'indoor', 1, NOW(), NOW()),
(2, '04', 8, 'indoor', 1, NOW(), NOW()),
(2, '05', 10, 'indoor', 1, NOW(), NOW()),
(2, '06', 4, 'indoor', 1, NOW(), NOW()),
(2, '07', 2, 'outdoor', 1, NOW(), NOW()),
(2, '08', 4, 'outdoor', 1, NOW(), NOW()),
(2, '09', 6, 'outdoor', 1, NOW(), NOW()),
(2, '10', 8, 'outdoor', 1, NOW(), NOW()),
(2, '11', 4, 'mezzanine', 1, NOW(), NOW()),
(2, '12', 6, 'mezzanine', 1, NOW(), NOW()),
(2, '13', 2, 'kiln', 1, NOW(), NOW()),
(2, '14', 4, 'kiln', 1, NOW(), NOW()),
(2, '15', 6, 'kiln', 1, NOW(), NOW());

-- Branch 3: Lý Quốc Sư (ID=3)
INSERT INTO tables (branch_id, table_number, capacity, zone, is_available, created_at, updated_at) VALUES
(3, '01', 2, 'indoor', 1, NOW(), NOW()),
(3, '02', 4, 'indoor', 1, NOW(), NOW()),
(3, '03', 6, 'indoor', 1, NOW(), NOW()),
(3, '04', 8, 'indoor', 1, NOW(), NOW()),
(3, '05', 2, 'outdoor', 1, NOW(), NOW()),
(3, '06', 4, 'outdoor', 1, NOW(), NOW()),
(3, '07', 6, 'outdoor', 1, NOW(), NOW()),
(3, '08', 4, 'mezzanine', 1, NOW(), NOW()),
(3, '09', 6, 'mezzanine', 1, NOW(), NOW()),
(3, '10', 2, 'kiln', 1, NOW(), NOW()),
(3, '11', 4, 'kiln', 1, NOW(), NOW()),
(3, '12', 6, 'kiln', 1, NOW(), NOW()),
(3, '13', 8, 'kiln', 1, NOW(), NOW());

-- Branch 4: Phan Chu Trinh (ID=4)
INSERT INTO tables (branch_id, table_number, capacity, zone, is_available, created_at, updated_at) VALUES
(4, '01', 2, 'indoor', 1, NOW(), NOW()),
(4, '02', 4, 'indoor', 1, NOW(), NOW()),
(4, '03', 6, 'indoor', 1, NOW(), NOW()),
(4, '04', 8, 'indoor', 1, NOW(), NOW()),
(4, '05', 10, 'indoor', 1, NOW(), NOW()),
(4, '06', 2, 'outdoor', 1, NOW(), NOW()),
(4, '07', 4, 'outdoor', 1, NOW(), NOW()),
(4, '08', 6, 'outdoor', 1, NOW(), NOW()),
(4, '09', 4, 'mezzanine', 1, NOW(), NOW()),
(4, '10', 6, 'mezzanine', 1, NOW(), NOW()),
(4, '11', 2, 'kiln', 1, NOW(), NOW()),
(4, '12', 4, 'kiln', 1, NOW(), NOW());

-- Branch 5: Bạch Đằng (ID=5)
INSERT INTO tables (branch_id, table_number, capacity, zone, is_available, created_at, updated_at) VALUES
(5, '01', 2, 'indoor', 1, NOW(), NOW()),
(5, '02', 4, 'indoor', 1, NOW(), NOW()),
(5, '03', 6, 'indoor', 1, NOW(), NOW()),
(5, '04', 8, 'indoor', 1, NOW(), NOW()),
(5, '05', 2, 'outdoor', 1, NOW(), NOW()),
(5, '06', 4, 'outdoor', 1, NOW(), NOW()),
(5, '07', 6, 'outdoor', 1, NOW(), NOW()),
(5, '08', 10, 'outdoor', 1, NOW(), NOW()),
(5, '09', 4, 'mezzanine', 1, NOW(), NOW()),
(5, '10', 2, 'kiln', 1, NOW(), NOW());

-- Branch 6: Điện Biên Phủ (ID=6)
INSERT INTO tables (branch_id, table_number, capacity, zone, is_available, created_at, updated_at) VALUES
(6, '01', 2, 'indoor', 1, NOW(), NOW()),
(6, '02', 4, 'indoor', 1, NOW(), NOW()),
(6, '03', 6, 'indoor', 1, NOW(), NOW()),
(6, '04', 8, 'indoor', 1, NOW(), NOW()),
(6, '05', 2, 'outdoor', 1, NOW(), NOW()),
(6, '06', 4, 'outdoor', 1, NOW(), NOW()),
(6, '07', 6, 'mezzanine', 1, NOW(), NOW()),
(6, '08', 2, 'kiln', 1, NOW(), NOW());

-- ============================================================
-- 6. SAMPLE BOOKINGS
-- ============================================================
INSERT INTO bookings (
    booking_code, customer_id, branch_id, table_id,
    booking_date, booking_time,
    adult_count, children_count,
    zone_preference, special_requests, customer_notes,
    status, checked_in_at, created_at, updated_at
) VALUES
-- Today's bookings
(
    'TPZ001A2B', 4, 1, 1,
    '2026-06-12', '12:00',
    2, 0,
    'indoor', 'Sinh nhật', 'Bàn thoáng',
    'confirmed', NULL, NOW(), NOW()
),
(
    'TPZ002C3D', 5, 3, 9,
    '2026-06-12', '19:00',
    4, 1,
    'indoor', 'Gia đình', 'Tầng 1 nếu có thể',
    'confirmed', NULL, NOW(), NOW()
),
(
    'TPZ003E4F', 6, 2, 8,
    '2026-06-12', '19:30',
    2, 0,
    'outdoor', '', 'Ghế sùng để chiêm ngưỡng phong cảnh',
    'pending', NULL, NOW(), NOW()
),
-- Tomorrow's bookings
(
    'TPZ004G5H', 4, 4, 3,
    '2026-06-13', '11:45',
    6, 0,
    'mezzanine', 'Hội họp công ty', 'Cần không gian yên tĩnh',
    'confirmed', NULL, NOW(), NOW()
),
(
    'TPZ005I6J', 5, 5, 5,
    '2026-06-13', '18:00',
    3, 2,
    'outdoor', 'Gia đình', 'Ghế cho trẻ em',
    'confirmed', NULL, NOW(), NOW()
),
-- Future bookings
(
    'TPZ006K7L', 6, 1, 13,
    '2026-06-14', '19:00',
    2, 0,
    'kiln', 'Hẹn hò', 'Vị trí lãng mạn cạnh lò',
    'confirmed', NULL, NOW(), NOW()
),
(
    'TPZ007M8N', 4, 3, 6,
    '2026-06-15', '12:30',
    4, 2,
    'indoor', 'Sinh nhật trẻ em', 'Sắp xếp nến, bánh',
    'pending', NULL, NOW(), NOW()
),
(
    'TPZ008O9P', 5, 2, 2,
    '2026-06-16', '19:00',
    8, 0,
    'indoor', 'Tiệc công ty', 'Cần bàn lớn',
    'confirmed', NULL, NOW(), NOW()
),
(
    'TPZ009Q0R', 6, 4, 4,
    '2026-06-17', '18:30',
    3, 1,
    'mezzanine', '', 'Nhóm bạn, thoải mái',
    'confirmed', NULL, NOW(), NOW()
),
(
    'TPZ010S1T', 4, 5, 7,
    '2026-06-18', '19:30',
    2, 0,
    'outdoor', 'Kỷ niệm', 'Ghế thoải mái',
    'pending', NULL, NOW(), NOW()
);

-- ============================================================
-- 7. SAMPLE NOTIFICATIONS
-- ============================================================
INSERT INTO notifications (user_id, booking_id, notification_type, title, message, is_read, created_at) VALUES
(4, 1, 'booking_confirmed', 'Xác nhận đặt bàn', 'Đặt bàn TPZ001A2B tại T\'Pizza Hai Bà Trưng đã được xác nhận cho ngày 12/06/2026 lúc 12:00', 0, NOW()),
(5, 2, 'booking_confirmed', 'Xác nhận đặt bàn', 'Đặt bàn TPZ002C3D tại T\'Pizza Lý Quốc Sư đã được xác nhận cho ngày 12/06/2026 lúc 19:00', 1, NOW()),
(6, 3, 'booking_reminder', 'Nhắc nhở đặt bàn', 'Bạn có một đặt bàn tại T\'Pizza Võ Văn Tần hôm nay lúc 19:30', 0, NOW()),
(1, NULL, 'system', 'Thông báo hệ thống', 'Hệ thống T\'Pizza đã được cập nhật với tính năng mới', 1, NOW());

-- ============================================================
-- Summary Statistics
-- ============================================================
-- Total Branches: 6
-- Total Tables: 75+
-- Total Users: 6
-- Total Bookings: 10
-- Total Notifications: 4
-- ============================================================
