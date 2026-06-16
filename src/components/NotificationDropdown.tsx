import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCircle, MailOpen, Loader } from 'lucide-react';
import { notificationsApi } from '../api/client';
import { Notification } from '../types';
import { useAuth } from '../context/AuthContext';

export default function NotificationDropdown() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const response = await notificationsApi.getAll();
      setNotifications(response.results || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Optional: Poll for new notifications every X seconds
    const interval = setInterval(fetchNotifications, 60000); // Every 1 minute
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen(prev => !prev);
    if (!isOpen && unreadCount > 0) {
      // Mark all as read when opening the dropdown
      markAllAsRead();
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const formatTimeAgo = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds} giây trước`;
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggleDropdown}
        className="relative p-2 hover:bg-[#E5E2DA] rounded-lg transition-colors"
        title="Thông báo"
      >
        <Bell className="w-4 h-4 text-[#4A4A3E]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-[#E5E2DA] rounded-xl shadow-lg z-50 animate-fade-in-down">
          <div className="flex items-center justify-between p-4 border-b border-[#E5E2DA]">
            <h3 className="font-bold text-sm text-[#2C2C2C]">Thông báo của bạn</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-[10px] text-[#4A4A3E] hover:underline">
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-[#BCB8AF]">
                <Loader className="animate-spin w-5 h-5 mx-auto mb-2" />
                Đang tải...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-[#BCB8AF]">
                <MailOpen className="w-6 h-6 mx-auto mb-2" />
                Không có thông báo nào.
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 border-b border-[#E5E2DA] cursor-pointer hover:bg-[#F9F8F6] transition-colors ${
                    !notification.is_read ? 'bg-[#FFFBEB]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold text-sm ${!notification.is_read ? 'text-[#4A4A3E]' : 'text-[#2C2C2C]'}`}>
                      {notification.title}
                    </span>
                    <p className="text-xs text-[#4A4A3E] leading-snug mb-1">
                      {notification.message.length > 100 ? notification.message.substring(0, 97) + '...' : notification.message}
                    </p>
                    <span className="text-[10px] text-[#BCB8AF]">{formatTimeAgo(notification.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-2 text-center border-t border-[#E5E2DA]">
            <button onClick={() => setIsOpen(false)} className="text-[10px] text-[#4A4A3E] hover:underline">
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}