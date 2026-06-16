from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    LoginView, RegisterView, UserViewSet,
    BranchViewSet, TableViewSet, BookingViewSet, NotificationViewSet, CategoryViewSet, MenuItemViewSet,
    ChatbotView, ChatbotClearView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'branches', BranchViewSet, basename='branch')
router.register(r'tables', TableViewSet, basename='table')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'menu/categories', CategoryViewSet, basename='menu-category')
router.register(r'menu/items', MenuItemViewSet, basename='menu-item')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    
    # Chatbot endpoints
    path('chatbot/', ChatbotView.as_view(), name='chatbot'),
    path('chatbot/history/', ChatbotView.as_view(), name='chatbot-history'),
    path('chatbot/clear/', ChatbotClearView.as_view(), name='chatbot-clear'),
    
    path('', include(router.urls)),
]
