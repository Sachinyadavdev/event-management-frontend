// API service utilities
import { config, getApiUrl } from '../config/env.js';

class ApiService {
  constructor() {
    this.baseURL = config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  async request(endpoint, options = {}) {
    const url = getApiUrl(endpoint);
    
    // Get token from localStorage and parse it (since storage.set uses JSON.stringify)
    let token = localStorage.getItem('token');
    if (token) {
      try {
        // Remove quotes if token was JSON stringified
        token = JSON.parse(token);
      } catch (e) {
        // If parsing fails, use token as-is (it's already a plain string)
      }
    }
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      timeout: this.timeout,
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  // POST request
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // PUT request
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

export const apiService = new ApiService();
export default ApiService;