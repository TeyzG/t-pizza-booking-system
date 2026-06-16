from django.contrib import admin
from core.models import CustomUser, Role, Branch, Table, Booking, Permission, Notification, ChatSession, ChatMessage, Category, MenuItem


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'phone', 'role', 'branch', 'is_active', 'created_at']
    list_filter = ['role', 'branch', 'is_active', 'created_at']
    search_fields = ['username', 'email', 'phone']
    fieldsets = (
        ('Personal Info', {'fields': ('username', 'email', 'first_name', 'last_name', 'phone')}),
        ('Permissions', {'fields': ('role', 'branch', 'is_active', 'is_staff', 'is_superuser')}),
        ('Important Dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'status', 'rating', 'is_active', 'created_at']
    list_filter = ['location', 'status', 'is_active', 'created_at']
    search_fields = ['name', 'location', 'address', 'phone']
    fieldsets = (
        ('Branch Info', {'fields': ('name', 'location', 'address', 'phone', 'email')}),
        ('Details', {'fields': ('description', 'image_url', 'rating', 'status')}),
        ('Location', {'fields': ('latitude', 'longitude')}),
        ('Status', {'fields': ('is_active',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ['table_number', 'branch', 'capacity', 'zone', 'is_available']
    list_filter = ['branch', 'zone', 'is_available']
    search_fields = ['table_number', 'branch__name']
    fieldsets = (
        ('Table Info', {'fields': ('branch', 'table_number', 'capacity', 'zone')}),
        ('Status', {'fields': ('is_available', 'notes')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['booking_code', 'customer', 'branch', 'booking_date', 'booking_time', 'status', 'customer_notes']
    list_filter = ['status', 'branch', 'booking_date']
    search_fields = ['booking_code', 'customer__username', 'customer__email']
    fieldsets = (
        ('Booking Info', {'fields': ('booking_code', 'customer', 'branch', 'table')}),
        ('Reservation Details', {'fields': ('booking_date', 'booking_time', 'adult_count', 'children_count')}),
        ('Preferences', {'fields': ('zone_preference', 'special_requests', 'customer_notes')}),
        ('Status', {'fields': ('status', 'checked_in_at')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    readonly_fields = ['booking_code', 'created_at', 'updated_at']


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ['role', 'permission']
    list_filter = ['role']
    search_fields = ['role__name', 'permission']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'notification_type', 'title', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['user__username', 'title', 'message']
    readonly_fields = ['created_at']


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'user', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['session_id', 'user__username']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['session', 'role', 'content', 'intent', 'created_at']
    list_filter = ['role', 'intent', 'created_at']
    search_fields = ['content', 'intent']
    readonly_fields = ['created_at']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name']
    ordering = ['order']


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'is_available', 'is_special']
    list_filter = ['category', 'is_available', 'is_special']
    search_fields = ['name', 'description']
    ordering = ['category__order', 'name']
    raw_id_fields = ['category'] # For easier category selection if many categories
