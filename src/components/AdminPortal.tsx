import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Clock, MapPin, Search, BarChart3, Trash2, RefreshCw, 
  LayoutGrid, Check, Settings, Info, AlertCircle, Loader, X, ChevronRight
} from 'lucide-react';
import { Booking, DashboardStatistics, Branch } from '../types';
import { branchesApi, bookingsApi } from '../api/client';

interface AdminPortalProps {
  bookings: Booking[];
  onUpdateStatus: (bookingId: number, newStatus: string, extraData?: any) => void;
  onDeleteBooking: (bookingId: number) => void;
  onRefresh: () => void;
}

export default function AdminPortal({ bookings, onUpdateStatus, onDeleteBooking, onRefresh }: AdminPortalProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [adminTab, setAdminTab] = useState<'reservations' | 'tables' | 'statistics'>('reservations');
  const [isLoading, setIsLoading] = useState(false);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [stats, setStats] = useState<DashboardStatistics | null>(null);
  
  const [checkingInBooking, setCheckingInBooking] = useState<Booking | null>(null);
  const [availableTables, setAvailableTables] = useState<any[]>([]);

  // Load branches on mount
  useEffect(() => {
    loadBranches();
  }, []);

  // Load statistics when tab changes
  useEffect(() => {
    if (adminTab === 'statistics') {
      loadStatistics();
    }
  }, [adminTab]);

  const loadBranches = async () => {
    setIsLoading(true);
    try {
      const response = await branchesApi.getAll();
      setBranches(response.results || []);
      if (response.results?.length > 0) {
        setSelectedBranchId(response.results[0].id);
      }
    } catch (err) {
      console.error('Failed to load branches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const data = await bookingsApi.getStatistics();
      setStats(data);
    } catch (err) {
      console.error('Failed to load statistics:', err);
    }
  };

  const handleStartCheckIn = async (booking: Booking) => {
    setCheckingInBooking(booking);
    try {
      const response = await fetch(`http://localhost:8000/api/tables/available_tables/?branch_id=${booking.branch}&date=${booking.booking_date}&time=${booking.booking_time}&capacity=${booking.total_guests}`);
      const data = await response.json();
      setAvailableTables(data);
    } catch (err) {
      console.error('Failed to fetch available tables:', err);
    }
  };

  const confirmCheckIn = (tableId: number) => {
    if (checkingInBooking) {
      onUpdateStatus(checkingInBooking.id, 'checked_in', { table_id: tableId });
      setCheckingInBooking(null);
    }
  };

  const selectedBranch = branches.find(b => b.id === selectedBranchId);

  // Zone display mapping
  const zoneDisplayMap: Record<string, string> = {
    indoor: '🛋️ Trong nhà',
    outdoor: '🍃 Ngoài trời',
    mezzanine: '🍸 Tầng lửng',
    kiln: '🔥 Cạnh lò',
  };

  const zoneValueMap: Record<string, string> = {
    indoor: 'Trong nhà',
    outdoor: 'Ngoài trời',
    mezzanine: 'Quầy tầng lửng',
    kiln: 'Cạnh lò củi',
  };

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer_phone.includes(searchQuery) ||
      b.booking_code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ? true : b.status === statusFilter;
    const matchesBranch = selectedBranchId ? b.branch === selectedBranchId : true;
    
    return matchesSearch && matchesStatus && matchesBranch;
  });

  // Calculate statistics
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const checkedInCount = bookings.filter(b => b.status === 'checked_in').length;
  const totalToday = bookings.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed': return 'bg-[#4A4A3E] text-white border-[#4A4A3E]';
      case 'checked_in': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-500 border-gray-200';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      checked_in: 'Đã đến',
      cancelled: 'Đã hủy',
      expired: 'Quá hạn',
    };
    return map[status] || status;
  };

  return (
    <div className="bg-white border border-[#E5E2DA] rounded-xl overflow-hidden shadow-sm text-[#2C2C2C] font-sans max-w-6xl mx-auto my-6">
      
      {/* Admin header */}
      <div className="p-6 md:p-8 bg-[#F9F8F6] border-b border-[#E5E2DA] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4A4A3E] animate-ping"></span>
            <span className="text-[#4A4A3E] font-mono text-[10px] uppercase tracking-widest font-bold">T'PIZZA BACKOFFICE SYSTEM</span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2C2C2C] tracking-tight mt-1">HỆ THỐNG QUẢN LÝ ĐẶT BÀN & ĐIỀU PHỐI CHỖ</h2>
          <p className="text-[#BCB8AF] text-xs mt-1">
            Giao diện kiểm soát trạng thái trực quan — dữ liệu thật từ <strong>Django REST API</strong>
          </p>
        </div>

        {/* Branch selector and refresh */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white p-2.5 border border-[#E5E2DA] rounded-lg">
            <MapPin className="w-4 h-4 text-[#4A4A3E]" />
            <select 
              value={selectedBranchId ?? ''}
              onChange={(e) => setSelectedBranchId(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-[#2C2C2C] focus:outline-none pr-6 cursor-pointer"
            >
              <option value="">Tất cả chi nhánh</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.location})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={onRefresh}
            className="p-2.5 bg-white border border-[#E5E2DA] rounded-lg hover:bg-[#F9F8F6] transition-colors"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4 text-[#4A4A3E]" />
          </button>
        </div>
      </div>

      {/* Internal Menu Tabs */}
      <div className="flex border-b border-[#E5E2DA] bg-[#F9F8F6]">
        <button
          onClick={() => setAdminTab('reservations')}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-4 px-6 text-xs font-mono tracking-widest uppercase transition-all border-b-2 cursor-pointer ${
            adminTab === 'reservations'
              ? 'border-[#4A4A3E] text-[#2C2C2C] bg-white font-bold'
              : 'border-transparent text-[#BCB8AF] hover:text-[#4A4A3E] bg-[#F9F8F6]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Danh Sách Đặt Bàn
        </button>
        <button
          onClick={() => setAdminTab('statistics')}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-4 px-6 text-xs font-mono tracking-widest uppercase transition-all border-b-2 cursor-pointer ${
            adminTab === 'statistics'
              ? 'border-[#4A4A3E] text-[#2C2C2C] bg-white font-bold'
              : 'border-transparent text-[#BCB8AF] hover:text-[#4A4A3E] bg-[#F9F8F6]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Thống Kê & Nguyên Liệu
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6 bg-white min-h-[400px]">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin w-8 h-8 text-[#4A4A3E]" />
          </div>
        )}

        {/* TAB 1: BOOKING MANAGEMENT */}
        {adminTab === 'reservations' && !isLoading && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#F9F8F6] p-4 rounded-lg border border-[#E5E2DA] text-center">
                <span className="text-[10px] text-[#4A4A3E] font-mono block uppercase tracking-wider">Tổng đặt bàn</span>
                <strong className="text-2xl font-serif font-bold text-[#2C2C2C] mt-1 block">{totalToday}</strong>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-center">
                <span className="text-[10px] text-amber-700 font-mono block uppercase tracking-wider">Chờ xác nhận</span>
                <strong className="text-2xl font-serif font-bold text-amber-800 mt-1 block">{pendingCount}</strong>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 text-center">
                <span className="text-[10px] text-emerald-700 font-mono block uppercase tracking-wider">Đã xác nhận</span>
                <strong className="text-2xl font-serif font-bold text-emerald-800 mt-1 block">{confirmedCount}</strong>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                <span className="text-[10px] text-blue-700 font-mono block uppercase tracking-wider">Đã đến</span>
                <strong className="text-2xl font-serif font-bold text-blue-800 mt-1 block">{checkedInCount}</strong>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-[#F9F8F6] p-4 border border-[#E5E2DA] rounded-lg">
              <div className="relative w-full md:flex-1">
                <Search className="w-4 h-4 text-[#BCB8AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, SĐT, hoặc mã booking..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#E5E2DA] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#2C2C2C] placeholder-[#BCB8AF] focus:outline-none focus:border-[#4A4A3E]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'pending', label: 'Chờ xác nhận' },
                  { value: 'confirmed', label: 'Đã xác nhận' },
                  { value: 'checked_in', label: 'Đã đến' },
                  { value: 'cancelled', label: 'Đã hủy' },
                ].map((st) => (
                  <button
                    key={st.value}
                    onClick={() => setStatusFilter(st.value)}
                    className={`py-1.5 px-3 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      statusFilter === st.value
                        ? 'bg-[#4A4A3E] text-white'
                        : 'bg-white border border-[#E5E2DA] text-[#4A4A3E] hover:bg-[#F9F8F6]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white border border-[#E5E2DA] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F9F8F6] border-b border-[#E5E2DA] text-[10px] font-mono text-[#4A4A3E] uppercase tracking-widest font-bold">
                      <th className="p-4">Mã / Thời gian</th>
                      <th className="p-4">Khách hàng / SĐT</th>
                      <th className="p-4">Quy mô</th>
                      <th className="p-4">Khu vực</th>
                      <th className="p-4">Bàn</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2DA] text-xs">
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((bk) => (
                        <tr key={bk.id} className="hover:bg-[#F9F8F6] transition-colors">
                          <td className="p-4 whitespace-nowrap">
                            <button 
                              onClick={() => setViewingBooking(bk)}
                              className="font-bold text-[#4A4A3E] font-mono block hover:underline cursor-pointer"
                            >
                              {bk.booking_code}
                            </button>
                            <span className="text-[10px] text-[#4A4A3E] block mt-1">
                              📅 {bk.booking_date} | ⏱️ {bk.booking_time}
                            </span>
                            <span className="text-[10px] text-[#BCB8AF]">{bk.branch_name}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-[#2C2C2C] block">{bk.customer_name}</span>
                            <span className="text-[10px] text-[#4A4A3E]">📞 {bk.customer_phone}</span>
                            <span className="text-[10px] text-[#BCB8AF] block">{bk.customer_email}</span>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            👤 {bk.adult_count} NL, {bk.children_count} TE
                            <br />
                            <span className="text-[10px] text-[#BCB8AF]">Tổng: {bk.total_guests} khách</span>
                          </td>
                          <td className="p-4">
                            <span className="bg-[#F9F8F6] text-[#4A4A3E] py-1 px-2.5 rounded border border-[#E5E2DA] text-[10px]">
                              {zoneDisplayMap[bk.zone_preference] || bk.zone_preference}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-mono font-bold text-[#4A4A3E]">
                              {bk.table_number ? `Bàn ${bk.table_number}` : '—'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block py-1 px-2.5 rounded-sm text-[10px] font-mono uppercase font-bold border ${getStatusBadge(bk.status)}`}>
                              {getStatusLabel(bk.status)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-1 flex-wrap">
                              {bk.status === 'pending' && (
                                <button
                                  onClick={() => onUpdateStatus(bk.id, 'confirmed')}
                                  className="bg-[#4A4A3E] text-white hover:bg-[#32322A] font-bold py-1 px-2.5 rounded-sm text-[10px] transition-all cursor-pointer"
                                >
                                  Xác nhận
                                </button>
                              )}
                              {bk.status === 'confirmed' && (
                                <button
                                  onClick={() => handleStartCheckIn(bk)}
                                  className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold py-1 px-2.5 rounded-sm text-[10px] transition-all cursor-pointer"
                                >
                                  Check-in
                                </button>
                              )}
                              {['pending', 'confirmed'].includes(bk.status) && (
                                <>
                                  <button
                                    onClick={() => onUpdateStatus(bk.id, 'cancelled')}
                                    className="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-1 px-2 rounded-sm text-[10px] transition-all cursor-pointer"
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    onClick={() => onUpdateStatus(bk.id, 'expired')}
                                    className="bg-white border border-[#E5E2DA] text-[#4A4A3E] hover:bg-neutral-50 font-semibold py-1 px-2 rounded-sm text-[10px] transition-all cursor-pointer"
                                  >
                                    No-Show
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => onDeleteBooking(bk.id)}
                                className="bg-white hover:bg-red-50 text-red-600 p-1.5 rounded-sm border border-[#E5E2DA] transition-colors cursor-pointer"
                                title="Xóa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-[#BCB8AF] font-mono text-xs">
                          {searchQuery || statusFilter !== 'all'
                            ? 'Không tìm thấy kết quả phù hợp.'
                            : 'Chưa có đặt bàn nào.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Check-in / Table Assignment Modal */}
        {checkingInBooking && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-down">
              <div className="p-6 border-b border-[#E5E2DA] flex justify-between items-center">
                <h3 className="font-serif font-bold text-xl">Điều bàn & Check-in</h3>
                <button onClick={() => setCheckingInBooking(null)}><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6">
                <p className="text-xs text-[#4A4A3E] mb-4">
                  Chọn bàn trống cho <span className="font-bold">{checkingInBooking.customer_name}</span> ({checkingInBooking.total_guests} khách):
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {availableTables.length > 0 ? (
                    availableTables.map((table) => (
                      <button
                        key={table.id}
                        onClick={() => confirmCheckIn(table.id)}
                        className="w-full flex items-center justify-between p-3 border border-[#E5E2DA] rounded-xl hover:border-[#4A4A3E] hover:bg-[#F9F8F6] transition-all group"
                      >
                        <div className="text-left">
                          <span className="font-mono font-bold text-sm">Bàn {table.table_number}</span>
                          <div className="text-[10px] text-[#BCB8AF] uppercase tracking-wider">
                            {table.zone_display} • Sức chứa: {table.capacity}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#BCB8AF] group-hover:text-[#4A4A3E]" />
                      </button>
                    ))
                  ) : (
                    <div className="py-8 text-center bg-red-50 rounded-xl border border-red-100">
                      <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <p className="text-xs text-red-600 font-bold">Không còn bàn trống phù hợp!</p>
                      <p className="text-[10px] text-red-500 mt-1">Vui lòng kiểm tra lại sơ đồ bàn.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 bg-[#F9F8F6] text-right">
                <button 
                  onClick={() => setCheckingInBooking(null)}
                  className="text-xs font-bold text-[#4A4A3E] uppercase tracking-widest"
                >Hủy bỏ</button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details Modal */}
        {viewingBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-[#E5E2DA] flex justify-between items-center bg-[#F9F8F6]">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#2C2C2C]">Chi tiết đặt bàn</h3>
                  <p className="text-[10px] font-mono text-[#4A4A3E] mt-1 uppercase tracking-widest">{viewingBooking.booking_code}</p>
                </div>
                <button onClick={() => setViewingBooking(null)} className="p-2 hover:bg-[#E5E2DA] rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#BCB8AF] uppercase font-bold">Khách hàng</p>
                    <p className="text-sm font-bold">{viewingBooking.customer_name}</p>
                    <p className="text-xs text-[#4A4A3E]">{viewingBooking.customer_phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#BCB8AF] uppercase font-bold">Thời gian</p>
                    <p className="text-sm font-bold">{viewingBooking.booking_time}</p>
                    <p className="text-xs text-[#4A4A3E]">{viewingBooking.booking_date}</p>
                  </div>
                </div>
                <div className="p-4 bg-[#F9F8F6] rounded-xl border border-[#E5E2DA] space-y-3">
                   <div>
                      <p className="text-[10px] text-[#4A4A3E] font-bold uppercase mb-1">Yêu cầu đặc biệt</p>
                      <p className="text-sm text-[#2C2C2C] italic">
                        {viewingBooking.special_requests || "Không có yêu cầu đặc biệt."}
                      </p>
                   </div>
                   <div className="pt-2 border-t border-[#E5E2DA]">
                      <p className="text-[10px] text-[#4A4A3E] font-bold uppercase mb-1">Ghi chú nội bộ / Khách hàng</p>
                      <p className="text-sm text-[#2C2C2C]">
                        {viewingBooking.customer_notes || "Trống."}
                      </p>
                   </div>
                </div>
              </div>
              <div className="p-4 bg-[#F9F8F6] border-t border-[#E5E2DA] flex justify-end">
                <button onClick={() => setViewingBooking(null)} className="px-6 py-2 bg-[#4A4A3E] text-white rounded-lg text-sm font-bold">Đóng</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STATISTICS */}
        {adminTab === 'statistics' && (
          <div className="space-y-6">
            {stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stats Cards */}
                <div className="bg-[#F9F8F6] border border-[#E5E2DA] rounded-lg p-5 space-y-4">
                  <h3 className="text-[#2C2C2C] font-serif font-bold text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#4A4A3E]" />
                    Tổng quan
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-[#E5E2DA]">
                      <span className="text-[10px] text-[#BCB8AF] font-mono">Tổng đặt bàn</span>
                      <div className="text-xl font-bold text-[#2C2C2C]">{stats.total_bookings}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#E5E2DA]">
                      <span className="text-[10px] text-[#BCB8AF] font-mono">Tổng khách</span>
                      <div className="text-xl font-bold text-[#2C2C2C]">{stats.total_guests}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-amber-200">
                      <span className="text-[10px] text-amber-700 font-mono">Chờ xác nhận</span>
                      <div className="text-xl font-bold text-amber-800">{stats.pending_confirmations}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 font-mono">Đã đến</span>
                      <div className="text-xl font-bold text-emerald-800">{stats.checked_in_count}</div>
                    </div>
                  </div>
                </div>

                {/* Zone Distribution */}
                <div className="bg-[#F9F8F6] border border-[#E5E2DA] rounded-lg p-5 space-y-4">
                  <h3 className="text-[#2C2C2C] font-serif font-bold text-sm">Phân bố khu vực</h3>
                  <div className="space-y-3">
                    {Object.entries(stats.zone_distribution).map(([zone, count]) => {
                      const total = Object.values(stats.zone_distribution).reduce((a, b) => a + b, 0);
                      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                      return (
                        <div key={zone} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{zoneValueMap[zone] || zone}</span>
                            <span className="font-mono font-bold">{count} ({pct}%)</span>
                          </div>
                          <div className="bg-white h-2 rounded-full overflow-hidden border border-[#E5E2DA]">
                            <div className="bg-[#4A4A3E] h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                    {Object.keys(stats.zone_distribution).length === 0 && (
                      <p className="text-xs text-[#BCB8AF] text-center py-4">Chưa có dữ liệu</p>
                    )}
                  </div>
                </div>

                {/* Hourly Distribution */}
                <div className="bg-[#F9F8F6] border border-[#E5E2DA] rounded-lg p-5 md:col-span-2">
                  <h3 className="text-[#2C2C2C] font-serif font-bold text-sm mb-4">Phân bố theo giờ</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.hourly_distribution)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([hour, count]) => {
                        const maxCount = Math.max(...Object.values(stats.hourly_distribution), 1);
                        const pct = (count / maxCount) * 100;
                        return (
                          <div key={hour} className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-[#4A4A3E] w-12 text-right">{hour}</span>
                            <div className="flex-1 bg-white h-5 border border-[#E5E2DA] rounded overflow-hidden relative">
                              <div className="h-full bg-[#4A4A3E] transition-all" style={{ width: `${Math.max(3, pct)}%` }} />
                              {count > 0 && (
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-[#4A4A3E]">
                                  {count} khách
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Ingredient Estimator */}
                <div className="bg-[#4A4A3E]/5 border border-[#E5E2DA] rounded-lg p-5 md:col-span-2">
                  <h4 className="text-[#2C2C2C] font-serif font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#4A4A3E]" />
                    Ước lượng nguyên liệu (T'Pizza Smart Engine)
                  </h4>
                  <div className="text-xs text-[#4A4A3E] space-y-2 leading-relaxed mt-3">
                    <p>
                      Dựa trên <strong className="text-[#2C2C2C]">{stats.total_guests}</strong> khách đang hoạt động:
                    </p>
                    <ul className="list-disc ml-5 space-y-1.5 mt-2.5 font-mono text-[11px]">
                      <li>🍕 Pizza cần chuẩn bị: <strong className="text-[#2C2C2C]">{Math.ceil(stats.total_guests * 0.75)} mẻ bánh</strong></li>
                      <li>🧀 Phô mai tươi: <strong className="text-[#2C2C2C]">{Math.ceil(stats.total_guests * 0.5)} quả</strong></li>
                      <li>🪵 Củi đun: <strong className="text-[#2C2C2C]">{Math.ceil(stats.total_guests * 0.2)} kg</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin w-8 h-8 text-[#4A4A3E]" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
