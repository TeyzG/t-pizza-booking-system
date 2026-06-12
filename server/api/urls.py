from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    LoginView, RegisterView, UserViewSet,
    BranchViewSet, TableViewSet, BookingViewSet, NotificationViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'branches', BranchViewSet, basename='branch')
router.register(r'tables', TableViewSet, basename='table')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('', include(router.urls)),
]
