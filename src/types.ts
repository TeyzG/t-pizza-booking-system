// ============================================================
// T'Pizza Booking System - TypeScript Types (API-compatible)
// All fields use snake_case to match Django REST Framework
// ============================================================

export interface Branch {
  id: number;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  image_url: string;
  rating: number;
  status: 'active' | 'busy' | 'maintenance';
  status_display: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Table {
  id: number;
  branch: number;
  branch_name: string;
  table_number: string;
  capacity: number;
  zone: 'indoor' | 'outdoor' | 'mezzanine' | 'kiln';
  zone_display: string;
  is_available: boolean;
  notes: string;
}

export interface Booking {
  id: number;
  booking_code: string;
  customer: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  branch: number;
  branch_name: string;
  table: number | null;
  table_number: string | null;
  booking_date: string;
  booking_time: string;
  adult_count: number;
  children_count: number;
  total_guests: number;
  zone_preference: 'indoor' | 'outdoor' | 'mezzanine' | 'kiln';
  zone_preference_display: string;
  special_requests: string;
  customer_notes: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'cancelled' | 'expired';
  status_display: string;
  checked_in_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingCreate {
  branch: number;
  booking_date: string;
  booking_time: string;
  adult_count: number;
  children_count?: number;
  zone_preference: string;
  special_requests?: string;
  customer_notes?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: number | null;
  role_name: string;
  is_active: boolean;
  created_at: string;
}

export interface Notification {
  id: number;
  user: number;
  booking: number | null;
  notification_type: string;
  notification_type_display: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardStatistics {
  total_bookings: number;
  pending_confirmations: number;
  confirmed_bookings: number;
  checked_in_count: number;
  total_guests: number;
  hourly_distribution: Record<string, number>;
  zone_distribution: Record<string, number>;
}

// === Menu Types ===

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  price_display: string;
  image_url: string | null;
  is_available: boolean;
  is_special: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  order: number;
  menu_items: MenuItem[];
}

// === Chatbot Types ===

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatbotQuery {
  message: string;
  session_id: string;
}

export interface ChatbotResponse {
  answer: string;
  intent: string;
  session_id: string;
}

// === Paginated API Response ===

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
