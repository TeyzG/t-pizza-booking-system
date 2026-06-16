-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2026 at 10:01 PM
-- Server version: 11.8.6-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tpizza`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 3, 'add_permission'),
(6, 'Can change permission', 3, 'change_permission'),
(7, 'Can delete permission', 3, 'delete_permission'),
(8, 'Can view permission', 3, 'view_permission'),
(9, 'Can add group', 2, 'add_group'),
(10, 'Can change group', 2, 'change_group'),
(11, 'Can delete group', 2, 'delete_group'),
(12, 'Can view group', 2, 'view_group'),
(13, 'Can add content type', 4, 'add_contenttype'),
(14, 'Can change content type', 4, 'change_contenttype'),
(15, 'Can delete content type', 4, 'delete_contenttype'),
(16, 'Can view content type', 4, 'view_contenttype'),
(17, 'Can add session', 5, 'add_session'),
(18, 'Can change session', 5, 'change_session'),
(19, 'Can delete session', 5, 'delete_session'),
(20, 'Can view session', 5, 'view_session'),
(21, 'Can add branch', 7, 'add_branch'),
(22, 'Can change branch', 7, 'change_branch'),
(23, 'Can delete branch', 7, 'delete_branch'),
(24, 'Can view branch', 7, 'view_branch'),
(25, 'Can add role', 13, 'add_role'),
(26, 'Can change role', 13, 'change_role'),
(27, 'Can delete role', 13, 'delete_role'),
(28, 'Can view role', 13, 'view_role'),
(29, 'Can add custom user', 10, 'add_customuser'),
(30, 'Can change custom user', 10, 'change_customuser'),
(31, 'Can delete custom user', 10, 'delete_customuser'),
(32, 'Can view custom user', 10, 'view_customuser'),
(33, 'Can add booking', 6, 'add_booking'),
(34, 'Can change booking', 6, 'change_booking'),
(35, 'Can delete booking', 6, 'delete_booking'),
(36, 'Can view booking', 6, 'view_booking'),
(37, 'Can add notification', 11, 'add_notification'),
(38, 'Can change notification', 11, 'change_notification'),
(39, 'Can delete notification', 11, 'delete_notification'),
(40, 'Can view notification', 11, 'view_notification'),
(41, 'Can add table', 14, 'add_table'),
(42, 'Can change table', 14, 'change_table'),
(43, 'Can delete table', 14, 'delete_table'),
(44, 'Can view table', 14, 'view_table'),
(45, 'Can add permission', 12, 'add_permission'),
(46, 'Can change permission', 12, 'change_permission'),
(47, 'Can delete permission', 12, 'delete_permission'),
(48, 'Can view permission', 12, 'view_permission'),
(49, 'Can add chat session', 9, 'add_chatsession'),
(50, 'Can change chat session', 9, 'change_chatsession'),
(51, 'Can delete chat session', 9, 'delete_chatsession'),
(52, 'Can view chat session', 9, 'view_chatsession'),
(53, 'Can add chat message', 8, 'add_chatmessage'),
(54, 'Can change chat message', 8, 'change_chatmessage'),
(55, 'Can delete chat message', 8, 'delete_chatmessage'),
(56, 'Can view chat message', 8, 'view_chatmessage'),
(57, 'Can add Danh mục thực đơn', 15, 'add_category'),
(58, 'Can change Danh mục thực đơn', 15, 'change_category'),
(59, 'Can delete Danh mục thực đơn', 15, 'delete_category'),
(60, 'Can view Danh mục thực đơn', 15, 'view_category'),
(61, 'Can add Món ăn', 16, 'add_menuitem'),
(62, 'Can change Món ăn', 16, 'change_menuitem'),
(63, 'Can delete Món ăn', 16, 'delete_menuitem'),
(64, 'Can view Món ăn', 16, 'view_menuitem');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) NOT NULL,
  `booking_code` varchar(20) NOT NULL,
  `booking_date` date NOT NULL,
  `booking_time` time(6) NOT NULL,
  `adult_count` int(11) NOT NULL,
  `children_count` int(11) NOT NULL,
  `zone_preference` varchar(20) NOT NULL,
  `special_requests` longtext NOT NULL,
  `customer_notes` longtext NOT NULL,
  `status` varchar(20) NOT NULL,
  `checked_in_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `customer_id` bigint(20) NOT NULL,
  `branch_id` bigint(20) NOT NULL,
  `table_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `booking_code`, `booking_date`, `booking_time`, `adult_count`, `children_count`, `zone_preference`, `special_requests`, `customer_notes`, `status`, `checked_in_at`, `created_at`, `updated_at`, `customer_id`, `branch_id`, `table_id`) VALUES
(1, 'TPZ001A2B', '2026-06-16', '12:00:00.000000', 2, 0, 'indoor', 'Sinh nhật', 'Bàn yên tĩnh', 'confirmed', NULL, '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 4, 1, 1),
(2, 'TPZ002C3D', '2026-06-16', '19:00:00.000000', 4, 1, 'indoor', 'Gia đình', 'Tầng 1 nếu có', 'confirmed', NULL, '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 5, 3, 9),
(3, 'TPZ003E4F', '2026-06-16', '19:30:00.000000', 2, 0, 'outdoor', '', 'Ghế ngoài trời', 'pending', NULL, '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 6, 2, 8),
(4, 'TPZ004G5H', '2026-06-17', '11:45:00.000000', 6, 0, 'mezzanine', 'Hội họp công ty', 'Cần không gian yên tĩnh', 'confirmed', NULL, '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 4, 4, 3),
(6, 'TPZ006K7L', '2026-06-18', '19:00:00.000000', 2, 0, 'kiln', 'Hẹn hò', 'Vị trí cạnh lò lãng mạn', 'confirmed', NULL, '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 6, 1, 13),
(7, 'TPZ007M8N', '2026-06-19', '12:30:00.000000', 4, 2, 'indoor', 'Sinh nhật trẻ em', 'Sắp xếp nến, bánh', 'confirmed', NULL, '2026-06-16 20:12:21.000000', '2026-06-16 13:36:36.303186', 4, 3, 6),
(8, 'TPZ008O9P', '2026-06-20', '19:00:00.000000', 8, 0, 'indoor', 'Tiệc công ty', 'Cần bàn lớn', 'confirmed', NULL, '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 5, 2, 2),
(9, 'TPZ009Q0R', '2026-06-21', '18:30:00.000000', 3, 1, 'mezzanine', '', 'Nhóm bạn', 'confirmed', NULL, '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 6, 4, 4),
(10, 'TPZ010S1T', '2026-06-22', '19:30:00.000000', 2, 0, 'outdoor', 'Kỷ niệm', 'Ghế thoải mái', 'checked_in', '2026-06-16 13:19:01.309601', '2026-06-16 20:12:21.000000', '2026-06-16 13:19:01.309601', 4, 5, 7),
(11, 'TPZ011U2V', '2026-06-14', '12:00:00.000000', 4, 0, 'indoor', '', '', 'checked_in', '2026-06-14 20:12:21.000000', '2026-06-14 20:12:21.000000', '2026-06-14 20:12:21.000000', 5, 1, 2),
(12, 'TPZ012W3X', '2026-06-15', '18:30:00.000000', 2, 0, 'kiln', '', '', 'cancelled', NULL, '2026-06-15 20:12:21.000000', '2026-06-15 20:12:21.000000', 6, 3, 10),
(13, 'TPZEB8A3135', '2026-06-20', '17:00:00.000000', 2, 0, 'outdoor', 'SINH NHAT', 'OK', 'checked_in', '2026-06-16 13:35:31.123469', '2026-06-16 13:33:07.924994', '2026-06-16 13:35:31.123469', 2, 5, NULL),
(14, 'TPZ9082A8FD', '2026-06-20', '21:30:00.000000', 2, 0, 'indoor', 'test', 'test', 'checked_in', '2026-06-16 13:35:11.291310', '2026-06-16 13:33:37.849653', '2026-06-16 13:35:11.291310', 2, 5, NULL),
(15, 'TPZ544AEA68', '2026-06-17', '13:00:00.000000', 2, 0, 'kiln', '', '', 'confirmed', NULL, '2026-06-16 13:35:47.673965', '2026-06-16 13:36:38.108292', 2, 3, NULL),
(16, 'TPZ54A6E84B', '2026-06-19', '20:30:00.000000', 2, 0, 'kiln', '', 'dat cho khach', 'checked_in', '2026-06-16 15:00:09.595322', '2026-06-16 14:18:22.358043', '2026-06-16 15:00:09.595322', 2, 5, NULL),
(17, 'TPZAA5DC876', '2026-06-18', '12:00:00.000000', 2, 0, 'kiln', '', '', 'checked_in', '2026-06-16 15:00:08.261144', '2026-06-16 14:33:08.528023', '2026-06-16 15:00:08.261144', 4, 5, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` bigint(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  `location` varchar(100) NOT NULL,
  `address` longtext NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(254) NOT NULL,
  `description` longtext NOT NULL,
  `image_url` varchar(200) NOT NULL,
  `rating` decimal(3,1) NOT NULL,
  `status` varchar(20) NOT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `location`, `address`, `phone`, `email`, `description`, `image_url`, `rating`, `status`, `latitude`, `longitude`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'T\'Pizza Hai Bà Trưng', 'Hồ Chí Minh', '180 Hai Bà Trưng, Phường Đa Kao, Quận 1, TP. HCM', '028 3622 0500', 'haibatrung@tpizza.com', 'Chi nhánh trung tâm cổ kính, trang nhã. Có quầy bar dài lãng mạn và hai lò nướng củi trung tâm rực lửa.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', 4.8, 'active', 10.782800, 106.695800, 1, '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000'),
(2, 'T\'Pizza Võ Văn Tần', 'Hồ Chí Minh', '31 Võ Văn Tần, Phường 6, Quận 3, TP. HCM', '028 3622 0501', 'vovantan@tpizza.com', 'Phong cách sân vườn biệt thự Đông Dương cũ. Không gian ngoài trời ngập tràn bóng mát cây xanh.', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', 4.9, 'active', 10.778500, 106.690800, 1, '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000'),
(3, 'T\'Pizza Lý Quốc Sư', 'Hà Nội', '2 Lý Quốc Sư, Hàng Trống, Hoàn Kiếm, Hà Nội', '024 3622 0502', 'lyquocsu@tpizza.com', 'Nằm ngay sát Nhà Thờ Lớn cổ kính. Không gian gác mái ấm cúng với gạch mộc và dầm gỗ tự nhiên.', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80', 4.7, 'active', 21.028900, 105.848800, 1, '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000'),
(4, 'T\'Pizza Phan Chu Trinh', 'Hà Nội', '43 Phan Chu Trinh, Hoàn Kiếm, Hà Nội', '024 3622 0503', 'phanchutrinh@tpizza.com', 'Không gian mở 2 tầng rộng lớn, phong cách Tây Âu kết hợp tối giản Nhật Bản.', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80', 4.8, 'busy', 21.021500, 105.856200, 1, '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000'),
(5, 'T\'Pizza Bạch Đằng', 'Đà Nẵng', '214 Bạch Đằng, Phước Ninh, Hải Châu, Đà Nẵng', '0236 3622 0504', 'bachdang@tpizza.com', 'Ôm trọn tầm nhìn ra Sông Hàn và Cầu Rồng thơ mộng. Khu vực seating ngoài trời lộng gió.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', 4.9, 'active', 16.066400, 108.223800, 1, '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000'),
(6, 'T\'Pizza Điện Biên Phủ', 'Hải Phòng', '15 Điện Biên Phủ, Máy Tơ, Ngô Quyền, Hải Phòng', '0225 3622 0505', 'dienbienphu@tpizza.com', 'Thiết kế cải tạo từ một nhà kho hải cảng cũ, kiến trúc thô mộc Industrial đầy cuốn hút.', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', 4.6, 'active', 20.865400, 106.689200, 1, '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint(20) NOT NULL,
  `role` varchar(20) NOT NULL,
  `content` longtext NOT NULL,
  `intent` varchar(100) NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`metadata`)),
  `created_at` datetime(6) NOT NULL,
  `session_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `role`, `content`, `intent`, `metadata`, `created_at`, `session_id`) VALUES
(1, 'user', 'Chào bạn', 'greeting', '{}', '2026-06-15 20:12:21.000000', 1),
(2, 'assistant', 'Chào bạn! 🖐️ Tôi là trợ lý T\'Pizza. Tôi có thể giúp gì cho bạn?', 'greeting', '{}', '2026-06-15 20:12:21.000000', 1),
(3, 'user', 'Cho tôi xem thực đơn', 'menu', '{}', '2026-06-15 20:12:21.000000', 1),
(4, 'assistant', '🍕 **Thực đơn T\'Pizza gợi ý:**\n\n• Pizza lò củi: Margherita, Prosciutto, Burrata\n• Mỳ Ý: Spaghetti Carbonara\n• Đồ uống: Bia thủ công, Vang Ý', 'menu', '{}', '2026-06-15 20:12:21.000000', 1),
(5, 'user', 'Tôi muốn đặt bàn trong nhà ở chi nhánh Đà Nẵng vào 7h ngày mai', '', '{}', '2026-06-16 13:37:19.623999', 2),
(6, 'assistant', 'Để đặt bàn tại T\'Pizza, bạn vui lòng:\n\n1️⃣ Vào tab **Đặt bàn ăn** trên thanh menu\n2️⃣ Chọn chi nhánh, ngày giờ, số lượng khách\n3️⃣ Xác nhận thông tin và gửi yêu cầu\n\nSau khi đặt, admin sẽ xác nhận và xếp bàn cho bạn. ⏳', 'booking', '{}', '2026-06-16 13:37:19.624237', 2),
(7, 'user', 'Chi nhánh Đà Nẵng ngày mai còn bàn không', '', '{}', '2026-06-16 13:37:32.349802', 2),
(8, 'assistant', '📍 **Hệ thống T\'Pizza gồm 6 chi nhánh:**\n\n• 🏙 **Hồ Chí Minh:**\n  - Hai Bà Trưng (Q.1)\n  - Võ Văn Tần (Q.3)\n• 🏙 **Hà Nội:**\n  - Lý Quốc Sư (Hoàn Kiếm)\n  - Phan Chu Trinh (Hoàn Kiếm)\n• 🏙 **Đà Nẵng:** Bạch Đằng\n• 🏙 **Hải Phòng:** Điện Biên Phủ\n\n⏰ Mở cửa: 11:00 - 22:00', 'branch', '{}', '2026-06-16 13:37:32.357010', 2),
(9, 'user', 'Giúp tôi check 7h tối ngày mai đà nẵng còn bàn không', '', '{}', '2026-06-16 13:37:57.022590', 2),
(10, 'assistant', 'Bạn muốn kiểm tra đặt bàn?\n\n📞 Gọi 028 3622 0500 và cung cấp mã booking.\nHoặc nếu bạn là admin, vào tab Quản trị viên.', 'check_status', '{}', '2026-06-16 13:37:57.026765', 2),
(11, 'user', 'Cảm ơn bạn', '', '{}', '2026-06-16 13:38:16.902997', 2),
(12, 'assistant', 'Không có gì! 😊 Nếu cần thêm, cứ hỏi tôi nhé. Chúc bạn ngon miệng! 🍕🎉', 'thanks', '{}', '2026-06-16 13:38:16.908553', 2),
(13, 'user', 'chào bạn', '', '{}', '2026-06-16 19:47:20.025906', 3),
(14, 'user', 'tôi có đang có bàn nào đang đặt không', '', '{}', '2026-06-16 19:47:27.233319', 3),
(15, 'user', 'kiểm tra', '', '{}', '2026-06-16 19:47:39.412797', 3),
(16, 'user', 'TPZ007M8N', '', '{}', '2026-06-16 19:47:56.443941', 3),
(17, 'user', 'mã đặt bàn của tôi là TPZ007M8N', '', '{}', '2026-06-16 19:48:01.798527', 3);

-- --------------------------------------------------------

--
-- Table structure for table `chat_sessions`
--

CREATE TABLE `chat_sessions` (
  `id` bigint(20) NOT NULL,
  `session_id` varchar(100) NOT NULL,
  `context_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`context_data`)),
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `branch_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_sessions`
--

INSERT INTO `chat_sessions` (`id`, `session_id`, `context_data`, `is_active`, `created_at`, `updated_at`, `branch_id`, `user_id`) VALUES
(1, 'demo_session_001', '{\"last_intent\":\"menu\",\"message_count\":4}', 0, '2026-06-15 20:12:21.000000', '2026-06-15 20:12:21.000000', 1, 4),
(2, 'session_1781616988273_fq53gi', '{\"last_intent\": \"thanks\", \"message_count\": 4}', 1, '2026-06-16 13:37:19.617159', '2026-06-16 13:37:19.617159', NULL, 1),
(3, 'session_1781639237045_d9kh5q', '{}', 1, '2026-06-16 19:47:20.024738', '2026-06-16 19:47:20.024738', NULL, 4);

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_admin_log`
--

INSERT INTO `django_admin_log` (`id`, `action_time`, `object_id`, `object_repr`, `action_flag`, `change_message`, `content_type_id`, `user_id`) VALUES
(1, '2026-06-16 13:34:19.265574', '2', 'staff_1 (Staff)', 2, '[{\"changed\": {\"fields\": [\"Branch\"]}}]', 10, 1),
(2, '2026-06-16 13:34:26.748682', '3', 'staff_2 (Staff)', 2, '[{\"changed\": {\"fields\": [\"Branch\"]}}]', 10, 1),
(3, '2026-06-16 13:34:35.788391', '1', 'admin (Admin)', 2, '[]', 10, 1),
(4, '2026-06-16 13:34:40.844155', '7', 'admin1 (Admin)', 2, '[{\"changed\": {\"fields\": [\"Role\"]}}]', 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(2, 'auth', 'group'),
(3, 'auth', 'permission'),
(4, 'contenttypes', 'contenttype'),
(6, 'core', 'booking'),
(7, 'core', 'branch'),
(15, 'core', 'category'),
(8, 'core', 'chatmessage'),
(9, 'core', 'chatsession'),
(10, 'core', 'customuser'),
(16, 'core', 'menuitem'),
(11, 'core', 'notification'),
(12, 'core', 'permission'),
(13, 'core', 'role'),
(14, 'core', 'table'),
(5, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2026-06-16 13:12:11.348344'),
(2, 'contenttypes', '0002_remove_content_type_name', '2026-06-16 13:12:11.513903'),
(3, 'auth', '0001_initial', '2026-06-16 13:12:11.969668'),
(4, 'auth', '0002_alter_permission_name_max_length', '2026-06-16 13:12:11.992758'),
(5, 'auth', '0003_alter_user_email_max_length', '2026-06-16 13:12:11.995187'),
(6, 'auth', '0004_alter_user_username_opts', '2026-06-16 13:12:11.998437'),
(7, 'auth', '0005_alter_user_last_login_null', '2026-06-16 13:12:12.004106'),
(8, 'auth', '0006_require_contenttypes_0002', '2026-06-16 13:12:12.005105'),
(9, 'auth', '0007_alter_validators_add_error_messages', '2026-06-16 13:12:12.008941'),
(10, 'auth', '0008_alter_user_username_max_length', '2026-06-16 13:12:12.009919'),
(11, 'auth', '0009_alter_user_last_name_max_length', '2026-06-16 13:12:12.015403'),
(12, 'auth', '0010_alter_group_name_max_length', '2026-06-16 13:12:12.030449'),
(13, 'auth', '0011_update_proxy_permissions', '2026-06-16 13:12:12.033664'),
(14, 'auth', '0012_alter_user_first_name_max_length', '2026-06-16 13:12:12.037303'),
(15, 'core', '0001_initial', '2026-06-16 13:12:12.518758'),
(16, 'admin', '0001_initial', '2026-06-16 13:12:12.580238'),
(17, 'admin', '0002_logentry_remove_auto_add', '2026-06-16 13:12:12.580238'),
(18, 'admin', '0003_logentry_add_action_flag_choices', '2026-06-16 13:12:12.593063'),
(19, 'core', '0002_chatsession_chatmessage', '2026-06-16 13:12:12.685119'),
(20, 'sessions', '0001_initial', '2026-06-16 13:12:12.721283'),
(21, 'core', '0003_customuser_branch', '2026-06-16 13:28:01.925361'),
(22, 'core', '0004_category_alter_notification_notification_type_and_more', '2026-06-16 19:58:20.400973');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('5qn75udj0aekeed8s6a45w1gnn96v2i1', '.eJxVjEEOwiAQRe_C2pApHSm4dN8zEJgZpGpoUtqV8e7apAvd_vfef6kQt7WErckSJlYX1anT75YiPaTugO-x3mZNc12XKeld0QdtepxZntfD_TsosZVvnZHAISQXMxlKKRv2kmE4MznvAYSh7_NgHbjsEEmsdIY8JgEEjFa9PwBWODQ:1wZTgX:wYhcPKq_fnuVqgFtzSwPc5rx6I6iKE3oVM0yhNbrlXw', '2026-06-30 13:18:33.880680');

-- --------------------------------------------------------

--
-- Table structure for table `menu_categories`
--

CREATE TABLE `menu_categories` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  `order` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_categories`
--

INSERT INTO `menu_categories` (`id`, `name`, `description`, `order`, `is_active`) VALUES
(1, 'Pizza Lò Củi Đặc Trưng', '', 1, 1),
(2, 'Mỳ Ý & Risotto', '', 2, 1),
(3, 'Khai Vị & Salad', '', 3, 1),
(4, 'Tráng Miệng', '', 4, 1),
(5, 'Đồ Uống', '', 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` bigint(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `image_url` varchar(200) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL,
  `is_special` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `category_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `name`, `description`, `price`, `image_url`, `is_available`, `is_special`, `created_at`, `updated_at`, `category_id`) VALUES
(1, 'Pizza Burrata', 'Phô mai Burrata tươi, cà chua San Marzano, lá basil', 280000, 'https://images.unsplash.com/photo-1628840042761-356cda0f02d9?auto=format&fit=crop&w=400&q=80', 1, 1, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 1),
(2, 'Pizza Prosciutto e Funghi', 'Thịt đùi heo muối Prosciutto, nấm tươi, phô mai Mozzarella', 265000, 'https://images.unsplash.com/photo-1590947132387-d9053817700a?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 1),
(3, 'Pizza Margherita DOC', 'Cà chua San Marzano, Mozzarella di Bufala, lá basil tươi', 240000, 'https://images.unsplash.com/photo-1574126154517-d1e0d89ef098?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 1),
(4, 'Pizza Bốn Mùa (Quattro Stagioni)', 'Bốn loại topping khác nhau tượng trưng 4 mùa', 270000, 'https://images.unsplash.com/photo-1594007654729-407edc192ba0?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 1),
(5, 'Pizza Hải Sản (Frutti di Mare)', 'Hải sản tươi sống, sốt cà chua, olive', 320000, 'https://images.unsplash.com/photo-1579751626657-c3a23f22960f?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 1),
(6, 'Spaghetti Carbonara', 'Trứng, thịt xông khói Pancetta, phô mai Pecorino Romano', 185000, 'https://images.unsplash.com/photo-1588013279120-f155106277c0?auto=format&fit=crop&w=400&q=80', 1, 1, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 2),
(7, 'Tagliatelle Bolognese', 'Sốt thịt bò hầm truyền thống, mỳ dẹt tươi', 195000, 'https://images.unsplash.com/photo-1563612116625-30123f730e83?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 2),
(8, 'Linguine Vongole', 'Nghêu tươi, tỏi, ớt, rượu vang trắng', 210000, 'https://images.unsplash.com/photo-1551185611-3c582736111f?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 2),
(9, 'Risotto Nấm Truffle', 'Gạo Arborio, nấm Truffle đen, phô mai Parmesan', 290000, 'https://images.unsplash.com/photo-1598512752316-f52556f18357?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 2),
(10, 'Salad Burrata & Cà Chua', 'Phô mai Burrata, cà chua bi, dầu olive', 160000, 'https://images.unsplash.com/photo-1512621776951-a5739df2af8a?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 3),
(11, 'Bruschetta Trio', 'Ba loại Bruschetta khác nhau: cà chua, nấm, patê', 120000, 'https://images.unsplash.com/photo-1571772928015-731ff901137c?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 3),
(12, 'Calamari Fritti', 'Mực ống chiên giòn kiểu Ý', 145000, 'https://images.unsplash.com/photo-1580959375944-abd7e991f971?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 3),
(13, 'Súp Bí Đỏ & Hạt Bí', 'Súp kem bí đỏ tươi, hạt bí rang', 100000, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 3),
(14, 'Tiramisu Cổ Điển', 'Bánh ladyfinger, cà phê, kem mascarpone', 95000, 'https://images.unsplash.com/photo-1571223311616-fd2703e2070f?auto=format&fit=crop&w=400&q=80', 1, 1, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 4),
(15, 'Panna Cotta Dâu Rừng', 'Panna Cotta mềm mịn, sốt dâu rừng tươi', 85000, 'https://images.unsplash.com/photo-1584983050165-05574972551a?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 4),
(16, 'Gelato Ý (các vị)', 'Kem Ý thủ công, nhiều hương vị để lựa chọn', 70000, 'https://images.unsplash.com/photo-1570197258321-b0e6b5d2c1d8?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 4),
(17, 'Bia Thủ Công T\'Pizza', 'Độc quyền T\'Pizza (Pale Ale, IPA)', 80000, 'https://images.unsplash.com/photo-1543007633-28952458421c?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 5),
(18, 'Vang Ý (Ly/Chai)', 'Tuyển chọn các dòng vang đỏ/trắng Ý', 120000, 'https://images.unsplash.com/photo-1551791866-f5611445778a?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 5),
(19, 'Nước Ép Tươi', 'Cam, táo, dưa hấu, dứa', 65000, 'https://images.unsplash.com/photo-1506804892097-402120092e8a?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 5),
(20, 'Cà Phê Ý', 'Espresso, Cappuccino, Latte', 50000, 'https://images.unsplash.com/photo-1517256064527-09c1db3243af?auto=format&fit=crop&w=400&q=80', 1, 0, '2026-06-17 02:59:31.000000', '2026-06-17 02:59:31.000000', 5);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL,
  `notification_type` varchar(50) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` longtext NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `booking_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `notification_type`, `title`, `message`, `is_read`, `created_at`, `booking_id`, `user_id`) VALUES
(1, 'booking_confirmed', 'Đặt bàn mới từ customer_1', 'Khách hàng Nguyễn Minh Anh đặt bàn tại T\'Pizza Hai Bà Trưng ngày hôm nay lúc 12:00', 0, '2026-06-16 20:12:21.000000', 1, 1),
(2, 'booking_confirmed', 'Đặt bàn mới từ customer_2', 'Khách hàng Trần Thanh Vân đặt bàn tại T\'Pizza Lý Quốc Sư hôm nay lúc 19:00', 0, '2026-06-16 20:12:21.000000', 2, 1),
(3, 'booking_reminder', 'Đặt bàn chờ xác nhận', 'Có 1 đặt bàn mới cần xác nhận tại T\'Pizza Võ Văn Tần', 0, '2026-06-16 20:12:21.000000', 3, 1),
(4, 'booking_confirmed', 'Xác nhận đặt bàn thành công', 'Đặt bàn TPZ001A2B của bạn đã được xác nhận', 1, '2026-06-16 20:12:21.000000', 1, 4),
(5, 'booking_confirmed', 'Đặt bàn mới từ staff_1', 'Có đặt bàn mới cho ngày 2026-06-20 lúc 17:00:00', 0, '2026-06-16 13:33:07.930535', 13, 1),
(6, 'booking_confirmed', 'Đặt bàn mới từ staff_1', 'Có đặt bàn mới cho ngày 2026-06-20 lúc 21:30:00', 0, '2026-06-16 13:33:37.856744', 14, 1),
(7, 'booking_confirmed', 'Đặt bàn mới từ staff_1', 'Có đặt bàn mới cho ngày 2026-06-17 lúc 13:00:00', 0, '2026-06-16 13:35:47.677926', 15, 1),
(8, 'booking_confirmed', 'Đặt bàn mới từ staff_1', 'Có đặt bàn mới cho ngày 2026-06-17 lúc 13:00:00', 0, '2026-06-16 13:35:47.677926', 15, 7),
(9, 'booking_confirmed', '🔔 Đặt bàn mới: TPZ54A6E84B', 'Khách hàng One Staff vừa đặt bàn tại T\'Pizza Bạch Đằng vào 20:30 ngày 19/06/2026. Ghi chú: dat cho khach', 0, '2026-06-16 14:18:22.365087', 16, 1),
(10, 'booking_confirmed', '🔔 Đặt bàn mới: TPZ54A6E84B', 'Khách hàng One Staff vừa đặt bàn tại T\'Pizza Bạch Đằng vào 20:30 ngày 19/06/2026. Ghi chú: dat cho khach', 0, '2026-06-16 14:18:22.368789', 16, 7),
(11, 'status_update', '📢 Đặt bàn đã được xác nhận', 'Đơn đặt bàn TPZ54A6E84B của bạn đã được xác nhận bởi nhân viên T\'Pizza.', 1, '2026-06-16 14:18:36.614878', 16, 2),
(12, 'staff_action', '👮 Nhân viên thao tác: TPZ54A6E84B', 'Nhân viên staff_1 vừa xác nhận đơn đặt bàn TPZ54A6E84B tại chi nhánh T\'Pizza Bạch Đằng. Ghi chú khách: \"dat cho khach\". Yêu cầu đặc biệt: \"Không có\".', 0, '2026-06-16 14:18:36.614878', 16, 1),
(13, 'staff_action', '👮 Nhân viên thao tác: TPZ54A6E84B', 'Nhân viên staff_1 vừa xác nhận đơn đặt bàn TPZ54A6E84B tại chi nhánh T\'Pizza Bạch Đằng. Ghi chú khách: \"dat cho khach\". Yêu cầu đặc biệt: \"Không có\".', 0, '2026-06-16 14:18:36.619958', 16, 7),
(14, 'booking_confirmed', '🔔 Đặt bàn mới: TPZAA5DC876', 'Khách hàng Minh Anh Nguyễn vừa đặt bàn tại T\'Pizza Bạch Đằng vào 12:00 ngày 18/06/2026. Ghi chú: Không có', 0, '2026-06-16 14:33:08.539119', 17, 1),
(15, 'booking_confirmed', '🔔 Đặt bàn mới: TPZAA5DC876', 'Khách hàng Minh Anh Nguyễn vừa đặt bàn tại T\'Pizza Bạch Đằng vào 12:00 ngày 18/06/2026. Ghi chú: Không có', 0, '2026-06-16 14:33:08.539119', 17, 7),
(16, 'status_update', '📢 Đặt bàn đã được xác nhận', 'Đơn đặt bàn TPZAA5DC876 của bạn đã được xác nhận bởi nhân viên T\'Pizza.', 1, '2026-06-16 14:59:52.550568', 17, 4),
(17, 'status_update', '📢 Chào mừng bạn đến với T\'Pizza', 'Đơn đặt bàn TPZAA5DC876 của bạn đã được check-in bởi nhân viên T\'Pizza.', 1, '2026-06-16 15:00:08.265335', 17, 4),
(18, 'status_update', '📢 Chào mừng bạn đến với T\'Pizza', 'Đơn đặt bàn TPZ54A6E84B của bạn đã được check-in bởi nhân viên T\'Pizza.', 1, '2026-06-16 15:00:09.600505', 16, 2);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) NOT NULL,
  `permission` varchar(50) NOT NULL,
  `role_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `permission`, `role_id`) VALUES
(2, 'create_booking', 1),
(4, 'delete_booking', 1),
(3, 'edit_booking', 1),
(6, 'manage_branches', 1),
(8, 'manage_tables', 1),
(9, 'manage_users', 1),
(1, 'view_bookings', 1),
(5, 'view_branches', 1),
(10, 'view_statistics', 1),
(7, 'view_tables', 1),
(12, 'edit_booking', 2),
(15, 'manage_tables', 2),
(11, 'view_bookings', 2),
(13, 'view_branches', 2),
(16, 'view_statistics', 2),
(14, 'view_tables', 2),
(18, 'create_booking', 3),
(19, 'edit_booking', 3),
(17, 'view_bookings', 3);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `description` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Administrator with full system access'),
(2, 'staff', 'Staff member who can manage bookings and tables'),
(3, 'customer', 'Regular customer who can make reservations');

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `id` bigint(20) NOT NULL,
  `table_number` varchar(10) NOT NULL,
  `capacity` int(11) NOT NULL,
  `zone` varchar(20) NOT NULL,
  `is_available` tinyint(1) NOT NULL,
  `notes` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `branch_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tables`
--

INSERT INTO `tables` (`id`, `table_number`, `capacity`, `zone`, `is_available`, `notes`, `created_at`, `updated_at`, `branch_id`) VALUES
(1, '01', 2, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 1),
(2, '02', 4, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 1),
(3, '03', 6, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 1),
(4, '04', 8, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 1),
(5, '05', 10, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 1),
(6, '06', 4, 'indoor', 0, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 1),
(7, '07', 2, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 1),
(8, '08', 4, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 1),
(9, '09', 6, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 1),
(10, '10', 8, 'outdoor', 0, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 1),
(11, '11', 4, 'mezzanine', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 1),
(12, '12', 6, 'mezzanine', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 1),
(13, '13', 2, 'kiln', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 1),
(14, '14', 4, 'kiln', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 1),
(15, '15', 6, 'kiln', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 1),
(16, '01', 2, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 2),
(17, '02', 4, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 2),
(18, '03', 6, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 2),
(19, '04', 8, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 2),
(20, '05', 10, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 2),
(21, '06', 4, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 2),
(22, '07', 2, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 2),
(23, '08', 4, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 2),
(24, '09', 6, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 2),
(25, '10', 8, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 2),
(26, '11', 4, 'mezzanine', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 2),
(27, '12', 6, 'mezzanine', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 2),
(28, '13', 2, 'kiln', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 2),
(29, '14', 4, 'kiln', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 2),
(30, '15', 6, 'kiln', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 2),
(31, '01', 2, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 3),
(32, '02', 4, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 3),
(33, '03', 6, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 3),
(34, '04', 8, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 3),
(35, '05', 2, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 3),
(36, '06', 4, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 3),
(37, '07', 6, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 3),
(38, '08', 4, 'mezzanine', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 3),
(39, '09', 6, 'mezzanine', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 3),
(40, '10', 2, 'kiln', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 3),
(41, '11', 4, 'kiln', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 3),
(42, '12', 6, 'kiln', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 3),
(43, '13', 8, 'kiln', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 3),
(44, '01', 2, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 4),
(45, '02', 4, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 4),
(46, '03', 6, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 4),
(47, '04', 8, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 4),
(48, '05', 10, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 4),
(49, '06', 2, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 4),
(50, '07', 4, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 4),
(51, '08', 6, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 4),
(52, '09', 4, 'mezzanine', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 4),
(53, '10', 6, 'mezzanine', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 4),
(54, '11', 2, 'kiln', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 4),
(55, '12', 4, 'kiln', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 4),
(56, '01', 2, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 5),
(57, '02', 4, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 5),
(58, '03', 6, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 5),
(59, '04', 8, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 5),
(60, '05', 2, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 5),
(61, '06', 4, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 5),
(62, '07', 6, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 5),
(63, '08', 10, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 5),
(64, '09', 4, 'mezzanine', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 5),
(65, '10', 2, 'kiln', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 5),
(66, '01', 2, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 6),
(67, '02', 4, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 6),
(68, '03', 6, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 6),
(69, '04', 8, 'indoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 6),
(70, '05', 2, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 6),
(71, '06', 4, 'outdoor', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 6),
(72, '07', 6, 'mezzanine', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 6),
(73, '08', 2, 'kiln', 1, '', '2026-06-16 20:12:21.000000', '2026-06-16 20:12:21.000000', 6);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `role_id` bigint(20) DEFAULT NULL,
  `branch_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `date_joined`, `phone`, `is_active`, `created_at`, `updated_at`, `role_id`, `branch_id`) VALUES
(1, 'pbkdf2_sha256$1200000$kdjMVCFzMp6icGjCTn9z3f$q7MH6Fu7lO9UipQ0yCH0oq9KzqB/o4hrHC+MDk39Z1U=', '2026-06-16 13:18:33.000000', 1, 'admin', 'Admin', 'User', 'admin@tpizza.com', 1, '2026-06-16 20:12:21.000000', '0908888888', 1, '2026-06-16 20:12:21.000000', '2026-06-16 13:34:35.787395', 1, NULL),
(2, 'pbkdf2_sha256$1200000$KhpV66J17Z8vMvAZBR7gxg$fzx81wwAsxrU4DMiMHwvcRLvTeEgkir4kfkLBTBbi8w=', NULL, 0, 'staff_1', 'Staff', 'One', 'staff1@tpizza.com', 0, '2026-06-16 20:12:21.000000', '0909999991', 1, '2026-06-16 20:12:21.000000', '2026-06-16 13:34:19.265574', 2, 5),
(3, 'pbkdf2_sha256$1200000$2kL0oat6faIjj2pX4dXujF$iAkRUOuGtBat+gJK4h1qeuZbo3Uk77Nrca+BudypiXc=', NULL, 0, 'staff_2', 'Staff', 'Two', 'staff2@tpizza.com', 0, '2026-06-16 20:12:21.000000', '0909999992', 1, '2026-06-16 20:12:21.000000', '2026-06-16 13:34:26.748682', 2, 6),
(4, 'pbkdf2_sha256$1200000$CCH6pjsl6cSSb8uf9Zveo8$PZPbcre9F86X9h+WETa5Zm4sqA40ymI/QH+SDA+WWnc=', NULL, 0, 'customer_1', 'Nguyễn', 'Minh Anh', 'minhanh@email.com', 0, '2026-06-16 20:12:21.000000', '0912345678', 1, '2026-06-16 20:12:21.000000', '2026-06-16 13:20:41.431391', 3, NULL),
(5, 'pbkdf2_sha256$1200000$q7gjfIEcONhodfdkVfnT9M$7qJ9FUJCAbTa0EzzQ+1gtoCo7j2X5CmmWtn9oSiy0f8=', NULL, 0, 'customer_2', 'Trần', 'Thanh Vân', 'thanhvan@email.com', 0, '2026-06-16 20:12:21.000000', '0987654321', 1, '2026-06-16 20:12:21.000000', '2026-06-16 13:20:48.598855', 3, NULL),
(6, 'pbkdf2_sha256$1200000$s4PFgr1FRXxVW1TkVuLgg0$PPIqaCD47XhtIyp2zKExMa9vbtv/TYGg3JSyhX9WFVc=', NULL, 0, 'customer_3', 'Phạm', 'Đức Bảo', 'ducbao@email.com', 0, '2026-06-16 20:12:21.000000', '0934567890', 1, '2026-06-16 20:12:21.000000', '2026-06-16 13:20:59.665301', 3, NULL),
(7, 'pbkdf2_sha256$1200000$KQ3m21bVY1w7SCzgG6d9dk$Ra9k0eUc8vrDasniKih9ZWyiBbY/m+K7RUMjCaCYjXg=', '2026-06-16 13:13:59.000000', 1, 'admin1', '', '', 'admin1@gmail.com', 1, '2026-06-16 13:13:29.476926', '', 1, '2026-06-16 13:13:29.945158', '2026-06-16 13:34:40.844155', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users_groups`
--

CREATE TABLE `users_groups` (
  `id` bigint(20) NOT NULL,
  `customuser_id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_user_permissions`
--

CREATE TABLE `users_user_permissions` (
  `id` bigint(20) NOT NULL,
  `customuser_id` bigint(20) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_code` (`booking_code`),
  ADD KEY `bookings_table_id_76ef036a_fk_tables_id` (`table_id`),
  ADD KEY `bookings_booking_d6111c_idx` (`booking_code`),
  ADD KEY `bookings_custome_bd0d22_idx` (`customer_id`,`booking_date` DESC),
  ADD KEY `bookings_branch__9486a9_idx` (`branch_id`,`booking_date`),
  ADD KEY `bookings_status_51373b_idx` (`status`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_messages_session_id_c5afc568_fk_chat_sessions_id` (`session_id`);

--
-- Indexes for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_id` (`session_id`),
  ADD KEY `chat_sessions_branch_id_f46f36f7_fk_branches_id` (`branch_id`),
  ADD KEY `chat_sessions_user_id_6ab420a0_fk_users_id` (`user_id`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_users_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indexes for table `menu_categories`
--
ALTER TABLE `menu_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menu_items_category_id_5066f1ed_fk_menu_categories_id` (`category_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_booking_id_65edc4c5_fk_bookings_id` (`booking_id`),
  ADD KEY `notifications_user_id_468e288d_fk_users_id` (`user_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_role_id_permission_c73cee0e_uniq` (`role_id`,`permission`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tables_branch_id_table_number_c6c9544f_uniq` (`branch_id`,`table_number`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `users_role_id_1900a745_fk_roles_id` (`role_id`),
  ADD KEY `users_branch_id_d1b397ca_fk_branches_id` (`branch_id`);

--
-- Indexes for table `users_groups`
--
ALTER TABLE `users_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_groups_customuser_id_group_id_927de924_uniq` (`customuser_id`,`group_id`),
  ADD KEY `users_groups_group_id_2f3517aa_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `users_user_permissions`
--
ALTER TABLE `users_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_user_permissions_customuser_id_permission_id_2b4e4e39_uniq` (`customuser_id`,`permission_id`),
  ADD KEY `users_user_permissio_permission_id_6d08dcd2_fk_auth_perm` (`permission_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `menu_categories`
--
ALTER TABLE `menu_categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users_groups`
--
ALTER TABLE `users_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_user_permissions`
--
ALTER TABLE `users_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_branch_id_a8e96420_fk_branches_id` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  ADD CONSTRAINT `bookings_customer_id_621160fd_fk_users_id` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_table_id_76ef036a_fk_tables_id` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`);

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_session_id_c5afc568_fk_chat_sessions_id` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`id`);

--
-- Constraints for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD CONSTRAINT `chat_sessions_branch_id_f46f36f7_fk_branches_id` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  ADD CONSTRAINT `chat_sessions_user_id_6ab420a0_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `menu_items_category_id_5066f1ed_fk_menu_categories_id` FOREIGN KEY (`category_id`) REFERENCES `menu_categories` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_booking_id_65edc4c5_fk_bookings_id` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  ADD CONSTRAINT `notifications_user_id_468e288d_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `permissions_role_id_cf87720b_fk_roles_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `tables`
--
ALTER TABLE `tables`
  ADD CONSTRAINT `tables_branch_id_07f6b72c_fk_branches_id` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_branch_id_d1b397ca_fk_branches_id` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  ADD CONSTRAINT `users_role_id_1900a745_fk_roles_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `users_groups`
--
ALTER TABLE `users_groups`
  ADD CONSTRAINT `users_groups_customuser_id_4bd991a9_fk_users_id` FOREIGN KEY (`customuser_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `users_groups_group_id_2f3517aa_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `users_user_permissions`
--
ALTER TABLE `users_user_permissions`
  ADD CONSTRAINT `users_user_permissio_permission_id_6d08dcd2_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `users_user_permissions_customuser_id_efdb305c_fk_users_id` FOREIGN KEY (`customuser_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
