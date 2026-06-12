import { Branch, Table, Booking } from './types';

export const LOCATIONS = [
  'Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Hải Phòng'
];

export const BRANCHES: Branch[] = [
  {
    id: 'b1',
    name: "T'Pizza Hai Bà Trưng",
    location: 'Hồ Chí Minh',
    address: '180 Hai Bà Trưng, Phường Đa Kao, Quận 1, TP. HCM',
    phone: '028 3622 0500',
    imgUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    description: 'Chi nhánh trung tâm cổ kính, trang nhã. Có quầy bar dài lãng mạn và hai lò nướng củi trung tâm rực lửa thích hợp cho gia đình hoặc hẹn hò.',
    rating: 4.8,
    status: 'Hoạt động',
    lat: 10.7828,
    lng: 106.6958
  },
  {
    id: 'b2',
    name: "T'Pizza Võ Văn Tần",
    location: 'Hồ Chí Minh',
    address: '31 Võ Văn Tần, Phường 6, Quận 3, TP. HCM',
    phone: '028 3622 0501',
    imgUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    description: 'Phong cách sân vườn biệt thự Đông Dương cũ. Không gian ngoài trời ngập tràn bóng mát cây xanh, mang đến bầu không khí thư thái tĩnh lặng.',
    rating: 4.9,
    status: 'Hoạt động',
    lat: 10.7785,
    lng: 106.6908
  },
  {
    id: 'b3',
    name: "T'Pizza Lý Quốc Sư",
    location: 'Hà Nội',
    address: '2 Lý Quốc Sư, Hàng Trống, Hoàn Kiếm, Hà Nội',
    phone: '024 3622 0502',
    imgUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    description: 'Nằm ngay sát Nhà Thờ Lớn cổ kính. Không gian gác mái ấm cúng với gạch mộc và dầm gỗ tự nhiên mang đậm hơi thở Hà Nội xưa.',
    rating: 4.7,
    status: 'Hoạt động',
    lat: 21.0289,
    lng: 105.8488
  },
  {
    id: 'b4',
    name: "T'Pizza Phan Chu Trinh",
    location: 'Hà Nội',
    address: '43 Phan Chu Trinh, Hoàn Kiếm, Hà Nội',
    phone: '024 3622 0503',
    imgUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    description: 'Không gian mở 2 tầng rộng lớn, phong cách Tây Âu kết hợp tối giản Nhật Bản. Nơi lý tưởng để tổ chức các buổi tiệc đông người.',
    rating: 4.8,
    status: 'Đông khách',
    lat: 21.0215,
    lng: 105.8562
  },
  {
    id: 'b5',
    name: "T'Pizza Bạch Đằng",
    location: 'Đà Nẵng',
    address: '214 Bạch Đằng, Phước Ninh, Hải Châu, Đà Nẵng',
    phone: '0236 3622 0504',
    imgUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    description: 'Ôm trọn tầm nhìn ra Sông Hàn và Cầu Rồng thơ mộng. Khu vực seating ngoài trời lộng gió thích hợp ngắm hoàng hôn và nhâm nhi bia thủ công.',
    rating: 4.9,
    status: 'Hoạt động',
    lat: 16.0664,
    lng: 108.2238
  },
  {
    id: 'b6',
    name: "T'Pizza Điện Biên Phủ",
    location: 'Hải Phòng',
    address: '15 Điện Biên Phủ, Máy Tơ, Ngô Quyền, Hải Phòng',
    phone: '0225 3622 0505',
    imgUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    description: 'Thiết kế cải tạo từ một nhà kho hải cảng cũ, kiến trúc thô mộc Industrial đầy cuốn hút kết hợp cây xanh dây leo độc đáo.',
    rating: 4.6,
    status: 'Bảo trì',
    lat: 20.8654,
    lng: 106.6892
  }
];

// Generates 15 standard tables for any branch with varying capacities and zones
export const generateTables = (branchId: string): Table[] => {
  const zones: Array<'Trong nhà' | 'Ngoài trời' | 'Quầy tầng lửng' | 'Cạnh lò củi'> = [
    'Trong nhà', 'Ngoài trời', 'Quầy tầng lửng', 'Cạnh lò củi'
  ];
  const tables: Table[] = [];
  let tableIndex = 1;

  zones.forEach((zone) => {
    // 4 tables per zone (except some have more or less)
    const count = zone === 'Trong nhà' ? 6 : zone === 'Ngoài trời' ? 4 : zone === 'Cạnh lò củi' ? 3 : 2;
    for (let i = 1; i <= count; i++) {
      let cap = 4; // default
      if (i === 1) cap = 2;       // couples
      else if (i === 2) cap = 4;  // standard family
      else if (i === 3) cap = 6;  // medium group
      else if (i === 4) cap = 8;  // large group
      else cap = 10;              // VIP party

      tables.push({
        id: `${branchId}_tbl_${tableIndex}`,
        table_number: `${zone.charAt(0)}${tableIndex < 10 ? '0' + tableIndex : tableIndex}`,
        capacity: cap,
        zone
      });
      tableIndex++;
    }
  });

  return tables;
};

// Seed bookings for active statistics and live occupancy simulation
export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'res-1',
    bookingCode: 'TP-LQS-489A',
    customerName: 'Nguyễn Minh Anh',
    customerPhone: '0912345678',
    customerEmail: 'minhanh@gmail.com',
    branchId: 'b3',
    branchName: "T'Pizza Lý Quốc Sư",
    date: '2026-06-12',
    time: '12:00',
    adultsCount: 4,
    childrenCount: 2,
    zonePreference: 'Trong nhà',
    specialRequests: ['Ghế cho trẻ em', 'Sinh nhật'],
    customerNotes: 'Vui lòng sắp xếp nến cắm cupcake sinh nhật của bé.',
    status: 'Đã xác nhận',
    createdAt: '2026-06-11T10:30:00Z',
    tableNumber: 'T02'
  },
  {
    id: 'res-2',
    bookingCode: 'TP-HBT-872C',
    customerName: 'Trần Thị Thanh Vân',
    customerPhone: '0987654321',
    customerEmail: 'thanhvan@hotmail.com',
    branchId: 'b1',
    branchName: "T'Pizza Hai Bà Trưng",
    date: '2026-06-12',
    time: '19:30',
    adultsCount: 2,
    childrenCount: 0,
    zonePreference: 'Cạnh lò củi',
    specialRequests: ['Kỷ niệm ngày cưới'],
    customerNotes: 'Chụp ảnh lưu niệm hộ đôi vợ chồng nhé!',
    status: 'Đã đến',
    createdAt: '2026-06-11T14:15:00Z',
    tableNumber: 'C11'
  },
  {
    id: 'res-3',
    bookingCode: 'TP-VVT-112B',
    customerName: 'Marcus Aurelius',
    customerPhone: '0909555111',
    customerEmail: 'marcus.pi@gmail.com',
    branchId: 'b2',
    branchName: "T'Pizza Võ Văn Tần",
    date: '2026-06-12',
    time: '18:15',
    adultsCount: 6,
    childrenCount: 1,
    zonePreference: 'Ngoài trời',
    specialRequests: ['Yêu cầu đặc biệt khác'],
    customerNotes: 'Dị ứng bột ngọt và gluten nếu có thể chuẩn bị vỏ bánh sourdough cho pizza.',
    status: 'Chờ xác nhận',
    createdAt: '2026-06-11T18:00:00Z',
    tableNumber: 'N07'
  },
  {
    id: 'res-4',
    bookingCode: 'TP-PCT-095X',
    customerName: 'Phạm Đức Bảo',
    customerPhone: '0934567890',
    customerEmail: 'ducbao@yahoo.com',
    branchId: 'b4',
    branchName: "T'Pizza Phan Chu Trinh",
    date: '2026-06-13',
    time: '11:45',
    adultsCount: 8,
    childrenCount: 0,
    zonePreference: 'Quầy tầng lửng',
    specialRequests: ['Hội thảo công việc'],
    customerNotes: 'Cần góc yên tĩnh để bàn hợp đồng thương mại.',
    status: 'Đã xác nhận',
    createdAt: '2026-06-10T09:00:00Z',
    tableNumber: 'Q13'
  },
  {
    id: 'res-5',
    bookingCode: 'TP-BD-556K',
    customerName: 'Lê Hoàng Hải',
    customerPhone: '0901234999',
    customerEmail: 'hoanghai.dn@gmail.com',
    branchId: 'b5',
    branchName: "T'Pizza Bạch Đằng",
    date: '2026-06-12',
    time: '20:15',
    adultsCount: 2,
    childrenCount: 0,
    zonePreference: 'Ngoài trời',
    specialRequests: [],
    customerNotes: 'Sát mép hành lang để ngắm trọn Cầu Rồng phun lửa.',
    status: 'Quá hạn',
    createdAt: '2026-06-12T10:00:00Z'
  },
  {
    id: 'res-6',
    bookingCode: 'TP-HBT-991H',
    customerName: 'Hoàng Thùy Linh',
    customerPhone: '0943999999',
    customerEmail: 'thuylinh.h@gmail.com',
    branchId: 'b1',
    branchName: "T'Pizza Hai Bà Trưng",
    date: '2026-06-14',
    time: '19:00',
    adultsCount: 3,
    childrenCount: 1,
    zonePreference: 'Cạnh lò củi',
    specialRequests: ['Ghế cho trẻ em'],
    customerNotes: 'Bé hiếu động thích nhìn đầu bếp nặn bánh pizza.',
    status: 'Đã xác nhận',
    createdAt: '2026-06-11T12:00:00Z',
    tableNumber: 'C12'
  }
];
