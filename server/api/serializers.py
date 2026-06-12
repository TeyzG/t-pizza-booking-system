from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from core.models import CustomUser, Role, Branch, Table, Booking, Permission, Notification


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'description']


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'role', 'permission']


class CustomUserSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.get_name_display', read_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'role', 'role_name', 'is_active', 'created_at']
        read_only_fields = ['created_at']


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'phone']
    
    def validate(self, data):
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({'password': 'Passwords do not match'})
        return data
    
    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
        )
        user.set_password(validated_data['password'])
        
        # Assign customer role by default
        try:
            customer_role = Role.objects.get(name='customer')
            user.role = customer_role
        except Role.DoesNotExist:
            pass
        
        user.save()
        return user


class BranchSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Branch
        fields = [
            'id', 'name', 'location', 'address', 'phone', 'email',
            'description', 'image_url', 'rating', 'status', 'status_display',
            'latitude', 'longitude', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class TableSerializer(serializers.ModelSerializer):
    zone_display = serializers.CharField(source='get_zone_display', read_only=True)
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    
    class Meta:
        model = Table
        fields = [
            'id', 'branch', 'branch_name', 'table_number', 'capacity',
            'zone', 'zone_display', 'is_available', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class BookingSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    customer_phone = serializers.CharField(source='customer.phone', read_only=True)
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    table_number = serializers.CharField(source='table.table_number', read_only=True, allow_null=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    zone_preference_display = serializers.CharField(source='get_zone_preference_display', read_only=True)
    total_guests = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = [
            'id', 'booking_code', 'customer', 'customer_name', 'customer_email', 'customer_phone',
            'branch', 'branch_name', 'table', 'table_number',
            'booking_date', 'booking_time', 'adult_count', 'children_count', 'total_guests',
            'zone_preference', 'zone_preference_display', 'special_requests', 'customer_notes',
            'status', 'status_display', 'checked_in_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['booking_code', 'customer', 'created_at', 'updated_at']
    
    def get_total_guests(self, obj):
        return obj.adult_count + obj.children_count


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'branch', 'booking_date', 'booking_time',
            'adult_count', 'children_count',
            'zone_preference', 'special_requests', 'customer_notes'
        ]
    
    def create(self, validated_data):
        validated_data['customer'] = self.context['request'].user
        return super().create(validated_data)


class NotificationSerializer(serializers.ModelSerializer):
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'booking', 'notification_type', 'notification_type_display',
            'title', 'message', 'is_read', 'created_at'
        ]
        read_only_fields = ['created_at']


class DashboardStatisticsSerializer(serializers.Serializer):
    total_bookings = serializers.IntegerField()
    pending_confirmations = serializers.IntegerField()
    confirmed_bookings = serializers.IntegerField()
    checked_in_count = serializers.IntegerField()
    total_guests = serializers.IntegerField()
    hourly_distribution = serializers.DictField()
    zone_distribution = serializers.DictField()
