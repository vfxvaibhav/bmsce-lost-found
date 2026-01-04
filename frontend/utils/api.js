import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// Items API
export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  getUserItems: () => api.get('/items/user/my-items'),
  create: (formData) => api.post('/items/report', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
};

// Claims API
export const claimsAPI = {
  create: (claimData) => api.post('/claims', claimData),
  getUserClaims: () => api.get('/claims/my-claims'),
  getClaimsForUserItems: () => api.get('/claims/for-my-items'),
  getById: (id) => api.get(`/claims/${id}`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getItems: (params) => api.get('/admin/items', { params }),
  getClaims: (params) => api.get('/admin/claims', { params }),
  reviewClaim: (id, data) => api.put(`/admin/claims/${id}/review`, data),
  deleteItem: (id) => api.delete(`/admin/items/${id}`),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
};

export default api;