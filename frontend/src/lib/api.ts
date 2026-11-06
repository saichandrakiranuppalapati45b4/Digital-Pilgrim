import { ApiResponse } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Include HttpOnly cookies
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: 'Failed to parse JSON response from server',
  }));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Heritage
  getHeritage: (params?: {
    search?: string;
    category?: string;
    status?: string;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
    }
    const query = searchParams.toString();
    return fetcher<any[]>(`/heritage${query ? `?${query}` : ''}`);
  },

  getFeaturedHeritage: () => fetcher<any[]>('/heritage/featured'),

  getHeritageBySlug: (slug: string) => fetcher<any>(`/heritage/${slug}`),

  createHeritage: (data: any) =>
    fetcher<any>('/heritage', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateHeritage: (id: string, data: any) =>
    fetcher<any>(`/heritage/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteHeritage: (id: string) =>
    fetcher<any>(`/heritage/${id}`, {
      method: 'DELETE',
    }),

  // Events
  getEvents: (status?: string) =>
    fetcher<any[]>(`/events${status ? `?status=${status}` : ''}`),

  createEvent: (data: any) =>
    fetcher<any>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateEvent: (id: string, data: any) =>
    fetcher<any>(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteEvent: (id: string) =>
    fetcher<any>(`/events/${id}`, {
      method: 'DELETE',
    }),

  // Announcements
  getAnnouncements: (type?: string, priority?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (priority) params.append('priority', priority);
    const query = params.toString();
    return fetcher<any[]>(`/announcements${query ? `?${query}` : ''}`);
  },

  createAnnouncement: (data: any) =>
    fetcher<any>('/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateAnnouncement: (id: string, data: any) =>
    fetcher<any>(`/announcements/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteAnnouncement: (id: string) =>
    fetcher<any>(`/announcements/${id}`, {
      method: 'DELETE',
    }),

  // Facilities
  getFacilities: (type?: string, verifiedOnly?: boolean) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (verifiedOnly) params.append('verifiedOnly', 'true');
    const query = params.toString();
    return fetcher<any[]>(`/facilities${query ? `?${query}` : ''}`);
  },

  createFacility: (data: any) =>
    fetcher<any>('/facilities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateFacility: (id: string, data: any) =>
    fetcher<any>(`/facilities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteFacility: (id: string) =>
    fetcher<any>(`/facilities/${id}`, {
      method: 'DELETE',
    }),

  // QR
  getQR: (locationId: string) => fetcher<any>(`/qr/${locationId}`),

  // Auth
  login: (credentials: { email: string; password: string }) =>
    fetcher<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    fetcher<null>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () => fetcher<any>('/auth/me'),

  // Stats
  getDashboardStats: () => fetcher<any>('/stats'),

  // Health
  getHealth: () => fetcher<any>('/health'),
};
