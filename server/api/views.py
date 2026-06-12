from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.db.models import Q, Count, Sum
from datetime import datetime, timedelta

from core.models import CustomUser, Role, Branch, Table, Booking, Permission, Notification
from .serializers import (
    CustomUserSerializer, UserRegisterSerializer, RoleSerializer,
    BranchSerializer, TableSerializer, BookingSerializer, BookingCreateSerializer,
    NotificationSerializer, PermissionSerializer, DashboardStatisticsSerializer
)
from .authentication import generate_jwt_token


class LoginView(APIView):
    """User login endpoint"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response(
                {'error': 'Invalid username or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        token = generate_jwt_token(user)
        
        return Response({
            'token': token,
            'user': CustomUserSerializer(user).data
        })


class RegisterView(APIView):
    """User registration endpoint"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = generate_jwt_token(user)
            return Response({
                'message': 'User registered successfully',
                'token': token,
                'user': CustomUserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    """User management viewset"""
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Admin can view all users, others can only view themselves
        if self.request.user.role and self.request.user.role.name == 'admin':
            return CustomUser.objects.all()
        return CustomUser.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change password"""
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')
        
        if not user.check_password(old_password):
            return Response(
                {'error': 'Old password is incorrect'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_password != confirm_password:
            return Response(
                {'error': 'New passwords do not match'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(new_password)
        user.save()
        
        return Response({'message': 'Password changed successfully'})


class BranchViewSet(viewsets.ModelViewSet):
    """Branch management viewset"""
    queryset = Branch.objects.filter(is_active=True)
    serializer_class = BranchSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['location', 'status']
    search_fields = ['name', 'location', 'address']
    ordering_fields = ['name', 'rating', 'created_at']
    ordering = ['name']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def check_admin_permission(self):
        if not self.request.user.is_authenticated:
            return False
        return self.request.user.role and self.request.user.role.name == 'admin'
    
    def create(self, request, *args, **kwargs):
        if not self.check_admin_permission():
            return Response(
                {'error': 'Only admins can create branches'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        if not self.check_admin_permission():
            return Response(
                {'error': 'Only admins can update branches'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        if not self.check_admin_permission():
            return Response(
                {'error': 'Only admins can delete branches'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)


class TableViewSet(viewsets.ModelViewSet):
    """Table management viewset"""
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['branch', 'zone', 'is_available']
    ordering_fields = ['table_number', 'capacity']
    ordering = ['table_number']
    
    @action(detail=False, methods=['get'])
    def available_tables(self, request):
        """Get available tables for a branch and date"""
        branch_id = request.query_params.get('branch_id')
        booking_date = request.query_params.get('date')
        booking_time = request.query_params.get('time')
        zone = request.query_params.get('zone')
        capacity = request.query_params.get('capacity')
        
        if not all([branch_id, booking_date, booking_time]):
            return Response(
                {'error': 'branch_id, date, and time are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        tables = Table.objects.filter(
            branch_id=branch_id,
            is_available=True
        )
        
        if zone and zone != 'any':
            tables = tables.filter(zone=zone)
        
        if capacity:
            tables = tables.filter(capacity__gte=int(capacity))
        
        # Exclude already booked tables for this date/time
        booked_tables = Booking.objects.filter(
            booking_date=booking_date,
            booking_time=booking_time,
            status__in=['confirmed', 'checked_in']
        ).values_list('table_id', flat=True)
        
        tables = tables.exclude(id__in=booked_tables)
        
        serializer = self.get_serializer(tables, many=True)
        return Response(serializer.data)


class BookingViewSet(viewsets.ModelViewSet):
    """Booking management viewset"""
    queryset = Booking.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['branch', 'status', 'booking_date']
    search_fields = ['booking_code', 'customer__username', 'customer__phone']
    ordering_fields = ['booking_date', 'booking_time', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role and user.role.name == 'admin':
            return Booking.objects.all()
        elif user.role and user.role.name == 'staff':
            return Booking.objects.filter(branch__in=Branch.objects.all())
        else:
            return Booking.objects.filter(customer=user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            booking = serializer.save()
            
            # Create notification for admin
            admin_role = Role.objects.filter(name='admin').first()
            if admin_role:
                admins = CustomUser.objects.filter(role=admin_role)
                for admin in admins:
                    Notification.objects.create(
                        user=admin,
                        booking=booking,
                        notification_type='booking_confirmed',
                        title=f'Đặt bàn mới từ {booking.customer.username}',
                        message=f'Có đặt bàn mới cho ngày {booking.booking_date} lúc {booking.booking_time}'
                    )
            
            return Response(
                BookingSerializer(booking).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        """Get current user's bookings"""
        bookings = Booking.objects.filter(customer=request.user).order_by('-booking_date')
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm a booking (admin/staff only)"""
        booking = self.get_object()
        
        if request.user.role and request.user.role.name not in ['admin', 'staff']:
            return Response(
                {'error': 'Only admin/staff can confirm bookings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        booking.status = 'confirmed'
        booking.save()
        
        return Response(BookingSerializer(booking).data)
    
    @action(detail=True, methods=['post'])
    def check_in(self, request, pk=None):
        """Check in a booking"""
        booking = self.get_object()
        
        if booking.customer != request.user and (not request.user.role or request.user.role.name not in ['admin', 'staff']):
            return Response(
                {'error': 'You can only check in your own bookings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        booking.status = 'checked_in'
        booking.checked_in_at = datetime.now()
        booking.save()
        
        return Response(BookingSerializer(booking).data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        
        if booking.customer != request.user and (not request.user.role or request.user.role.name != 'admin'):
            return Response(
                {'error': 'You can only cancel your own bookings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        booking.status = 'cancelled'
        booking.save()
        
        return Response(BookingSerializer(booking).data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get booking statistics for admin dashboard"""
        if not request.user.role or request.user.role.name != 'admin':
            return Response(
                {'error': 'Only admins can view statistics'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        branch_id = request.query_params.get('branch_id')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        
        bookings = Booking.objects.all()
        
        if branch_id:
            bookings = bookings.filter(branch_id=branch_id)
        
        if date_from:
            bookings = bookings.filter(booking_date__gte=date_from)
        
        if date_to:
            bookings = bookings.filter(booking_date__lte=date_to)
        
        total_bookings = bookings.count()
        pending = bookings.filter(status='pending').count()
        confirmed = bookings.filter(status='confirmed').count()
        checked_in = bookings.filter(status='checked_in').count()
        total_guests = bookings.aggregate(Sum('adult_count'))['adult_count__sum'] or 0
        total_guests += bookings.aggregate(Sum('children_count'))['children_count__sum'] or 0
        
        # Hourly distribution
        hourly = {}
        for booking in bookings.filter(status__in=['confirmed', 'checked_in']):
            time_str = str(booking.booking_time)[:5]
            hourly[time_str] = hourly.get(time_str, 0) + 1
        
        # Zone distribution
        zone_dist = bookings.filter(status__in=['confirmed', 'checked_in']).values('zone_preference').annotate(count=Count('id'))
        zone_data = {item['zone_preference']: item['count'] for item in zone_dist}
        
        data = {
            'total_bookings': total_bookings,
            'pending_confirmations': pending,
            'confirmed_bookings': confirmed,
            'checked_in_count': checked_in,
            'total_guests': total_guests,
            'hourly_distribution': hourly,
            'zone_distribution': zone_data
        }
        
        serializer = DashboardStatisticsSerializer(data)
        return Response(serializer.data)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """Notification viewset"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(self.get_serializer(notification).data)
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read"""
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'All notifications marked as read'})
