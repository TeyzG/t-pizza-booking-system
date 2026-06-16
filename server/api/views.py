from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.db.models import Q, Count, Sum
from datetime import datetime, timedelta
import google.generativeai as genai
import os

from core.models import CustomUser, Role, Branch, Table, Booking, Permission, Notification, ChatSession, ChatMessage
from core.models import Category, MenuItem
from .serializers import (
    CustomUserSerializer, UserRegisterSerializer, RoleSerializer,
    BranchSerializer, TableSerializer, BookingSerializer, BookingCreateSerializer,
    NotificationSerializer, PermissionSerializer, DashboardStatisticsSerializer, CategorySerializer, MenuItemSerializer,
    ChatMessageSerializer, ChatSessionSerializer, ChatbotRequestSerializer
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
        if self.request.user.role and self.request.user.role.name == 'admin':
            return CustomUser.objects.all()
        return CustomUser.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
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
        if user.is_superuser or (user.role and user.role.name == 'admin'):
            return Booking.objects.all()
        elif user.is_staff or (user.role and user.role.name == 'staff'):
            # Cho phép staff xem tất cả booking hoặc lọc theo chi nhánh nếu cần
            return Booking.objects.all()
        return Booking.objects.filter(customer=user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            booking = serializer.save()
            
            # Notify Admins
            admin_role = Role.objects.filter(name='admin').first()
            if admin_role:
                admins = CustomUser.objects.filter(role=admin_role)
                for admin in admins:
                    Notification.objects.create(
                        user=admin,
                        booking=booking,
                        notification_type='booking_confirmed',
                        title=f'🔔 Đặt bàn mới: {booking.booking_code}',
                        message=(
                            f'Khách hàng {booking.customer.last_name} {booking.customer.first_name} '
                            f'vừa đặt bàn tại {booking.branch.name} vào {booking.booking_time.strftime("%H:%M")} ngày {booking.booking_date.strftime("%d/%m/%Y")}. '
                            f'Ghi chú: {booking.customer_notes or "Không có"}'
                        )
                    )

            # Notify Staff of the specific branch only
            staff_role = Role.objects.filter(name='staff').first()
            if staff_role:
                branch_staffs = CustomUser.objects.filter(role=staff_role, branch_id=booking.branch_id)
                for staff in branch_staffs:
                    Notification.objects.create(
                        user=staff,
                        booking=booking,
                        notification_type='booking_confirmed',
                        title=f'📍 Đơn mới tại chi nhánh: {booking.booking_code}',
                        message=(
                            f'Có khách đặt bàn tại chi nhánh của bạn vào {booking.booking_time.strftime("%H:%M")}. '
                            f'Yêu cầu: {booking.special_requests or "Không có"}'
                        )
                    )
            
            return Response(
                BookingSerializer(booking).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        bookings = Booking.objects.filter(customer=request.user).order_by('-booking_date')
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
    def check_branch_access(self, user, booking):
        """Helper to verify if staff belongs to the same branch as the booking"""
        is_admin = user.is_superuser or (user.role and user.role.name == 'admin')
        is_staff = user.is_staff or (user.role and user.role.name == 'staff')
        
        if is_admin:
            return True
        if is_staff:
            return user.branch_id == booking.branch_id
        return booking.customer == user

    def update(self, request, *args, **kwargs):
        booking = self.get_object()
        if not self.check_branch_access(request.user, booking):
            return Response(
                {'error': 'You can only manage bookings for your assigned branch'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()
        if not self.check_branch_access(request.user, booking):
            return Response(
                {'error': 'You can only manage bookings for your assigned branch'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

    def _notify_on_status_change(self, booking, user, action_title, action_verb):
        """Helper to notify customer and admin about status changes"""
        # Notify Customer
        Notification.objects.create(
            user=booking.customer,
            booking=booking,
            notification_type='status_update',
            title=f'📢 {action_title}',
            message=f'Đơn đặt bàn {booking.booking_code} của bạn đã được {action_verb} bởi nhân viên T\'Pizza.'
        )
        
        # If action by staff, notify Admin
        if user.role and user.role.name == 'staff':
            admin_role = Role.objects.filter(name='admin').first()
            if admin_role:
                admins = CustomUser.objects.filter(role=admin_role)
                for admin in admins:
                    Notification.objects.create(
                        user=admin,
                        booking=booking,
                        notification_type='staff_action',
                        title=f'👮 Nhân viên thao tác: {booking.booking_code}',
                        message=(
                            f'Nhân viên {user.username} vừa {action_verb} đơn đặt bàn {booking.booking_code} '
                            f'tại chi nhánh {booking.branch.name}. Ghi chú khách: "{booking.customer_notes or "Không có"}". Yêu cầu đặc biệt: "{booking.special_requests or "Không có"}".'
                        )
                    )

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        booking = self.get_object()
        if not self.check_branch_access(request.user, booking):
            return Response({'error': 'Unauthorized branch access'}, status=status.HTTP_403_FORBIDDEN)
            
        booking.status = 'confirmed'
        booking.save()
        
        self._notify_on_status_change(booking, request.user, 'Đặt bàn đã được xác nhận', 'xác nhận')
        
        return Response(BookingSerializer(booking).data)
    
    @action(detail=True, methods=['post'])
    def check_in(self, request, pk=None):
        booking = self.get_object()
        if not self.check_branch_access(request.user, booking):
            return Response({'error': 'Unauthorized branch access'}, status=status.HTTP_403_FORBIDDEN)
            
        table_id = request.data.get('table_id')
        if table_id:
            try:
                table = Table.objects.get(id=table_id, branch_id=booking.branch_id)
                booking.table = table
                # Đánh dấu bàn đã có khách
                table.is_available = False
                table.save()
            except Table.DoesNotExist:
                return Response({'error': 'Bàn không tồn tại hoặc không thuộc chi nhánh này'}, status=status.HTTP_400_BAD_REQUEST)
        elif not booking.table:
            return Response({'error': 'Vui lòng chọn bàn để thực hiện check-in'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = 'checked_in'
        booking.checked_in_at = datetime.now()
        booking.save()
        
        self._notify_on_status_change(booking, request.user, 'Chào mừng bạn đến với T\'Pizza', 'check-in')
        
        return Response(BookingSerializer(booking).data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if not self.check_branch_access(request.user, booking):
            return Response({'error': 'Unauthorized branch access'}, status=status.HTTP_403_FORBIDDEN)

        booking.status = 'cancelled'
        booking.save()
        
        # Special message for cancellation
        Notification.objects.create(
            user=booking.customer,
            booking=booking,
            notification_type='status_update',
            title='❌ Đặt bàn đã bị hủy',
            message=f'Rất tiếc, đơn đặt bàn {booking.booking_code} của bạn đã bị hủy. Hẹn gặp lại bạn lần sau!'
        )
        
        if request.user.role and request.user.role.name == 'staff':
            for admin in CustomUser.objects.filter(role__name='admin'):
                Notification.objects.create(
                    user=admin,
                    booking=booking,
                    notification_type='staff_action',
                    title=f'⚠️ Nhân viên hủy đơn: {booking.booking_code}',
                    message=(
                        f'Nhân viên {request.user.username} đã hủy đơn {booking.booking_code} '
                        f'tại chi nhánh {booking.branch.name}. Ghi chú khách: "{booking.customer_notes or "Không có"}". Yêu cầu đặc biệt: "{booking.special_requests or "Không có"}".'
                    )
                )

        return Response(BookingSerializer(booking).data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        user = request.user
        is_admin = user.is_superuser or (user.role and user.role.name == 'admin')
        is_staff = user.is_staff or (user.role and user.role.name == 'staff')

        if not (is_admin or is_staff):
            return Response(
                {'error': 'Unauthorized to view statistics'},
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
        
        hourly = {}
        for booking in bookings.filter(status__in=['confirmed', 'checked_in']):
            time_str = str(booking.booking_time)[:5]
            hourly[time_str] = hourly.get(time_str, 0) + 1
        
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
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(self.get_serializer(notification).data)
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'All notifications marked as read'})


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Menu categories viewset"""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    ordering = ['order', 'name']


class MenuItemViewSet(viewsets.ReadOnlyModelViewSet):
    """Menu items viewset"""
    queryset = MenuItem.objects.filter(is_available=True)
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['category', 'is_special']
    search_fields = ['name', 'description']
    ordering = ['category__order', 'name']

    @action(detail=False, methods=['get'])
    def specials(self, request):
        specials = self.get_queryset().filter(is_special=True)
        serializer = self.get_serializer(specials, many=True)
        return Response(serializer.data)


# ============================================================
# Chatbot AI View
# ============================================================

class ChatbotView(APIView):
    """
    AI-powered chatbot that answers customer questions about T'Pizza.
    Uses intent matching with context from the database (branches, menus, bookings).
    
    Endpoints:
      POST /api/chatbot/  — send a message, get an AI answer
      GET  /api/chatbot/history/?session_id=xxx — get session history
      POST /api/chatbot/clear/ — clear a session
    """
    permission_classes = [permissions.AllowAny]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Cấu hình Gemini API (Nên dùng biến môi trường trong thực tế)
        api_key = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE") # Replace with your actual key
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def post(self, request):
        serializer = ChatbotRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

        message = serializer.validated_data['message']
        session_id = serializer.validated_data.get('session_id', 'default')

        # Get or create session
        session, _ = ChatSession.objects.get_or_create(
            session_id=session_id,
            defaults={'user': request.user if request.user.is_authenticated else None}
        )

        # Save user message
        ChatMessage.objects.create(
            session=session,
            role='user',
            content=message
        )

        # Determine intent
        intent = self._detect_intent(message)
        
        # Generate response
        answer = self._generate_response(intent, message, user=request.user)

        # Save assistant response
        ChatMessage.objects.create(
            session=session,
            role='assistant',
            content=answer,
            intent=intent
        )

        # Update session context
        context = session.context_data or {}
        context['last_intent'] = intent
        context['message_count'] = context.get('message_count', 0) + 1
        session.context_data = context
        session.save(update_fields=['context_data'])

        return Response({
            'answer': answer,
            'intent': intent,
            'session_id': session_id,
        })

    def get(self, request):
        """Get chat history for a session"""
        session_id = request.query_params.get('session_id', 'default')
        try:
            session = ChatSession.objects.get(session_id=session_id)
            messages = session.messages.all()
            serializer = ChatMessageSerializer(messages, many=True)
            return Response({'messages': serializer.data, 'session_id': session_id})
        except ChatSession.DoesNotExist:
            return Response({'messages': [], 'session_id': session_id})

    def _detect_intent(self, message: str) -> str:
        """Detect the user's intent from their message."""
        q = message.lower().strip()
        for intent, pattern in self.INTENTS.items():
            if re.search(pattern, q):
                return intent
        return 'unknown'

    def _generate_response(self, intent: str, message: str, user=None) -> str:
        """Generate a response based on intent and message."""
        import random

        # Logic tra cứu đặt bàn thực tế nếu người dùng hỏi về trạng thái
        if intent == 'check_status' and user and user.is_authenticated:
            try:
                latest_booking = Booking.objects.filter(customer=user).order_by('-created_at').first()
                if latest_booking:
                    return (
                        f"🔍 Tôi tìm thấy thông tin đặt bàn gần nhất của bạn:\n\n"
                        f"• Mã: **{latest_booking.booking_code}**\n"
                        f"• Chi nhánh: {latest_booking.branch.name}\n"
                        f"• Ngày: {latest_booking.booking_date}\n"
                        f"• Giờ: {latest_booking.booking_time}\n"
                        f"• Trạng thái: {latest_booking.get_status_display()}\n\n"
                        f"Bạn có cần hỗ trợ gì thêm không? 😊"
                    )
            except Exception:
                pass

        if intent in self.RESPONSES:
            return random.choice(self.RESPONSES[intent])

        # Try to enrich "unknown" responses with database context
        q = message.lower().strip()
        
        # Check if asking about a specific branch
        try:
            branches = Branch.objects.filter(is_active=True)
            for branch in branches:
                if branch.name.lower() in q or branch.location.lower() in q:
                    return (
                        f"📍 **{branch.name}**\n\n"
                        f"• Địa chỉ: {branch.address}\n"
                        f"• Điện thoại: {branch.phone}\n"
                        f"• Đánh giá: {branch.rating}⭐\n"
                        f"• Trạng thái: {branch.get_status_display()}\n\n"
                        f"⏰ Giờ mở cửa: 11:00 - 22:00\n"
                        f"👉 Bạn có muốn đặt bàn tại chi nhánh này không?"
                    )
        except Exception:
            pass

        # Check if asking about booking count/statistics
        if any(w in q for w in ['bao nhiêu', 'mấy', 'tổng', 'tổng số', 'hiện tại']):
            try:
                today = datetime.now().date()
                booking_count = Booking.objects.filter(booking_date=today).count()
                guest_count = Booking.objects.filter(booking_date=today).aggregate(
                    total=Sum('adult_count') + Sum('children_count')
                )['total'] or 0
                return (
                    f"📊 **Thống kê hôm nay ({today.strftime('%d/%m/%Y')}):**\n\n"
                    f"• Tổng đặt bàn: {booking_count}\n"
                    f"• Tổng khách dự kiến: {guest_count}\n\n"
                    f"Bạn muốn xem chi tiết? Vào tab **Quản trị viên** nhé!"
                )
            except Exception:
                pass

        # Default fallback
        return (
            'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. 🤔\n\n'
            'Bạn có thể hỏi tôi về:\n\n'
            '• 🍕 Thực đơn & món ăn\n'
            '• 📍 Chi nhánh & địa chỉ\n'
            '• 📅 Đặt bàn & kiểm tra\n'
            '• ⏰ Giờ mở cửa\n'
            '• 💰 Giá cả\n'
            '• 📞 Liên hệ hỗ trợ\n'
            '• 🧀 Nguyên liệu & công thức\n\n'
            'Hoặc gõ "chào" để bắt đầu! 👋'
        )


class ChatbotClearView(APIView):
    """Clear a chatbot session"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        session_id = request.data.get('session_id', 'default')
        ChatSession.objects.filter(session_id=session_id).delete()
        return Response({'message': 'Session cleared', 'session_id': session_id})
