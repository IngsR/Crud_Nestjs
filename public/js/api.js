// =========================================
// API Client - Central API Service
// =========================================

const API = {
  baseURL: '/api',

  // Get auth token from storage
  getToken() {
    return localStorage.getItem('auth_token');
  },

  // Set auth header
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  },

  // Handle response
  async handleResponse(response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Handle 401 - Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
        throw new Error('Session expired. Please login again.');
      }

      const message = data?.message || `Error: ${response.status}`;
      throw new Error(Array.isArray(message) ? message.join(', ') : message);
    }

    return data;
  },

  // GET request
  async get(endpoint, params = {}) {
    const url = new URL(this.baseURL + endpoint, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  },

  // POST request
  async post(endpoint, data = {}, includeAuth = true) {
    const response = await fetch(this.baseURL + endpoint, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  },

  // PATCH request
  async patch(endpoint, data = {}) {
    const response = await fetch(this.baseURL + endpoint, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  },

  // DELETE request
  async delete(endpoint) {
    const response = await fetch(this.baseURL + endpoint, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    // For 204 No Content responses
    if (response.status === 204) {
      return { success: true };
    }

    return this.handleResponse(response);
  },

  // Auth endpoints
  auth: {
    async login(email, password) {
      return API.post('/auth/login', { email, password }, false);
    },

    async register(email, password) {
      return API.post('/auth/register', { email, password }, false);
    },

    async getProfile() {
      return API.get('/auth/profile');
    },
  },

  // Products endpoints
  products: {
    async getAll(params = {}) {
      return API.get('/products', params);
    },

    async getOne(id) {
      return API.get(`/products/${id}`);
    },

    async create(data) {
      return API.post('/products', data);
    },

    async update(id, data) {
      return API.patch(`/products/${id}`, data);
    },

    async delete(id) {
      return API.delete(`/products/${id}`);
    },
  },

  // Categories endpoints
  categories: {
    async getAll(params = {}) {
      return API.get('/categories', params);
    },

    async getOne(id) {
      return API.get(`/categories/${id}`);
    },

    async create(data) {
      return API.post('/categories', data);
    },

    async update(id, data) {
      return API.patch(`/categories/${id}`, data);
    },

    async delete(id) {
      return API.delete(`/categories/${id}`);
    },
  },

  // Users endpoints
  users: {
    async getAll(params = {}) {
      return API.get('/users', params);
    },

    async getOne(id) {
      return API.get(`/users/${id}`);
    },

    async update(id, data) {
      return API.patch(`/users/${id}`, data);
    },

    async delete(id) {
      return API.delete(`/users/${id}`);
    },
  },
};

// Export for use in other modules
window.API = API;
