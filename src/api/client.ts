// API configuration and utilities
import { PaginatedResponse, Branch, Table, Booking, DashboardStatistics, ChatbotResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  [key: string]: any;
}

class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || error.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Build a query string from an object of params, skipping null/undefined.
   */
  buildParams(params: Record<string, any>): string {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined && value !== '') {
        search.append(key, String(value));
      }
    }
    const str = search.toString();
    return str ? `?${str}` : '';
  }
}

export const apiClient = new ApiClient();

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post<{ token: string; user: any }>('/auth/login/', { username, password }),

  register: (userData: any) =>
    apiClient.post<{ token: string; user: any }>('/auth/register/', userData),

  logout: () => {
    apiClient.clearToken();
  },

  getCurrentUser: () =>
    apiClient.get<any>('/users/me/'),
};

// Branches API
export const branchesApi = {
  getAll: (filters?: Record<string, any>) => {
    const qs = filters ? apiClient.buildParams(filters) : '';
    return apiClient.get<PaginatedResponse<Branch>>(`/branches/${qs}`);
  },

  getById: (id: number) =>
    apiClient.get<Branch>(`/branches/${id}/`),

  create: (data: any) =>
    apiClient.post<Branch>('/branches/', data),

  update: (id: number, data: any) =>
    apiClient.patch<Branch>(`/branches/${id}/`, data),

  delete: (id: number) =>
    apiClient.delete<void>(`/branches/${id}/`),
};

// Tables API
export const tablesApi = {
  getAll: (filters?: Record<string, any>) => {
    const qs = filters ? apiClient.buildParams(filters) : '';
    return apiClient.get<PaginatedResponse<Table>>(`/tables/${qs}`);
  },

  getAvailable: (branchId: number, date: string, time: string, zone?: string, capacity?: number) => {
    const params: Record<string, any> = {
      branch_id: branchId,
      date,
      time,
    };
    if (zone && zone !== 'any') params.zone = zone;
    if (capacity) params.capacity = capacity;
    return apiClient.get<Table[]>(`/tables/available_tables/${apiClient.buildParams(params)}`);
  },

  getById: (id: number) =>
    apiClient.get<Table>(`/tables/${id}/`),

  update: (id: number, data: any) =>
    apiClient.patch<Table>(`/tables/${id}/`, data),
};

// Bookings API
export const bookingsApi = {
  getAll: (filters?: Record<string, any>) => {
    const qs = filters ? apiClient.buildParams(filters) : '';
    return apiClient.get<PaginatedResponse<Booking>>(`/bookings/${qs}`);
  },

  getById: (id: number) =>
    apiClient.get<Booking>(`/bookings/${id}/`),

  create: (data: any) =>
    apiClient.post<Booking>('/bookings/', data),

  update: (id: number, data: any) =>
    apiClient.patch<Booking>(`/bookings/${id}/`, data),

  delete: (id: number) =>
    apiClient.delete<void>(`/bookings/${id}/`),

  getMyBookings: () =>
    apiClient.get<Booking[]>('/bookings/my_bookings/'),

  confirm: (id: number) =>
    apiClient.post<Booking>(`/bookings/${id}/confirm/`),

  checkIn: (id: number) =>
    apiClient.post<Booking>(`/bookings/${id}/check_in/`),

  cancel: (id: number) =>
    apiClient.post<Booking>(`/bookings/${id}/cancel/`),

  getStatistics: (filters?: Record<string, any>) => {
    const qs = filters ? apiClient.buildParams(filters) : '';
    return apiClient.get<DashboardStatistics>(`/bookings/statistics/${qs}`);
  },
};

// Notifications API
export const notificationsApi = {
  getAll: () =>
    apiClient.get<PaginatedResponse<any>>('/notifications/'),

  markAsRead: (id: number) =>
    apiClient.post<any>(`/notifications/${id}/mark_as_read/`),

  markAllAsRead: () =>
    apiClient.post<any>('/notifications/mark_all_as_read/'),
};

// Users API
export const usersApi = {
  getAll: () =>
    apiClient.get<PaginatedResponse<any>>('/users/'),

  getById: (id: number) =>
    apiClient.get<any>(`/users/${id}/`),

  changePassword: (id: number, data: any) =>
    apiClient.post<any>(`/users/${id}/change_password/`, data),
};

// Chatbot API
export const chatbotApi = {
  sendMessage: (message: string, sessionId?: string) =>
    apiClient.post<ChatbotResponse>('/chatbot/', {
      message,
      session_id: sessionId || 'default',
    }),

  getHistory: (sessionId?: string) => {
    const qs = sessionId ? `?session_id=${sessionId}` : '';
    return apiClient.get<{ messages: any[] }>(`/chatbot/history/${qs}`);
  },

  clearSession: (sessionId: string) =>
    apiClient.post<void>('/chatbot/clear/', { session_id: sessionId }),
};

export default apiClient;
