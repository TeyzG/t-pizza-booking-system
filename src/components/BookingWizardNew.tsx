import React, { useState, useEffect } from 'react';
import {
  MapPin, Calendar as CalendarIcon, Users, Check, ArrowRight, ArrowLeft,
  Phone, AlertCircle, Loader, CheckCircle2, Info, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { branchesApi, bookingsApi } from '../api/client';

interface Branch {
  id: number;
  name: string;
  location: string;
  address: string;
  phone: string;
  image_url: string;
  rating: number;
  status: string;
}

interface Booking {
  id: number;
  booking_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  branch: number;
  booking_date: string;
  booking_time: string;
  adult_count: number;
  children_count: number;
  zone_preference: string;
  special_requests: string;
  customer_notes: string;
  status: string;
}

interface BookingWizardProps {
  onBookingSuccess?: (booking: Booking) => void;
}

export default function BookingWizard({ onBookingSuccess }: BookingWizardProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Data
  const [branches, setBranches] = useState<Branch[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Form states
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [zonePreference, setZonePreference] = useState('indoor');
  
  // Contact info (pre-filled from user)
  const [fullName, setFullName] = useState(user?.first_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  // Results
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Load branches on mount
  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setIsLoading(true);
      const response = await branchesApi.getAll();
      const branchList = response.results || response;
      setBranches(Array.isArray(branchList) ? branchList : []);
      
      // Extract unique locations
      const uniqueLocations = [...new Set(branchList.map((b: Branch) => b.location))];
      setLocations(uniqueLocations as string[]);
      
      if (uniqueLocations.length > 0) {
        setSelectedLocation(uniqueLocations[0] as string);
      }
    } catch (err: any) {
      setError('Không thể tải danh sách chi nhánh: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBranches = branches.filter(b => 
    b.location === selectedLocation && b.status !== 'maintenance'
  );

  useEffect(() => {
    if (filteredBranches.length > 0 && !selectedBranch) {
      setSelectedBranch(filteredBranches[0]);
    }
  }, [selectedLocation]);

  // Generate date options (next 14 days)
  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const dateOptions = getDateOptions();

  // Generate time slots
  const getTimeSlots = () => {
    const slots = [];
    // Lunch: 11:00-14:30
    for (let h = 11; h <= 14; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 14 && m > 0) continue;
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    // Dinner: 17:00-22:00
    for (let h = 17; h <= 21; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 21 && m > 30) continue;
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };

  const timeSlots = getTimeSlots();

  const handleCreateBooking = async () => {
    setError('');

    if (!fullName.trim()) {
      setError('Vui lòng nhập họ tên');
      return;
    }
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    if (!selectedBranch) {
      setError('Vui lòng chọn chi nhánh');
      return;
    }
    if (!selectedDate) {
      setError('Vui lòng chọn ngày');
      return;
    }
    if (!selectedTime) {
      setError('Vui lòng chọn giờ');
      return;
    }

    try {
      setIsLoading(true);

      const bookingData = {
        branch: selectedBranch.id,
        booking_date: selectedDate,
        booking_time: selectedTime,
        adult_count: adults,
        children_count: children,
        zone_preference: zonePreference,
        special_requests: specialRequests,
        customer_notes: customerNotes,
      };

      const response = await bookingsApi.create(bookingData);
      setCreatedBooking(response);
      onBookingSuccess?.(response);
      setStep(4); // Success screen
    } catch (err: any) {
      setError('Lỗi tạo đặt bàn: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const zones = [
    { value: 'indoor', label: '🛋️ Trong nhà' },
    { value: 'outdoor', label: '🍃 Ngoài trời' },
    { value: 'mezzanine', label: '🍸 Tầng lửng' },
    { value: 'kiln', label: '🔥 Cạnh lò' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Step indicator */}
      <div className="mb-8 flex justify-between items-center max-w-2xl mx-auto">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <button
              onClick={() => s < step && setStep(s)}
              disabled={s > step}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                step === s
                  ? 'bg-[#4A4A3E] border-[#4A4A3E] text-white'
                  : step > s
                    ? 'bg-white border-[#4A4A3E] text-[#4A4A3E]'
                    : 'bg-white border-[#E5E2DA] text-[#BCB8AF]'
              }`}
            >
              {step > s ? <Check size={20} /> : s}
            </button>
            {s < 3 && (
              <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-[#4A4A3E]' : 'bg-[#E5E2DA]'}`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="bg-white border border-[#E5E2DA] rounded-2xl p-6 md:p-8 shadow-sm">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Step 1: Select Branch */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6 flex items-center gap-2">
              <MapPin size={24} className="text-[#4A4A3E]" />
              Chọn Chi Nhánh
            </h2>

            {/* Location tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
                    selectedLocation === loc
                      ? 'bg-[#4A4A3E] text-white border-[#4A4A3E]'
                      : 'bg-white text-[#4A4A3E] border-[#E5E2DA] hover:border-[#4A4A3E]'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            {/* Branch list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {isLoading ? (
                <div className="col-span-2 flex items-center justify-center py-12">
                  <Loader className="animate-spin w-8 h-8 text-[#4A4A3E]" />
                </div>
              ) : filteredBranches.length > 0 ? (
                filteredBranches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch)}
                    className={`p-4 border rounded-lg text-left transition-all ${
                      selectedBranch?.id === branch.id
                        ? 'border-[#4A4A3E] bg-[#4A4A3E]/5 ring-1 ring-[#4A4A3E]'
                        : 'border-[#E5E2DA] hover:border-[#4A4A3E]'
                    }`}
                  >
                    <div className="font-bold text-[#2C2C2C] mb-1">{branch.name}</div>
                    <div className="text-xs text-[#4A4A3E] flex items-start gap-1 mb-2">
                      <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="text-xs text-[#BCB8AF] flex items-center gap-2">
                      <Phone size={14} /> {branch.phone}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="font-semibold text-amber-600">★ {branch.rating}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">
                        {branch.status === 'active' ? 'Hoạt động' : 'Bận'}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-[#BCB8AF]">
                  Không tìm thấy chi nhánh
                </div>
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!selectedBranch}
              className="w-full py-3 bg-[#4A4A3E] text-white rounded-lg font-bold disabled:bg-gray-400 hover:bg-[#2C2C2C] transition-all flex items-center justify-center gap-2"
            >
              Tiếp Tục <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* Step 2: Select Details */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6 flex items-center gap-2">
              <Users size={24} className="text-[#4A4A3E]" />
              Chi Tiết Đặt Bàn
            </h2>

            <div className="space-y-4 mb-6">
              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Số khách</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-[#4A4A3E] block mb-1">Người lớn</label>
                    <div className="flex items-center border border-[#E5E2DA] rounded-lg">
                      <button onClick={() => setAdults(Math.max(1, adults - 1))} className="px-3 py-2 text-[#4A4A3E]">−</button>
                      <span className="flex-1 text-center font-bold">{adults}</span>
                      <button onClick={() => setAdults(adults + 1)} className="px-3 py-2 text-[#4A4A3E]">+</button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-[#4A4A3E] block mb-1">Trẻ em</label>
                    <div className="flex items-center border border-[#E5E2DA] rounded-lg">
                      <button onClick={() => setChildren(Math.max(0, children - 1))} className="px-3 py-2 text-[#4A4A3E]">−</button>
                      <span className="flex-1 text-center font-bold">{children}</span>
                      <button onClick={() => setChildren(children + 1)} className="px-3 py-2 text-[#4A4A3E]">+</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Ngày đặt</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-[#E5E2DA] rounded-lg px-3 py-2 focus:outline-none focus:border-[#4A4A3E]"
                >
                  <option value="">-- Chọn ngày --</option>
                  {dateOptions.map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString('vi-VN')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Giờ đặt</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full border border-[#E5E2DA] rounded-lg px-3 py-2 focus:outline-none focus:border-[#4A4A3E]"
                >
                  <option value="">-- Chọn giờ --</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* Zone preference */}
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Khu vực ưa thích</label>
                <div className="grid grid-cols-2 gap-2">
                  {zones.map((zone) => (
                    <button
                      key={zone.value}
                      onClick={() => setZonePreference(zone.value)}
                      className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                        zonePreference === zone.value
                          ? 'bg-[#4A4A3E] text-white border-[#4A4A3E]'
                          : 'bg-white text-[#4A4A3E] border-[#E5E2DA] hover:border-[#4A4A3E]'
                      }`}
                    >
                      {zone.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special requests */}
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Yêu cầu đặc biệt</label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="ví dụ: Sinh nhật, Kỷ niệm..."
                  className="w-full border border-[#E5E2DA] rounded-lg px-3 py-2 focus:outline-none focus:border-[#4A4A3E] text-sm"
                  rows={2}
                />
              </div>

              {/* Customer notes */}
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Ghi chú thêm</label>
                <textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Dị ứng, tần số, yêu cầu khác..."
                  className="w-full border border-[#E5E2DA] rounded-lg px-3 py-2 focus:outline-none focus:border-[#4A4A3E] text-sm"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-[#4A4A3E] text-[#4A4A3E] rounded-lg font-bold hover:bg-[#4A4A3E]/5"
              >
                Quay Lại
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-[#4A4A3E] text-white rounded-lg font-bold hover:bg-[#2C2C2C] transition-all flex items-center justify-center gap-2"
              >
                Tiếp Tục <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm & Submit */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6 flex items-center gap-2">
              <Check size={24} className="text-[#4A4A3E]" />
              Xác Nhận Thông Tin
            </h2>

            <div className="bg-[#F9F8F6] rounded-lg p-4 mb-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#4A4A3E]">Chi nhánh:</span>
                <span className="font-bold">{selectedBranch?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A4A3E]">Ngày giờ:</span>
                <span className="font-bold">{selectedDate} {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A4A3E]">Số khách:</span>
                <span className="font-bold">{adults} người lớn, {children} trẻ em</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Họ tên *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-[#E5E2DA] rounded-lg px-3 py-2 focus:outline-none focus:border-[#4A4A3E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Số điện thoại *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-[#E5E2DA] rounded-lg px-3 py-2 focus:outline-none focus:border-[#4A4A3E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#E5E2DA] rounded-lg px-3 py-2 focus:outline-none focus:border-[#4A4A3E]"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-[#4A4A3E] text-[#4A4A3E] rounded-lg font-bold hover:bg-[#4A4A3E]/5"
              >
                Quay Lại
              </button>
              <button
                onClick={handleCreateBooking}
                disabled={isLoading}
                className="flex-1 py-3 bg-[#4A4A3E] text-white rounded-lg font-bold hover:bg-[#2C2C2C] transition-all disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                {isLoading ? 'Đang xử lý...' : 'Xác Nhận Đặt Bàn'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && createdBooking && (
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">Đặt Bàn Thành Công!</h2>
            <p className="text-[#4A4A3E] mb-6">Mã đặt bàn của bạn: <strong className="font-mono text-lg">{createdBooking.booking_code}</strong></p>
            
            <div className="bg-[#F9F8F6] rounded-lg p-6 mb-6 space-y-2 text-left text-sm">
              <p><strong>Chi nhánh:</strong> {selectedBranch?.name}</p>
              <p><strong>Ngày:</strong> {new Date(createdBooking.booking_date).toLocaleDateString('vi-VN')}</p>
              <p><strong>Giờ:</strong> {createdBooking.booking_time}</p>
              <p><strong>Số khách:</strong> {createdBooking.adult_count + createdBooking.children_count}</p>
              <p><strong>Trạng thái:</strong> <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">{createdBooking.status}</span></p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-[#4A4A3E] text-white rounded-lg font-bold hover:bg-[#2C2C2C] transition-all"
            >
              Quay Về Trang Chủ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
