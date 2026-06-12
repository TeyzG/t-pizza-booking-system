import React, { useState, useEffect } from 'react';
import { 
  Compass, ShieldAlert, BookOpen, Coffee, Flame, Server, 
  MapPin, HelpCircle, UtensilsCrossed, CalendarDays, Key, Settings
} from 'lucide-react';
import { Booking } from './types';
import { SEED_BOOKINGS } from './data';
import BookingWizard from './components/BookingWizard';
import AdminPortal from './components/AdminPortal';
import DevDocs from './components/DevDocs';

export default function App() {
  const [activeTab, setActiveTab] = useState<'customer' | 'admin' | 'developer'>('customer');
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load bookings from localStorage on mount, fall back to seed bookings
  useEffect(() => {
    const saved = localStorage.getItem('t_pizza_bookings');
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {
        setBookings(SEED_BOOKINGS);
      }
    } else {
      setBookings(SEED_BOOKINGS);
    }
  }, []);

  // Save bookings to localStorage whenever they change
  const saveBookings = (updatedList: Booking[]) => {
    setBookings(updatedList);
    localStorage.setItem('t_pizza_bookings', JSON.stringify(updatedList));
  };

  // Add new booking from reservation client wizard
  const handleAddNewBooking = (newBooking: Booking) => {
    const newList = [newBooking, ...bookings];
    saveBookings(newList);
  };

  // Update reservation status in Admin panel
  const handleUpdateStatus = (bookingId: string, newStatus: Booking['status']) => {
    const newList = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: newStatus };
      }
      return b;
    });
    saveBookings(newList);
  };

  // Delete/Cancel reservation in Admin panel
  const handleDeleteBooking = (bookingId: string) => {
    const confirmCancel = window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn lịch sử đặt bàn này?');
    if (confirmCancel) {
      const newList = bookings.filter(b => b.id !== bookingId);
      saveBookings(newList);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2C2C2C] flex flex-col selection:bg-[#4A4A3E] selection:text-white">
      
      {/* Primary Top Header */}
      <header className="sticky top-0 z-50 bg-[#F9F8F6]/95 backdrop-blur-md border-b border-[#E5E2DA] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Logo Brand area */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4A4A3E] text-white rounded-full flex items-center justify-center font-serif font-bold text-lg">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-serif tracking-widest font-bold uppercase text-[#2C2C2C]">T'PIZZA</h1>
                <span className="bg-[#4A4A3E]/10 text-[#4A4A3E] text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border border-[#4A4A3E]/20">
                  ARTISANAL
                </span>
              </div>
              <p className="text-[10px] text-[#4A4A3E] uppercase tracking-wider font-mono opacity-80">Premium Wood-fired Pizza Booking System</p>
            </div>
          </div>

          {/* Navigation tabs switcher */}
          <div className="flex bg-[#E5E2DA]/50 p-1 border border-[#E5E2DA] rounded-xl gap-1">
            <button
              onClick={() => setActiveTab('customer')}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold tracking-widest uppercase transition-all cursor-pointer ${
                activeTab === 'customer'
                  ? 'bg-[#4A4A3E] text-white shadow-sm font-extrabold'
                  : 'text-[#4A4A3E] hover:text-[#2C2C2C] hover:bg-white/50'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              Đặt bàn ăn
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold tracking-widest uppercase transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#4A4A3E] text-white shadow-sm font-extrabold'
                  : 'text-[#4A4A3E] hover:text-[#2C2C2C] hover:bg-white/50'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              Quản trị viên
            </button>
            <button
              onClick={() => setActiveTab('developer')}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold tracking-widest uppercase transition-all cursor-pointer ${
                activeTab === 'developer'
                  ? 'bg-[#4A4A3E] text-white shadow-sm font-extrabold'
                  : 'text-[#4A4A3E] hover:text-[#2C2C2C] hover:bg-white/50'
              }`}
              style={activeTab === 'developer' ? { backgroundColor: '#4A4A3E', color: '#ffffff' } : {}}
            >
              <Server className="w-4 h-4 shrink-0" />
              Specs & DB
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 z-10">
        
        {/* Educational helper reminder bar */}
        <div className="bg-white border border-[#E5E2DA] rounded-xl p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2 shadow-sm">
          <div className="flex gap-3 text-[#2C2C2C]">
            <div className="bg-[#4A4A3E]/10 p-2.5 rounded-xl text-[#4A4A3E] flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-[#4A4A3E] uppercase tracking-wider mb-0.5">Mô tả quy trình Thử nghiệm Mẫu</p>
              Đặt bàn thành công ở tab <strong className="text-[#4A4A3E] font-bold">Đặt bàn ăn</strong> ➔ Chuyển qua tab <strong className="text-[#4A4A3E] font-bold">Quản trị viên</strong> để phê duyệt trạng thái, xem sơ đồ bàn tương ứng ➔ Xem tab <strong className="text-[#4A4A3E] font-bold">Specs & DB</strong> để lấy code cấu trúc DB & thuật toán quét bàn trống bằng Python.
            </div>
          </div>
          
          <div className="text-[11px] font-mono text-[#4A4A3E] border border-[#E5E2DA] bg-[#F9F8F6] px-3 py-2 rounded-lg text-center font-bold tracking-widest uppercase">
            🕒 Hiện tại: <strong className="text-[#2C2C2C]">Thứ Năm, 11/06/2026</strong>
          </div>
        </div>

        {/* Tab display selectors */}
        {activeTab === 'customer' && (
          <div className="space-y-6">
            <BookingWizard 
              onBookingSuccess={handleAddNewBooking}
              activeBookings={bookings}
            />
          </div>
        )}

        {activeTab === 'admin' && (
          <div>
            <AdminPortal 
              bookings={bookings}
              onUpdateStatus={handleUpdateStatus}
              onDeleteBooking={handleDeleteBooking}
            />
          </div>
        )}

        {activeTab === 'developer' && (
          <div>
            <DevDocs />
          </div>
        )}
      </main>

      {/* Immersive Footer */}
      <footer className="border-t border-[#E5E2DA] bg-white mt-12 py-10 text-[#4A4A3E] text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#2C2C2C] uppercase tracking-widest">T'PIZZA GOURMET SYSTEM</span>
            <span className="opacity-60">• Inspired by Pizza 4P's Co, Ltd.</span>
          </div>
          <div className="flex gap-4 opacity-80">
            <span className="hover:text-black transition-colors">Vite + React</span>
            <span>•</span>
            <span className="hover:text-black transition-colors">Django Rest Framework (DRF)</span>
            <span>•</span>
            <span className="hover:text-black transition-colors font-mono font-bold">MySQL</span>
          </div>
          <div className="text-[10px] font-mono opacity-60">
            Địa chỉ cơ sở phân phối: Đà Lạt Organic Farm.
          </div>
        </div>
      </footer>
    </div>
  );
}
