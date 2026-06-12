export interface Branch {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  imgUrl: string;
  description: string;
  rating: number;
  status: 'Hoạt động' | 'Đông khách' | 'Bảo trì';
  lat: number;
  lng: number;
}

export interface Table {
  id: string;
  table_number: string;
  capacity: number;
  zone: 'Trong nhà' | 'Ngoài trời' | 'Quầy tầng lửng' | 'Cạnh lò củi';
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  branchId: string;
  branchName: string;
  date: string;
  time: string;
  adultsCount: number;
  childrenCount: number;
  zonePreference: 'Trong nhà' | 'Ngoài trời' | 'Quầy tầng lửng' | 'Cạnh lò củi' | 'Bất kỳ';
  specialRequests: string[];
  customerNotes?: string;
  status: 'Chờ xác nhận' | 'Đã xác nhận' | 'Đã đến' | 'Đã hủy' | 'Quá hạn';
  createdAt: string;
  tableId?: string;
  tableNumber?: string;
}

export interface TimeSlot {
  time: string;
  period: 'lunch' | 'dinner';
  availableTables: number;
  totalTables: number;
}
