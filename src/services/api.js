// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  console.log('📡 API Response:', {
    url: response.url,
    status: response.status,
    ok: response.ok,
    data
  });
  
  if (!response.ok) {
    // Handle validation errors
    if (data.errors && Array.isArray(data.errors)) {
      const error = new Error(data.message || 'Validation failed');
      error.errors = data.errors;
      throw error;
    }
    
    // API returned an error
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  // Check if success is false even with 200 status
  if (data.success === false) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    console.log('🔐 Register API called with:', { ...userData, password: '***' });
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    console.log('🔐 Login API called with:', { ...credentials, password: '***' });
    console.log('🌐 API URL:', `${API_BASE_URL}/auth/login`);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await handleResponse(response);
    
    // Store token in localStorage
    if (data.success && data.data.token) {
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      console.log('✅ Token stored in localStorage');
    }
    
    return data;
  },

  logout: () => {
    console.log('👋 Logging out...');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    console.log('✅ Logged out successfully');
  },

  getCurrentUser: async () => {
    const token = getAuthToken();
    if (!token) throw new Error('No auth token');

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  isAuthenticated: () => {
    const token = getAuthToken();
    const hasToken = !!token;
    console.log('🔍 Is authenticated?', hasToken);
    return hasToken;
  }
};

// Listings API
export const listingsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/listings${queryString ? `?${queryString}` : ''}`;
    console.log('📚 Fetching listings from:', url);
    
    const response = await fetch(url);
    return handleResponse(response);
  },

  getById: async (id) => {
    console.log('📖 Fetching listing:', id);
    const response = await fetch(`${API_BASE_URL}/listings/${id}`);
    return handleResponse(response);
  },

  create: async (listingData) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    console.log('➕ Creating listing:', listingData);

    // Use FormData so image files are sent as multipart/form-data
    const formData = new FormData();
    const { images, ...fields } = listingData;

    // Append all text fields
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // Append image files
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      headers: {
        // Do NOT set Content-Type — browser sets it automatically with boundary for FormData
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    return handleResponse(response);
  },

  update: async (id, updates) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    console.log('✏️ Updating listing:', id, updates);
    const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    console.log('🗑️ Deleting listing:', id);
    const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  getUserListings: async (userId, status = 'available') => {
    console.log('👤 Fetching user listings:', userId, status);
    const response = await fetch(`${API_BASE_URL}/listings/user/${userId}?status=${status}`);
    return handleResponse(response);
  }
};

// Requests API
export const requestsAPI = {
  create: async (requestData) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    console.log('📮 Creating request:', requestData);
    const response = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestData)
    });
    return handleResponse(response);
  },

  getSent: async () => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    console.log('📤 Fetching sent requests');
    const response = await fetch(`${API_BASE_URL}/requests/sent`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  getReceived: async () => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    console.log('📥 Fetching received requests');
    const response = await fetch(`${API_BASE_URL}/requests/received`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  accept: async (id) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    console.log('✅ Accepting request:', id);
    const response = await fetch(`${API_BASE_URL}/requests/${id}/accept`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  reject: async (id) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    console.log('❌ Rejecting request:', id);
    const response = await fetch(`${API_BASE_URL}/requests/${id}/reject`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  complete: async (id, transactionData) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    console.log('✔️ Completing request:', id, transactionData);
    const response = await fetch(`${API_BASE_URL}/requests/${id}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(transactionData)
    });
    return handleResponse(response);
  },

  cancel: async (id) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    console.log('🚫 Cancelling request:', id);
    const response = await fetch(`${API_BASE_URL}/requests/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  }
};

// Users API
export const usersAPI = {
  getProfile: async (userId) => {
    console.log('👤 Fetching user profile:', userId);
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    return handleResponse(response);
  },

  updateProfile: async (userId, updates) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');

    console.log('✏️ Updating profile:', userId, updates);
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  getReviews: async (userId) => {
    console.log('⭐ Fetching user reviews:', userId);
    const response = await fetch(`${API_BASE_URL}/users/${userId}/reviews`);
    return handleResponse(response);
  }
};

// Export all APIs
export default {
  auth: authAPI,
  listings: listingsAPI,
  requests: requestsAPI,
  users: usersAPI
};
