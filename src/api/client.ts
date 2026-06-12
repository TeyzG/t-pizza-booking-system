// API configuration and utilities
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
}

export const apiClient = new ApiClient();

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post<any>('/auth/login/', { username, password }),

  register: (userData: any) =>
    apiClient.post<any>('/auth/register/', userData),

  logout: () => {
    apiClient.clearToken();
  },

  getCurrentUser: () =>
    apiClient.get<any>('/users/me/'),
};

// Branches API
export const branchesApi = {
  getAll: (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    return apiClient.get<any>(`/branches/${params ? '?' + params : ''}`);
  },

  getById: (id: string) =>
    apiClient.get<any>(`/branches/${id}/`),

  create: (data: any) =>
    apiClient.post<any>('/branches/', data),

  update: (id: string, data: any) =>
    apiClient.patch<any>(`/branches/${id}/`, data),

  delete: (id: string) =>
    apiClient.delete<any>(`/branches/${id}/`),
};

// Tables API
export const tablesApi = {
  getAll: (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    return apiClient.get<any>(`/tables/${params ? '?' + params : ''}`);
  },

  getAvailable: (branchId: string, date: string, time: string, zone?: string, capacity?: number) => {
    const params = new URLSearchParams({
      branch_id: branchId,
      date,
      time,
      ...(zone && { zone }),
      ...(capacity && { capacity: capacity.toString() }),
    }).toString();
    return apiClient.get<any>(`/tables/available_tables/?${params}`);
  },

  getById: (id: string) =>
    apiClient.get<any>(`/tables/${id}/`),

  update: (id: string, data: any) =>
    apiClient.patch<any>(`/tables/${id}/`, data),
};

// Bookings API
export const bookingsApi = {
  getAll: (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    return apiClient.get<any>(`/bookings/${params ? '?' + params : ''}`);
  },

  getById: (id: string) =>
    apiClient.get<any>(`/bookings/${id}/`),

  create: (data: any) =>
    apiClient.post<any>('/bookings/', data),

  update: (id: string, data: any) =>
    apiClient.patch<any>(`/bookings/${id}/`, data),

  delete: (id: string) =>
    apiClient.delete<any>(`/bookings/${id}/`),

  getMyBookings: () =>
    apiClient.get<any>('/bookings/my_bookings/'),

  confirm: (id: string) =>
    apiClient.post<any>(`/bookings/${id}/confirm/`),

  checkIn: (id: string) =>
    apiClient.post<any>(`/bookings/${id}/check_in/`),

  cancel: (id: string) =>
    apiClient.post<any>(`/bookings/${id}/cancel/`),

  getStatistics: (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    return apiClient.get<any>(`/bookings/statistics/${params ? '?' + params : ''}`);
  },
};

// Notifications API
export const notificationsApi = {
  getAll: () =>
    apiClient.get<any>('/notifications/'),

  markAsRead: (id: string) =>
    apiClient.post<any>(`/notifications/${id}/mark_as_read/`),

  markAllAsRead: () =>
    apiClient.post<any>('/notifications/mark_all_as_read/'),
};

// Users API
export const usersApi = {
  getAll: () =>
    apiClient.get<any>('/users/'),

  getById: (id: string) =>
    apiClient.get<any>(`/users/${id}/`),

  changePassword: (id: string, data: any) =>
    apiClient.post<any>(`/users/${id}/change_password/`, data),
};

export default apiClient;
