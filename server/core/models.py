from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import datetime


class Role(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('customer', 'Customer'),
    ]
    
    name = models.CharField(max_length=20, choices=ROLE_CHOICES, unique=True)
    description = models.TextField(blank=True)
    
    class Meta:
        db_table = 'roles'
    
    def __str__(self):
        return self.get_name_display()


class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, related_name='users')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    def get_role_display(self):
        if self.role:
            return self.role.get_name_display()
        return 'No Role'


class Branch(models.Model):
    STATUS_CHOICES = [
        ('active', 'Hoạt động'),
        ('busy', 'Đông khách'),
        ('maintenance', 'Bảo trì'),
    ]
    
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=100)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, validators=[MinValueValidator(0), MaxValueValidator(5)], default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'branches'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class Table(models.Model):
    ZONE_CHOICES = [
        ('indoor', 'Trong nhà'),
        ('outdoor', 'Ngoài trời'),
        ('mezzanine', 'Quầy tầng lửng'),
        ('kiln', 'Cạnh lò củi'),
    ]
    
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='tables')
    table_number = models.CharField(max_length=10)
    capacity = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(100)])
    zone = models.CharField(max_length=20, choices=ZONE_CHOICES)
    is_available = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tables'
        unique_together = ('branch', 'table_number')
        ordering = ['table_number']
    
    def __str__(self):
        return f"Bàn {self.table_number} - {self.branch.name}"


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Chờ xác nhận'),
        ('confirmed', 'Đã xác nhận'),
        ('checked_in', 'Đã đến'),
        ('cancelled', 'Đã hủy'),
        ('expired', 'Quá hạn'),
    ]
    
    booking_code = models.CharField(max_length=20, unique=True)
    customer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bookings')
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='bookings')
    table = models.ForeignKey(Table, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    
    booking_date = models.DateField()
    booking_time = models.TimeField()
    
    adult_count = models.IntegerField(validators=[MinValueValidator(1)])
    children_count = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    
    zone_preference = models.CharField(max_length=20, choices=Table.ZONE_CHOICES)
    special_requests = models.TextField(blank=True)
    customer_notes = models.TextField(blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    checked_in_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['booking_code']),
            models.Index(fields=['customer', '-booking_date']),
            models.Index(fields=['branch', 'booking_date']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"Đặt bàn {self.booking_code} - {self.customer.username}"
    
    def save(self, *args, **kwargs):
        if not self.booking_code:
            import uuid
            self.booking_code = f"TPZ{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)


class Permission(models.Model):
    PERMISSION_CHOICES = [
        ('view_bookings', 'Xem đặt bàn'),
        ('create_booking', 'Tạo đặt bàn'),
        ('edit_booking', 'Sửa đặt bàn'),
        ('delete_booking', 'Xóa đặt bàn'),
        ('view_branches', 'Xem chi nhánh'),
        ('manage_branches', 'Quản lý chi nhánh'),
        ('view_tables', 'Xem bàn'),
        ('manage_tables', 'Quản lý bàn'),
        ('manage_users', 'Quản lý người dùng'),
        ('view_statistics', 'Xem thống kê'),
    ]
    
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='permissions')
    permission = models.CharField(max_length=50, choices=PERMISSION_CHOICES)
    
    class Meta:
        db_table = 'permissions'
        unique_together = ('role', 'permission')
    
    def __str__(self):
        return f"{self.role.name} - {self.get_permission_display()}"


class Notification(models.Model):
    TYPE_CHOICES = [
        ('booking_confirmed', 'Đặt bàn được xác nhận'),
        ('booking_reminder', 'Nhắc nhở đặt bàn'),
        ('booking_cancelled', 'Đặt bàn bị hủy'),
        ('system', 'Thông báo hệ thống'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_notification_type_display()} - {self.user.username}"
