import React, { useState } from 'react';
import { 
  Users, Calendar, Clock, MapPin, Search, Filter, CheckCircle, 
  XCircle, CheckCircle2, AlertTriangle, ChevronRight, BarChart3, 
  Trash2, RefreshCw, LayoutGrid, Check, Settings, Eye, Info
} from 'lucide-react';
import { Booking, Branch, Table } from '../types';
import { BRANCHES, generateTables } from '../data';

interface AdminPortalProps {
  bookings: Booking[];
  onUpdateStatus: (bookingId: string, newStatus: Booking['status']) => void;
  onDeleteBooking: (bookingId: string) => void;
}

export default function AdminPortal({ bookings, onUpdateStatus, onDeleteBooking }: AdminPortalProps) {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('b1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');
  
  // Tab within Admin: 'reservations' or 'tables' or 'statistics'
  const [adminTab, setAdminTab] = useState<'reservations' | 'tables' | 'statistics'>('reservations');

  // Find currently selected branch
  const selectedBranch = BRANCHES.find(b => b.id === selectedBranchId) || BRANCHES[0];

  // Table map generation for selected branch
  const branchTables = generateTables(selectedBranchId);

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'Tất cả' ? true : b.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics for the active branch/bookings
  const totalBookedGuests = bookings
    .filter(b => b.status !== 'Đã hủy')
    .reduce((acc, curr) => acc + curr.adultsCount + curr.childrenCount, 0);

  const pendingConfirmationCount = bookings.filter(b => b.status === 'Chờ xác nhận').length;
  const activeReservationsCount = bookings.filter(b => b.status === 'Đã xác nhận').length;
  const checkedInCount = bookings.filter(b => b.status === 'Đã đến').length;

  // Hourly distribution computation
  const getHourlyStats = () => {
    const hourlyCounts: Record<string, number> = {
      '11:00': 0, '11:30': 0, '12:00': 0, '12:30': 0, '13:00': 0, '13:30': 0,
      '17:00': 0, '17:30': 0, '18:00': 0, '18:30': 0, '19:00': 0, '19:30': 0,
      '20:00': 0, '20:30': 0, '21:00': 0
    };

    bookings.forEach(b => {
      if (b.status !== 'Đã hủy') {
        const hourKey = b.time;
        if (hourlyCounts[hourKey] !== undefined) {
          hourlyCounts[hourKey] += (b.adultsCount + b.childrenCount);
        } else {
          // Fallback approximate matching
          const baseHour = b.time.substring(0, 5);
          if (hourlyCounts[baseHour] !== undefined) {
            hourlyCounts[baseHour] += (b.adultsCount + b.childrenCount);
          }
        }
      }
    });

    return Object.entries(hourlyCounts).map(([hour, count]) => ({ hour, count }));
  };

  const hourlyStats = getHourlyStats();
  const maxHourlyCount = Math.max(...hourlyStats.map(h => h.count), 1);

  // Zone utilization count
  const getZoneStats = () => {
    const zones = {
      'Trong nhà': 0,
      'Ngoài trời': 0,
      'Quầy tầng lửng': 0,
      'Cạnh lò củi': 0
    };

    bookings.forEach(b => {
      if (b.status !== 'Đã hủy') {
        if (b.zonePreference && b.zonePreference !== 'Bất kỳ' && zones[b.zonePreference as keyof typeof zones] !== undefined) {
          zones[b.zonePreference as keyof typeof zones] += (b.adultsCount + b.childrenCount);
        } else {
          // distribute generic to Trong nhà
          zones['Trong nhà'] += (b.adultsCount + b.childrenCount);
        }
      }
    });

    return Object.entries(zones).map(([zone, count]) => ({ zone, count }));
  };

  const zoneDistribution = getZoneStats();

  const getStatusBadgeStyles = (status: Booking['status']) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'bg-[#4A4A3E]/10 text-[#4A4A3E] border-[#E5E2DA]';
      case 'Đã xác nhận':
        return 'bg-[#4A4A3E] text-white border-[#4A4A3E]';
      case 'Đã đến':
        return 'bg-[#F9F8F6] text-[#2C2C2C] border-[#E5E2DA]';
      case 'Đã hủy':
        return 'bg-red-50 text-red-600 border-red-150';
      case 'Quá hạn':
        return 'bg-neutral-50 text-[#BCB8AF] border-neutral-200';
      default:
        return 'bg-neutral-50 text-[#BCB8AF] border-neutral-200';
    }
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
            Giao diện kiểm soát trạng thái trực quan, theo dõi sức chứa của {BRANCHES.length} chi nhánh và thống kê nguyên liệu cần thiết.
          </p>
        </div>

        {/* Quick branch switcher menu selection */}
        <div className="flex items-center gap-3 bg-white p-2.5 border border-[#E5E2DA] rounded-lg">
          <MapPin className="w-4 h-4 text-[#4A4A3E]" />
          <select 
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="bg-transparent text-xs font-bold text-[#2C2C2C] focus:outline-none pr-6 cursor-pointer"
          >
            {BRANCHES.map(b => (
              <option key={b.id} value={b.id} className="bg-white text-[#2C2C2C]">
                {b.name} ({b.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Internal Menu Tabs */}
      <div className="flex border-b border-[#E5E2DA] bg-[#F9F8F6]">
        <button
          onClick={() => setAdminTab('reservations')}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-4 px-6 text-xs font-mono tracking-widest uppercase transition-all border-b-2 cursor-pointer ${
            adminTab === 'reservations'
              ? 'border-[#4A4A3E] text-[#2C2C2C] bg-white font-bold'
              : 'border-transparent text-[#BCB8AF] hover:text-[#4A4A3E] hover:bg-[#F9F8F6]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Danh Sách Đặt Bàn
        </button>
        <button
          onClick={() => setAdminTab('tables')}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-4 px-6 text-xs font-mono tracking-widest uppercase transition-all border-b-2 cursor-pointer ${
            adminTab === 'tables'
              ? 'border-[#4A4A3E] text-[#2C2C2C] bg-white font-bold'
              : 'border-transparent text-[#BCB8AF] hover:text-[#4A4A3E] hover:bg-[#F9F8F6]'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Sơ Đồ Phân Bàn
        </button>
        <button
          onClick={() => setAdminTab('statistics')}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-4 px-6 text-xs font-mono tracking-widest uppercase transition-all border-b-2 cursor-pointer ${
            adminTab === 'statistics'
              ? 'border-[#4A4A3E] text-[#2C2C2C] bg-white font-bold'
              : 'border-transparent text-[#BCB8AF] hover:text-[#4A4A3E] hover:bg-[#F9F8F6]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Analytics & Nguyên liệu
        </button>
      </div>

      {/* Main Container workspace */}
      <div className="p-6 bg-white h-auto">
        
        {/* TAB 1: BOOKING MANAGEMENT LIST */}
        {adminTab === 'reservations' && (
          <div className="space-y-6">
            
            {/* Quick Stats Line */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#F9F8F6] p-4 rounded-lg border border-[#E5E2DA] text-center animate-fade-in">
                <span className="text-[10px] text-[#4A4A3E] font-mono block uppercase tracking-wider">Tổng Đăng ký hôm nay</span>
                <strong className="text-2xl font-serif font-bold text-[#2C2C2C] mt-1 block">{bookings.length} lượt</strong>
              </div>
              <div className="bg-[#4A4A3E]/5 p-4 rounded-lg border border-[#E5E2DA] text-center animate-fade-in">
                <span className="text-[10px] text-[#4A4A3E] font-mono block uppercase tracking-wider">Chờ xác nhận</span>
                <strong className="text-2xl font-serif font-bold text-[#4A4A3E] mt-1 block">{pendingConfirmationCount} bàn</strong>
              </div>
              <div className="bg-[#4A4A3E]/5 p-4 rounded-lg border border-[#E5E2DA] text-center animate-fade-in">
                <span className="text-[10px] text-[#4A4A3E] font-mono block uppercase tracking-wider">Đã xác nhận sẵn sàng</span>
                <strong className="text-2xl font-serif font-bold text-[#4A4A3E] mt-1 block">{activeReservationsCount} bàn</strong>
              </div>
              <div className="bg-[#F9F8F6] p-4 rounded-lg border border-[#E5E2DA] text-center animate-fade-in">
                <span className="text-[10px] text-[#4A4A3E] font-mono block uppercase tracking-wider">Khách đã đến</span>
                <strong className="text-2xl font-serif font-bold text-[#2C2C2C] mt-1 block">{checkedInCount} khách</strong>
              </div>
            </div>

            {/* Filter toolbars */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-[#F9F8F6] p-4 border border-[#E5E2DA] rounded-lg">
              <div className="relative w-full md:flex-1">
                <Search className="w-4 h-4 text-[#BCB8AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên Khách hàng, SĐT, hoặc Mã booking Code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#E5E2DA] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#2C2C2C] placeholder-[#BCB8AF] focus:outline-none focus:border-[#4A4A3E] font-sans"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                <span className="text-[10px] font-mono text-[#4A4A3E] uppercase mr-1.5 hidden md:inline">Trạng thái:</span>
                {['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đã đến', 'Đã hủy', 'Quá hạn'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`py-1.5 px-3 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#4A4A3E] text-white'
                        : 'bg-white border border-[#E5E2DA] text-[#4A4A3E] hover:bg-[#F9F8F6]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings log table list */}
            <div className="bg-white border border-[#E5E2DA] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F9F8F6] border-b border-[#E5E2DA] text-[10px] font-mono text-[#4A4A3E] uppercase tracking-widest font-bold">
                      <th className="p-4">Mã Booking / Thời gian</th>
                      <th className="p-4">Khách hàng / SĐT</th>
                      <th className="p-4">Quy mô Nhóm</th>
                      <th className="p-4">Yêu cầu Vị trí</th>
                      <th className="p-4">Xếp Bàn ăn</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-center">Cập Nhật Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2DA] text-xs">
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((bk) => (
                        <tr key={bk.id} className="hover:bg-[#F9F8F6] transition-colors">
                          <td className="p-4 whitespace-nowrap">
                            <span className="font-bold text-[#2C2C2C] font-mono block tracking-tight">{bk.bookingCode}</span>
                            <span className="text-[10px] text-[#4A4A3E] block mt-1">📅 {bk.date} | ⏱️ {bk.time}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-[#2C2C2C] block">{bk.customerName}</span>
                            <span className="text-[10px] text-[#4A4A3E] font-mono" title={bk.customerEmail}>
                              📞 {bk.customerPhone}
                            </span>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className="text-[#2C2C2C]">👥 {bk.adultsCount} Lớn, {bk.childrenCount} Nhỏ</span>
                          </td>
                          <td className="p-4">
                            <span className="bg-[#F9F8F6] text-[#4A4A3E] py-1 px-2.5 rounded border border-[#E5E2DA] text-[10px]">
                              {bk.zonePreference}
                            </span>
                            {bk.specialRequests.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {bk.specialRequests.map(r => (
                                  <span key={r} className="text-[8px] bg-[#4A4A3E]/10 border border-[#E5E2DA] text-[#4A4A3E] rounded px-1font-bold">
                                    {r}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="font-mono font-bold text-[#4A4A3E]">
                              {bk.tableNumber ? `Bàn ${bk.tableNumber}` : 'Chưa xếp'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block py-1 px-2.5 rounded-sm text-[10px] font-mono uppercase font-bold border ${getStatusBadgeStyles(bk.status)}`}>
                              {bk.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-1 flex-wrap">
                              {bk.status === 'Chờ xác nhận' && (
                                <button
                                  onClick={() => onUpdateStatus(bk.id, 'Đã xác nhận')}
                                  className="bg-white border border-[#E5E2DA] text-[#4A4A3E] hover:bg-[#F9F8F6] font-bold py-1 px-2.5 rounded-sm text-[10px] transition-all cursor-pointer"
                                  title="Xác nhận mã OTP hợp lệ"
                                >
                                  Xác nhận
                                </button>
                              )}
                              {bk.status === 'Đã xác nhận' && (
                                <button
                                  onClick={() => onUpdateStatus(bk.id, 'Đã đến')}
                                  className="bg-[#4A4A3E] text-white hover:bg-[#32322A] font-bold py-1 px-2.5 rounded-sm text-[10px] transition-all cursor-pointer"
                                  title="Đánh dấu khách đã tới dùng bữa"
                                >
                                  Check-in
                                </button>
                              )}
                              {['Chờ xác nhận', 'Đã xác nhận'].includes(bk.status) && (
                                <>
                                  <button
                                    onClick={() => onUpdateStatus(bk.id, 'Đã hủy')}
                                    className="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-1 px-2 rounded-sm text-[10px] transition-all cursor-pointer"
                                    title="Hủy lịch đặt bàn"
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    onClick={() => onUpdateStatus(bk.id, 'Quá hạn')}
                                    className="bg-white border border-[#E5E2DA] text-[#4A4A3E] hover:bg-neutral-50 font-semibold py-1 px-2 rounded-sm text-[10px] transition-all cursor-pointer"
                                    title="Khách không đến (No-show)"
                                  >
                                    No-Show
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => onDeleteBooking(bk.id)}
                                className="bg-white hover:bg-red-50 text-red-600 p-1.5 rounded-sm border border-[#E5E2DA] transition-colors cursor-pointer"
                                title="Xóa lịch đặt bàn"
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
                          Chưa ghi nhận đơn đặt lịch bàn nào thỏa mãn bộ lọc hiện tại.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE TABLE MAP GRID */}
        {adminTab === 'tables' && (
          <div className="space-y-6">
            <div className="p-4 bg-[#F9F8F6] border border-[#E5E2DA] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-[#2C2C2C] font-serif font-bold text-sm">Sơ đồ bố trí Bàn ăn & Sức chứa tương ứng</h3>
                <p className="text-xs text-[#BCB8AF] mt-0.5">
                  Nhấp vào bàn ăn để xem chi tiết thông tin và xem các ca giờ đã được xếp lịch trước đó.
                </p>
              </div>

              {/* Zone legends */}
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#4A4A3E]">
                  <span className="w-3 h-3 rounded bg-white border border-[#E5E2DA]"></span> Trống (Available)
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#4A4A3E]">
                  <span className="w-3 h-3 rounded bg-[#4A4A3E]/10 border border-[#4A4A3E] animate-pulse"></span> Đã Đặt (Reserved)
                </span>
              </div>
            </div>

            {/* Group Tables by Zone in Grid visual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Trong nhà', 'Ngoài trời', 'Quầy tầng lửng', 'Cạnh lò củi'].map((zoneName) => {
                const zoneTables = branchTables.filter(t => t.zone === zoneName);
                
                return (
                  <div key={zoneName} className="bg-[#F9F8F6] border border-[#E5E2DA] rounded-lg p-5 space-y-4">
                    <h4 className="text-xs text-[#4A4A3E] font-mono font-bold tracking-widest uppercase border-b border-[#E5E2DA] pb-2">
                      Khu vực: {zoneName} ({zoneTables.length} bàn mẫu)
                    </h4>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {zoneTables.map((tbl) => {
                        // See if there's any active booking assigned to this table number in selected date
                        const activeAssignedReservation = bookings.find(b => 
                          b.branchId === selectedBranchId && 
                          b.tableNumber === tbl.table_number && 
                          ['Đã xác nhận', 'Đã đến', 'Chờ xác nhận'].includes(b.status)
                        );
                        
                        return (
                          <div
                            key={tbl.id}
                            className={`p-3 rounded-lg border text-center transition-all cursor-default ${
                              activeAssignedReservation
                                ? 'bg-[#4A4A3E]/10 border-[#4A4A3E] text-[#2C2C2C] shadow-sm'
                                : 'bg-white border-[#E5E2DA] hover:border-[#4A4A3E] text-[#4A4A3E]'
                            }`}
                          >
                            <span className="text-lg font-bold font-mono block tracking-tight">
                              {tbl.table_number}
                            </span>
                            <span className="text-[9px] text-[#BCB8AF] font-mono block mt-0.5">
                              {tbl.capacity} chỗ ngồi
                            </span>

                            {activeAssignedReservation ? (
                              <div className="mt-2 pt-1 border-t border-[#4A4A3E]/25 text-[8px] font-mono leading-tight truncate text-[#2C2C2C]">
                                👤 {activeAssignedReservation.customerName.split(' ').pop()} <br/>
                                ⏱️ {activeAssignedReservation.time}
                              </div>
                            ) : (
                              <div className="mt-2 pt-1 border-t border-neutral-100 text-[8px] font-mono text-emerald-600 font-bold">
                                🟢 Sẵn sàng
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: STATISTICS & FOOD INGREDIENT ESTIMATION */}
        {adminTab === 'statistics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Daily / Hourly Traffic Load Bar Chart */}
              <div className="bg-[#F9F8F6] border border-[#E5E2DA] rounded-lg p-5 space-y-4">
                <h3 className="text-[#2C2C2C] font-serif font-bold text-sm flex items-center gap-2">
                  <BarChart3 className="w-4.5 h-4.5 text-[#4A4A3E]" />
                  Biểu đồ Mật độ Lượt khách đón tiếp theo Ca giờ
                </h3>
                <p className="text-xs text-[#4A4A3E] opacity-90 leading-relaxed">
                  Trực quan hóa lượng khách theo các khung giờ 30 phút trong ngày. Hỗ trợ Quản lý sắp xếp ca trực của nhân viên nặn pizza.
                </p>

                {/* SVG Bar Chart simulator */}
                <div className="pt-6 space-y-2">
                  {hourlyStats.map(({ hour, count }) => {
                    const pct = (count / maxHourlyCount) * 100;
                    return (
                      <div key={hour} className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-[#4A4A3E] w-12 text-right">{hour}</span>
                        <div className="flex-1 bg-white h-5 border border-[#E5E2DA] rounded overflow-hidden relative">
                          <div 
                            className="h-full transition-all duration-500 bg-[#4A4A3E]"
                            style={{ width: `${Math.max(3, pct)}%` }}
                          />
                          {count > 0 && (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-[#4A4A3E]">
                              {count} người
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Zone Utilization Pie Chart style */}
              <div className="space-y-6">
                <div className="bg-[#F9F8F6] border border-[#E5E2DA] rounded-lg p-5 space-y-4">
                  <h3 className="text-[#2C2C2C] font-serif font-bold text-sm">Tỷ lệ Lựa chọn các Phân Phù Hợp seating</h3>
                  <p className="text-xs text-[#BCB8AF]">
                    Phân bố mật độ khách muốn được ngồi ở khu vực cụ thể để điều phối điều hòa và ánh sáng.
                  </p>

                  <div className="space-y-4 pt-2">
                    {zoneDistribution.map(({ zone, count }) => {
                      const totalGuests = Math.max(1, zoneDistribution.reduce((a, b) => a + b.count, 0));
                      const pct = Math.round((count / totalGuests) * 100);
                      return (
                        <div key={zone} className="space-y-1.5 animate-fade-in">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-[#2C2C2C]">{zone}</span>
                            <span className="font-mono text-[#4A4A3E] font-bold">{count} người ({pct}%)</span>
                          </div>
                          <div className="bg-white h-2 rounded-full overflow-hidden border border-[#E5E2DA]">
                            <div 
                              className="bg-[#4A4A3E] h-full rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pizza Ingredient Auto calculator */}
                <div className="bg-[#4A4A3E]/5 border border-[#E5E2DA] rounded-lg p-5 space-y-4">
                  <h4 className="text-[#2C2C2C] font-serif font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                    <Info className="w-4.5 h-4.5 text-[#4A4A3E]" />
                    Thống kê ước lượng Nguyên liệu Chuẩn bị (T'Pizza Smart Engine)
                  </h4>
                  <div className="text-xs text-[#4A4A3E] space-y-2 leading-relaxed">
                    <p>
                      Mỗi khách đặt bàn trung bình tiêu thụ <strong>0.75 chiếc Pizza lò đun</strong> và <strong>0.5 phần phô mai tươi Burrata</strong> tự sản xuất. 
                      Dựa trên lịch đặt chỗ hôm nay (<strong className="text-[#2C2C2C] font-bold">{totalBookedGuests} khách hoạt động</strong>):
                    </p>
                    <ul className="list-disc ml-5 space-y-1.5 mt-2.5 font-mono text-[11px] text-[#4A4A3E]">
                      <li>🍕 Pizza dăm lạt: ước tính cần sẵn sàng <strong className="text-[#2C2C2C] font-bold">{Math.ceil(totalBookedGuests * 0.75)} mẻ bánh</strong> bột chua.</li>
                      <li>🧀 Phô mai tươi Burrata / Mozzarella: cần chuẩn bị <strong className="text-[#2C2C2C] font-bold">{Math.ceil(totalBookedGuests * 0.5)} quả phô mai</strong> trong ngày.</li>
                      <li>🪵 Củi dăm đun sồi khô: cần tiếp nguyên liệu <strong className="text-[#2C2C2C] font-bold">{Math.ceil(totalBookedGuests * 0.2)} kg củi khô</strong> cho lò pizza hoạt động hết công suất.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
