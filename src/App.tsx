import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Compass, Settings, CalendarDays, LogOut, Pizza, MapPin, Star, ArrowRight, Heart, ScrollText, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Booking, Branch } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { bookingsApi, branchesApi } from './api/client';
import NotificationDropdown from './components/NotificationDropdown';
import BookingWizard from './components/BookingWizardNew';
import AdminPortal from './components/AdminPortal';
import Login from './components/Login';
import ChatBot from './components/ChatBot';
import MenuPage from './components/MenuPage'; // Import the new MenuPage


function AppContent() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'customer' | 'history' | 'menu' | 'admin'>('home');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [appLoading, setAppLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scroll reference for branches
  const branchScrollRef = useRef<HTMLDivElement>(null);

  const scrollBranches = (direction: 'left' | 'right') => {
    if (branchScrollRef.current) {
      const { scrollLeft, clientWidth } = branchScrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 1.5 
        : scrollLeft + clientWidth / 1.5;
      branchScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const loadBookings = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setAppLoading(true);
      setError(null);
      const isAdmin = user?.role_name === 'Admin' || user?.role === 'admin';
      const isStaff = user?.role_name === 'Staff' || user?.role === 'staff';
      
      if (isAdmin || isStaff) {
        const response = await bookingsApi.getAll();
        setBookings(response.results || []);
      } else {
        const myBookings = await bookingsApi.getMyBookings();
        setBookings(Array.isArray(myBookings) ? myBookings : []);
      }
    } catch (err: any) {
      console.error('Failed to load bookings:', err);
      setError(err.message);
      setBookings([]);
    } finally {
      setAppLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadBranches = useCallback(async () => {
    try {
      const response = await branchesApi.getAll();
      // Xử lý dữ liệu trả về từ DRF (thường bọc trong kết quả phân trang)
      const branchList = Array.isArray(response) ? response : response.results;
      setBranches(branchList || []);
    } catch (err) {
      console.error('Failed to load branches:', err);
    }
  }, []);

  useEffect(() => {
    document.title = "T'Pizza by Hoàng Lương MAYTECH";
    loadBookings();
    loadBranches();
  }, [loadBookings, loadBranches]);

  // Add new booking from reservation wizard
  const handleAddNewBooking = async (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    // Reload to get server-assigned booking_code and table
    setTimeout(() => loadBookings(), 500);
  };

  // Update booking status via API
  const handleUpdateStatus = async (bookingId: number, newStatus: string, extraData?: any) => {
    try {
      let updated: Booking;
      switch (newStatus) {
        case 'confirmed':
          updated = await bookingsApi.confirm(bookingId);
          break;
        case 'checked_in':
          updated = await bookingsApi.checkIn(bookingId, extraData?.table_id);
          break;
        case 'cancelled':
          updated = await bookingsApi.cancel(bookingId);
          break;
        case 'expired':
          updated = await bookingsApi.update(bookingId, { status: 'expired' });
          break;
        default:
          updated = await bookingsApi.update(bookingId, { status: newStatus });
      }
      setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
    } catch (err: any) {
      console.error('Failed to update booking:', err);
      alert('Không thể cập nhật trạng thái: ' + err.message);
    }
  };

  // Delete booking via API
  const handleDeleteBooking = async (bookingId: number) => {
    const confirmCancel = window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn lịch sử đặt bàn này?');
    if (!confirmCancel) return;
    try {
      await bookingsApi.delete(bookingId);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (err: any) {
      console.error('Failed to delete booking:', err);
      alert('Không thể xóa: ' + err.message);
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2C2C2C] flex flex-col selection:bg-[#4A4A3E] selection:text-white">
      
      {/* Primary Top Header */}
      <header className="sticky top-0 z-50 bg-[#F9F8F6]/95 backdrop-blur-md border-b border-[#E5E2DA] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Logo Brand area */}
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer text-left"
          >
            <div className="w-10 h-10 bg-[#4A4A3E] text-white rounded-full flex items-center justify-center font-serif font-bold text-lg">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-serif tracking-widest font-bold uppercase text-[#2C2C2C]">T'PIZZA by Hoàng Lương MAYTECH</h1>
                <span className="bg-[#4A4A3E]/10 text-[#4A4A3E] text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border border-[#4A4A3E]/20">
                  ARTISANAL
                </span>
              </div>
              <p className="text-[10px] text-[#4A4A3E] uppercase tracking-wider font-mono opacity-80">Premium Wood-fired Pizza Booking System</p>
            </div>
          </button>

          {/* Navigation tabs and user menu */}
          <div className="flex items-center gap-4">
            {/* Navigation tabs switcher */}
            <div className="flex bg-[#E5E2DA]/50 p-1 border border-[#E5E2DA] rounded-xl gap-1 overflow-hidden">
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
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold tracking-widest uppercase transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-[#4A4A3E] text-white shadow-sm font-extrabold'
                    : 'text-[#4A4A3E] hover:text-[#2C2C2C] hover:bg-white/50'
                }`}
              >
                <CalendarDays className="w-4 h-4 shrink-0" />
                Lịch sử
              </button>

              <button
                onClick={() => setActiveTab('menu')}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold tracking-widest uppercase transition-all cursor-pointer ${
                  activeTab === 'menu'
                    ? 'bg-[#4A4A3E] text-white shadow-sm font-extrabold'
                    : 'text-[#4A4A3E] hover:text-[#2C2C2C] hover:bg-white/50'
                }`}
              >
                <ScrollText className="w-4 h-4 shrink-0" />
                Thực đơn
              </button>

              {user?.role_name && (['Admin', 'Staff'].includes(user.role_name) || ['admin', 'staff'].includes(user.role)) && (
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
              )}
            </div>

            {/* User profile menu */}
            <div className="flex items-center gap-2 pl-4 border-l border-[#E5E2DA]">
              <NotificationDropdown />
              <div className="text-right text-xs">
                <p className="font-bold text-[#2C2C2C]">{user?.username}</p>
                <p className="text-[#4A4A3E] opacity-70">
                  {user?.branch_name 
                    ? `${user.role_name} • ${user.branch_name}` 
                    : user?.role_name}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-2 hover:bg-[#E5E2DA] rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-[#4A4A3E]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 z-10">

        {/* Tab: HOME (The new landing page) */}
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fade-in mb-12">
            {/* Hero Section */}
            <section className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80" 
                className="w-full h-full object-cover" 
                alt="T'Pizza Wood Fired" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center px-8 md:px-16">
                <div className="max-w-xl text-white space-y-6">
                  <span className="bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    Original Wood-Fired Taste
                  </span>
                  <h2 className="text-5xl md:text-6xl font-serif font-bold leading-tight">Nghệ thuật Pizza nướng củi</h2>
                  <p className="text-lg text-white/80 leading-relaxed">
                    Hơn cả một bữa ăn, chúng tôi mang đến trải nghiệm ẩm thực Ý đích thực với bột sourdough lên men 48h và phô mai tươi thủ công từ Đà Lạt.
                  </p>
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setActiveTab('customer')}
                      className="bg-white text-[#4A4A3E] px-8 py-3 rounded-xl font-bold hover:bg-[#F9F8F6] transition-all flex items-center gap-2 cursor-pointer"
                    >
                      Đặt bàn ngay
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setActiveTab('menu')}
                      className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all cursor-pointer"
                    >
                      Xem Thực đơn
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Pizza className="w-6 h-6" />, title: "Nguyên liệu hữu cơ", desc: "Chúng tôi sử dụng rau củ từ nông trại riêng tại Đà Lạt và phô mai tươi tự làm mỗi ngày." },
                { icon: <Heart className="w-6 h-6" />, title: "Lò nướng củi 400°C", desc: "Bánh được nướng trong lò gạch truyền thống bằng củi cà phê, tạo nên hương vị ám khói đặc trưng." },
                { icon: <Star className="w-6 h-6" />, title: "Dịch vụ tận tâm", desc: "Đội ngũ nhân viên T'Pizza luôn sẵn lòng mang đến cho bạn cảm giác ấm cúng như tại gia đình." }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-[#E5E2DA] hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 bg-[#4A4A3E]/10 rounded-xl flex items-center justify-center text-[#4A4A3E] mb-4 group-hover:bg-[#4A4A3E] group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#4A4A3E] leading-relaxed opacity-80">{feature.desc}</p>
                </div>
              ))}
            </section>

            {/* Quick Branches Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif font-bold">Hệ thống chi nhánh</h2>
                <button className="text-sm font-bold text-[#4A4A3E] hover:underline">Xem tất cả</button>
              </div>
              
              <div className="relative group/nav">
                {/* Navigation Buttons */}
                <button 
                  onClick={() => scrollBranches('left')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-md border border-[#E5E2DA] rounded-full flex items-center justify-center shadow-lg cursor-pointer opacity-0 group-hover/nav:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={() => scrollBranches('right')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-md border border-[#E5E2DA] rounded-full flex items-center justify-center shadow-lg cursor-pointer opacity-0 group-hover/nav:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Scroll Container */}
                <div 
                  ref={branchScrollRef}
                  className="flex gap-6 overflow-x-auto pb-6 scroll-smooth hide-scrollbar px-2"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {branches.map((branch) => (
                    <div key={branch.id} className="group relative h-80 w-72 rounded-3xl overflow-hidden cursor-pointer shrink-0 shadow-sm hover:shadow-xl transition-all duration-500">
                      <img src={branch.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={branch.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform">
                        <p className="text-lg font-serif font-bold">{branch.name}</p>
                        <p className="text-xs opacity-80 flex items-center gap-1.5 mt-1"><MapPin className="w-3.5 h-3.5" /> {branch.location}</p>
                        <div className="h-0.5 w-0 group-hover:w-full bg-amber-500 mt-4 transition-all duration-500"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
        
        {/* Status bar */}
        <div className="bg-white border border-[#E5E2DA] rounded-xl p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2 shadow-sm">
          <div className="flex gap-3 text-[#2C2C2C]">
            <div className="bg-[#4A4A3E]/10 p-2.5 rounded-xl text-[#4A4A3E] flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-[#4A4A3E] uppercase tracking-wider mb-0.5">Hệ thống đặt bàn T'Pizza</p>
              <span>Dữ liệu được đồng bộ từ <strong className="text-[#4A4A3E]">Django REST API</strong> — tất cả thao tác đều tác động trực tiếp đến database.</span>
              {error && (
                <p className="text-red-600 text-xs mt-1">⚠ {error}</p>
              )}
            </div>
          </div>
          
          <div className="text-[11px] font-mono text-[#4A4A3E] border border-[#E5E2DA] bg-[#F9F8F6] px-3 py-2 rounded-lg text-center font-bold tracking-widest uppercase">
            🕒 {bookings.length} đơn hàng • {user?.role_name}
          </div>
        </div>

        {/* Tab display selectors */}
        {activeTab === 'customer' && (
          <div className="space-y-6">
            <BookingWizard onBookingSuccess={handleAddNewBooking} />
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="animate-fade-in">
            <MenuPage />
          </div>
        )}

        {activeTab === 'history' && (
           <div className="max-w-4xl mx-auto mt-4">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#4A4A3E]">Lịch sử đặt bàn của bạn</h2>
                <div className="h-px flex-1 bg-[#E5E2DA]"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {appLoading ? (
                  <div className="bg-white border border-[#E5E2DA] rounded-xl p-8 text-center">
                    <div className="animate-spin inline-block w-6 h-6 border-2 border-[#4A4A3E] border-t-transparent rounded-full mb-2"></div>
                    <p className="text-xs text-[#BCB8AF] font-mono">Đang tải lịch sử...</p>
                  </div>
                ) : bookings.length > 0 ? (
                  bookings.map((bk) => (
                    <div key={bk.id} className="bg-white border border-[#E5E2DA] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-[#F9F8F6] rounded-lg flex flex-col items-center justify-center border border-[#E5E2DA]">
                          <span className="text-[10px] font-bold text-[#4A4A3E] uppercase">{new Date(bk.booking_date).toLocaleDateString('vi-VN', {month: 'short'})}</span>
                          <span className="text-lg font-serif font-bold leading-none">{new Date(bk.booking_date).getDate()}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm">{bk.branch_name}</h3>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              bk.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                              bk.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {bk.status_display}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#4A4A3E] mt-1 font-mono">
                            Mã: <span className="font-bold">{bk.booking_code}</span> • {bk.booking_time} • {bk.total_guests} khách
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {bk.status === 'pending' && (
                          <button 
                            onClick={() => handleUpdateStatus(bk.id, 'cancelled')}
                            className="text-[10px] font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-colors"
                          >
                            Hủy đặt bàn
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-[#E5E2DA] rounded-xl p-12 text-center">
                    <CalendarDays className="w-8 h-8 text-[#E5E2DA] mx-auto mb-3" />
                    <p className="text-sm text-[#BCB8AF]">Bạn chưa có lịch sử đặt bàn nào.</p>
                  </div>
                )}
              </div>
            </div>
        )}

        {activeTab === 'admin' && isAuthenticated && (
          <div>
            <AdminPortal 
              bookings={bookings}
              onUpdateStatus={handleUpdateStatus}
              onDeleteBooking={handleDeleteBooking}
              onRefresh={loadBookings}
            />
          </div>
        )}
      </main>

      {/* ChatBot - floating button + panel */}
      <ChatBot />

      {/* Immersive Footer */}
      <footer className="border-t border-[#E5E2DA] bg-white mt-12 py-10 text-[#4A4A3E] text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab('home')}
              className="font-serif font-bold text-[#2C2C2C] uppercase tracking-widest hover:text-[#4A4A3E] transition-colors cursor-pointer text-left"
            >
              T'PIZZA by Hoàng Lương MAYTECH
            </button>
            <div className="flex flex-col gap-0.5 mt-2 opacity-70">
              <p className="font-bold uppercase tracking-wider text-[10px]">CÔNG TY TNHH MAYTECH</p>
              <p>Mã số thuế: 0312743032</p>
            </div>
          </div>
          <div className="flex gap-4 opacity-50 font-mono text-[10px]">
            <span className="hover:text-black transition-colors">Vite + React</span>
            <span>•</span>
            <span className="hover:text-black transition-colors">Django Rest Framework (DRF)</span>
            <span>•</span>
            <span className="hover:text-black transition-colors font-bold">MySQL</span>
          </div>
          <div className="text-[10px] font-mono opacity-60">
            Địa chỉ cơ sở phân phối: Đà Lạt Organic Farm.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
