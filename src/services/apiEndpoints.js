import { apiService } from './api.js';

// Authentication API
export const authAPI = {
  // Register new user
  register: (userData) => apiService.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => apiService.post('/auth/login', credentials),
  
  // Get current user profile
  getProfile: () => apiService.get('/auth/me'),
  
  // Update profile
  updateProfile: (data) => apiService.put('/auth/profile', data),
  
  // Change password
  changePassword: (passwords) => apiService.put('/auth/password', passwords),
};

// Users API (Admin)
export const usersAPI = {
  // Get all users
  getAll: (params) => apiService.get('/users', { 
    headers: params ? { 'query': new URLSearchParams(params).toString() } : {}
  }),
  
  // Get user by ID
  getById: (id) => apiService.get(`/users/${id}`),
  
  // Update user
  update: (id, data) => apiService.put(`/users/${id}`, data),
  
  // Delete user
  delete: (id) => apiService.delete(`/users/${id}`),
  
  // Update user status
  updateStatus: (id, status) => apiService.put(`/users/${id}/status`, { status }),
  
  // Update user role
  updateRole: (id, role_id) => apiService.put(`/users/${id}/role`, { role_id }),
  
  // Get user statistics
  getStats: () => apiService.get('/users/stats'),
};

// Events API
export const eventsAPI = {
  // Get all events
  getAll: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiService.get(`/events${queryString}`);
  },
  
  // Get event by ID
  getById: (id) => apiService.get(`/events/${id}`),
  
  // Create event (Admin)
  create: (eventData) => apiService.post('/events', eventData),
  
  // Update event (Admin)
  update: (id, eventData) => apiService.put(`/events/${id}`, eventData),
  
  // Delete event (Admin)
  delete: (id) => apiService.delete(`/events/${id}`),
  
  // Get event statistics (Admin)
  getStats: () => apiService.get('/events/stats'),
};

// Registrations API
export const registrationsAPI = {
  // Register for event
  register: (eventId) => apiService.post(`/registrations/${eventId}`, {}),
  
  // Cancel registration
  cancel: (eventId) => apiService.delete(`/registrations/${eventId}`),
  
  // Get my registrations
  getMy: () => apiService.get('/registrations/my'),
  getMyRegistrations: () => apiService.get('/registrations/my'), // Alias for consistency
  
  // Get event attendees (Admin)
  getEventAttendees: (eventId) => apiService.get(`/registrations/event/${eventId}`),
  
  // Mark as attended (Admin)
  markAttended: (id, data) => apiService.put(`/registrations/${id}/attended`, data),
  
  // Update payment status (Admin)
  updatePayment: (id, data) => apiService.put(`/registrations/${id}/payment`, data),
};

// Notifications API
export const notificationsAPI = {
  // Get notifications
  getAll: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiService.get(`/notifications${queryString}`);
  },
  getMyNotifications: (params) => { // Alias for consistency
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiService.get(`/notifications${queryString}`);
  },
  
  // Get unread count
  getUnreadCount: () => apiService.get('/notifications/unread-count'),
  
  // Mark as read
  markAsRead: (id) => apiService.put(`/notifications/${id}/read`, {}),
  
  // Mark all as read
  markAllAsRead: () => apiService.put('/notifications/read-all', {}),
  
  // Delete notification
  delete: (id) => apiService.delete(`/notifications/${id}`),
  
  // Create notification (Admin)
  create: (data) => apiService.post('/notifications', data),
};

// Certificates API
export const certificatesAPI = {
  // Get my certificates
  getMy: () => apiService.get('/certificates/my'),
  getMyCertificates: () => apiService.get('/certificates/my'), // Alias for consistency
  
  // Issue certificate (Admin)
  issue: (data) => apiService.post('/certificates', data),
};

// Support Tickets API
export const supportAPI = {
  // Get tickets
  getAll: () => apiService.get('/support'),
  
  // Create ticket
  create: (data) => apiService.post('/support', data),
  
  // Update ticket (Admin)
  update: (id, data) => apiService.put(`/support/${id}`, data),
};

// Roles API
export const rolesAPI = {
  // Get all roles
  getAll: () => apiService.get('/roles'),
};

// Dashboard API (Admin)
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: () => apiService.get('/dashboard/stats'),
};

export default {
  auth: authAPI,
  users: usersAPI,
  events: eventsAPI,
  registrations: registrationsAPI,
  notifications: notificationsAPI,
  certificates: certificatesAPI,
  support: supportAPI,
  roles: rolesAPI,
  dashboard: dashboardAPI,
};
