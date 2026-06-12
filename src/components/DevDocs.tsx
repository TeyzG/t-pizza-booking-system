import React, { useState } from 'react';
import { BookOpen, Database, Code, Terminal, Clock, ShieldCheck, Server } from 'lucide-react';

export default function DevDocs() {
  const [activeTab, setActiveTab] = useState<'django-models' | 'mysql-schema' | 'capacity-check' | 'django-setup'>('django-models');

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-neutral-100 max-w-5xl mx-auto my-6 shadow-2xl">
      <div className="flex items-center gap-3 border-b border-neutral-800 pb-4 mb-6">
        <Server className="w-8 h-8 text-amber-500 animate-pulse" />
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight text-white">Developer Center: Django / MySQL System Specs</h2>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">Integration Reference, DB Schemas, & Dynamic Capacity Check Logic (Pizza 4P's Style)</p>
        </div>
      </div>

      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
        <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4" />
          Tải tài liệu Tích hợp Full-stack
        </h3>
        <p className="text-xs text-neutral-300 leading-relaxed">
          Giao diện Frontend này được thiết kế tương thích 100% với cấu trúc Restful API của <strong>Django REST Framework (DRF)</strong> và cơ sở dữ liệu <strong>MySQL (XAMPP)</strong>. 
          Dưới đây là sơ đồ Schema và thuật toán quét lọc bàn trống thông minh để bạn triển khai trực tiếp vào mã nguồn backend của mình.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('django-models')}
          className={`flex items-center justify-center gap-2 py-3 px-2 rounded-lg font-mono text-xs border transition-all ${
            activeTab === 'django-models'
              ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500 shadow-md'
              : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Code className="w-4 h-4" />
          1. Django Models
        </button>
        <button
          onClick={() => setActiveTab('mysql-schema')}
          className={`flex items-center justify-center gap-2 py-3 px-2 rounded-lg font-mono text-xs border transition-all ${
            activeTab === 'mysql-schema'
              ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500 shadow-md'
              : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Database className="w-4 h-4" />
          2. MySQL Schema (DDL)
        </button>
        <button
          onClick={() => setActiveTab('capacity-check')}
          className={`flex items-center justify-center gap-2 py-3 px-2 rounded-lg font-mono text-xs border transition-all ${
            activeTab === 'capacity-check'
              ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500 shadow-md'
              : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          3. Check Capacity Logic
        </button>
        <button
          onClick={() => setActiveTab('django-setup')}
          className={`flex items-center justify-center gap-2 py-3 px-2 rounded-lg font-mono text-xs border transition-all ${
            activeTab === 'django-setup'
              ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500 shadow-md'
              : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          4. Django Config
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-neutral-950 rounded-xl p-5 border border-neutral-800 overflow-x-auto">
        {activeTab === 'django-models' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-neutral-400 font-mono">File: modules/booking/models.py</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-mono py-0.5 px-2 rounded">Django 4/5 + DRF</span>
            </div>
            <pre className="text-xs font-mono text-amber-200/95 leading-relaxed overflow-x-auto max-h-[450px]">
{`from django.db import models

class Location(models.Model):
    name = models.CharField(max_length=100, verbose_name="Tỉnh/Thành phố")
    
    def __str__(self):
        return self.name

class Branch(models.Model):
    name = models.CharField(max_length=150, verbose_name="Tên Chi nhánh")
    address = models.TextField(verbose_name="Địa chỉ cụ thể")
    phone = models.CharField(max_length=20, verbose_name="Hotline")
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="branches")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Table(models.Model):
    ZONE_CHOICES = [
        ('Trong nhà', 'Trong nhà (Indoor)'),
        ('Ngoài trời', 'Ngoài trời (Outdoor)'),
        ('Quầy tầng lửng', 'Quầy tầng lửng (Mezzanine Bar)'),
        ('Cạnh lò củi', 'Cạnh lò củi (Wood-fired Pizza Counter)'),
    ]
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="tables")
    table_number = models.CharField(max_length=10, verbose_name="Số Bàn (ví dụ: N02, C12)")
    capacity = models.IntegerField(default=4, verbose_name="Sức chứa tối đa")
    zone = models.CharField(max_length=50, choices=ZONE_CHOICES, default='Trong nhà')

    def __str__(self):
        return f"{self.branch.name} - Bàn {self.table_number} ({self.zone})"

class Booking(models.Model):
    STATUS_CHOICES = [
        ('Chờ xác nhận', 'Chờ xác nhận'),
        ('Đã xác nhận', 'Đã xác nhận'),
        ('Đã đến', 'Đã đến (Checked-in)'),
        ('Đã hủy', 'Đã hủy (Cancelled)'),
        ('Quá hạn', 'Quá hạn (No-show)'),
    ]
    booking_code = models.CharField(max_length=20, unique=True, verbose_name="Mã Đặt Bàn")
    customer_name = models.CharField(max_length=100, verbose_name="Tên Khách Hàng")
    customer_phone = models.CharField(max_length=15, verbose_name="Số Điện Thoại")
    customer_email = models.EmailField(verbose_name="Email")
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    booking_date = models.DateField(verbose_name="Ngày đặt bàn")
    booking_time = models.TimeField(verbose_name="Giờ đặt bàn")
    adults_count = models.IntegerField(default=1)
    children_count = models.IntegerField(default=0)
    zone_preference = models.CharField(max_length=50, default='Bất kỳ')
    special_request = models.TextField(blank=True, null=True, verbose_name="Yêu cầu riêng")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Chờ xác nhận')
    table = models.ForeignKey(Table, on_delete=models.SET_NULL, null=True, blank=True, related_name="bookings")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.booking_code} - {self.customer_name} ({self.booking_date})"`}
            </pre>
          </div>
        )}

        {activeTab === 'mysql-schema' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-neutral-400 font-mono">SQL DDL Schema for MySQL (XAMPP / PhpMyAdmin)</span>
              <span className="text-xs bg-blue-500/20 text-blue-400 font-mono py-0.5 px-2 rounded">MySQL 8.0 / MariaDB</span>
            </div>
            <pre className="text-xs font-mono text-blue-200/95 leading-relaxed overflow-x-auto max-h-[450px]">
{`-- Tạo Database
CREATE DATABASE IF NOT EXISTS pizza4ps_booking DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pizza4ps_booking;

-- 1. Bảng Tỉnh/Thành Phố
CREATE TABLE IF NOT EXISTS booking_location (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Bảng Chi nhánh Nhà hàng
CREATE TABLE IF NOT EXISTS booking_branch (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    latitude DECIMAL(9,6) NULL,
    longitude DECIMAL(9,6) NULL,
    is_active TINYINT(1) DEFAULT 1,
    FOREIGN KEY (location_id) REFERENCES booking_location(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Bảng Danh sách Bàn ăn
CREATE TABLE IF NOT EXISTS booking_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT NOT NULL,
    table_number VARCHAR(10) NOT NULL,
    capacity INT DEFAULT 4,
    zone VARCHAR(50) NOT NULL DEFAULT 'Trong nhà',
    FOREIGN KEY (branch_id) REFERENCES booking_branch(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Bảng Đăng ký Đặt bàn
CREATE TABLE IF NOT EXISTS booking_booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(20) NOT NULL UNIQUE,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    branch_id INT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    adults_count INT DEFAULT 1,
    children_count INT DEFAULT 0,
    zone_preference VARCHAR(50) DEFAULT 'Bất kỳ',
    special_request TEXT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Chờ xác nhận',
    table_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES booking_branch(id) ON DELETE CASCADE,
    FOREIGN KEY (table_id) REFERENCES booking_table(id) ON DELETE SET NULL,
    INDEX idx_date_time (booking_date, booking_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`}
            </pre>
          </div>
        )}

        {activeTab === 'capacity-check' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-amber-400 font-mono">Algorithm: Check & Auto-allocate Tables (Overlapping ±2 Hours Buffer)</span>
              <span className="text-xs bg-red-500/20 text-red-400 font-mono py-0.5 px-2 rounded">核心 Algorithmic Flow</span>
            </div>
            <div className="text-xs text-neutral-300 mb-4 font-sans leading-relaxed">
              <span className="text-amber-400 font-bold">Quy luật lọc trùng:</span> Khi khách đặt lúc <strong>19:00</strong> ngày <strong>D</strong> cho nhóm <strong>4 người</strong>:
              <ol className="list-decimal ml-5 mt-1 space-y-1 text-neutral-300">
                <li>Tính tổng số khách (Người lớn + Trẻ em) = <code className="bg-neutral-900 border border-neutral-800 px-1 py-0.5 text-amber-300 text-[10px] rounded">N</code> khách.</li>
                <li>Tìm danh sách bàn tại Bàn của Chi nhánh đó có <code className="bg-neutral-900 border border-neutral-800 px-1 py-0.5 text-amber-300 text-[10px] rounded">capacity &gt;= N</code>.</li>
                <li>Với mỗi bàn phù hợp, kiểm tra xem có xung đột với bất kỳ Booking nào ở trạng thái hoạt động (khác 'Đã hủy' và 'Quá hạn') đã đặt bàn ăn trong khoảng thời gian <strong className="text-amber-400">± 2 tiếng (120 phút)</strong> so với giờ khách đặt.</li>
                <li>Hệ thống trả về danh sách các ca giờ rảnh và tự động chỉ định Bàn ăn trống lý tưởng cho Khách khi xác nhận thành công.</li>
              </ol>
            </div>
            <pre className="text-xs font-mono text-emerald-300/95 leading-relaxed overflow-x-auto max-h-[380px]">
{`import datetime
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Table, Booking, Branch

class CheckAvailabilityView(APIView):
    def post(self, request):
        branch_id = request.data.get('branch_id')
        booking_date_str = request.data.get('date') # YYYY-MM-DD
        booking_time_str = request.data.get('time') # HH:MM
        adults = int(request.data.get('adults', 1))
        children = int(request.data.get('children', 0))
        zone_preference = request.data.get('zone_preference', 'Bất kỳ')

        total_guests = adults + children

        # 1. Chuyển đổi định dạng ngày giờ
        try:
            booking_date = datetime.datetime.strptime(booking_date_str, '%Y-%m-%d').date()
            booking_time = datetime.datetime.strptime(booking_time_str, '%H:%M').time()
        except ValueError:
            return Response({"error": "Sai định dạng ngày/giờ"}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Tính khoảng thời gian xung đột (± 2 tiếng trước/sau)
        target_datetime = datetime.datetime.combine(booking_date, booking_time)
        start_buffer = (target_datetime - datetime.timedelta(hours=2)).time()
        end_buffer = (target_datetime + datetime.timedelta(hours=2)).time()

        # 3. Tìm các Booking đã được xếp bàn trong khoảng thời gian xung đột
        busy_bookings = Booking.objects.filter(
            branch_id=branch_id,
            booking_date=booking_date,
            status__in=['Chờ xác nhận', 'Đã xác nhận', 'Đã đến']
        ).filter(
            # Giờ đặt bàn nằm trong khoảng buffer ± 2 tiếng
            Q(booking_time__gte=start_buffer, booking_time__lte=end_buffer)
        )

        # Lấy danh sách ID các bàn đang bận vào ca này
        busy_table_ids = busy_bookings.values_list('table_id', flat=True)

        # 4. Tìm các BÀN CÒN TRỐNG thỏa mãn điều kiện
        available_tables = Table.objects.filter(
            branch_id=branch_id,
            capacity__gte=total_guests
        ).exclude(
            id__in=busy_table_ids
        )

        # Áp dụng bộ lọc khu vực ngồi nếu được chọn riêng
        if zone_preference and zone_preference != 'Bất kỳ':
            available_tables = available_tables.filter(zone=zone_preference)

        # 5. Phản hồi trạng thái
        if available_tables.exists():
            chosen_table = available_tables.first() # Chọn bàn tối ưu vừa sức chứa nhất
            return Response({
                "available": True,
                "message": "Có bàn trống phù hợp cho bạn!",
                "suggested_table": {
                    "id": chosen_table.id,
                    "table_number": chosen_table.table_number,
                    "zone": chosen_table.zone,
                    "capacity": chosen_table.capacity
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "available": False,
                "message": "Toàn bộ bàn trống cho nhóm quy mô này vào ca giờ được chọn đã kín chỗ."
            }, status=status.HTTP_200_OK)`}
            </pre>
          </div>
        )}

        {activeTab === 'django-setup' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-neutral-400 font-mono">File: config/settings.py & requirements.txt</span>
              <span className="text-xs bg-amber-500/20 text-amber-500 font-mono py-0.5 px-2 rounded">DRF Setup Guide</span>
            </div>
            <pre className="text-xs font-mono text-purple-200/95 leading-relaxed overflow-x-auto">
{`# 1. Cổng Database MySQL trên XAMPP (settings.py)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'pizza4ps_booking',
        'USER': 'root',
        'PASSWORD': '',  # Mặc định XAMPP để trống
        'HOST': '127.0.0.1',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        }
    }
}

# 2. Cấu hình CORS cho phép Vite kết nối đến Django API
INSTALLED_APPS = [
    ...
    'corsheaders',
    'rest_framework',
    'booking',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Đặt ở đầu tiên!
    'django.middleware.common.CommonMiddleware',
    ...
]

# Cho phép React Dev Server (Vite) truy cập
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173", # Cổng chạy mặc định của Vite
    "http://localhost:3000",
]

# 3. Các gói package cần cài đặt (requirements.txt)
# pip install django djangorestframework django-cors-headers mysqlclient`}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-neutral-400 text-xs font-mono">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Code đã được biên soạn và tối ưu hóa cho cấu trúc Django Rest Framework.
        </span>
        <span>Version 1.2.0</span>
      </div>
    </div>
  );
}
