// Auto-detect backend URL in production
const getBackendUrl = () => {
  // If explicitly set via env variable, use it
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // In production (Render), try to detect backend URL
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If frontend is on Render, try common backend URL patterns
    if (hostname.includes('onrender.com')) {
      // Try to construct backend URL from frontend URL
      // Common pattern: frontend might be on one service, backend on another
      // You may need to set VITE_BACKEND_URL in Render environment variables
      // For now, try common backend service names
      const possibleBackends = [
        'https://sarees-backend.onrender.com',
        'https://sareesansaar-backend.onrender.com',
        'https://sareesansaaar-1.onrender.com', // Based on screenshot URL
      ];
      
      // Return first possible backend (you should set VITE_BACKEND_URL in Render)
      console.warn('VITE_BACKEND_URL not set. Please set it in Render environment variables.');
      return possibleBackends[0] || 'http://localhost:5000';
    }
  }
  
  // Default to localhost for development
  return 'http://localhost:5000';
};

const API_URL = `${getBackendUrl()}/api`;

export const fetchSarees = async (category) => {
  try {
    const url = `${API_URL}/products${category ? `?category=${encodeURIComponent(category)}` : ''}`;
    console.log('Fetching products from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        body: errorText
      });
      throw new Error(`Failed to fetch sarees: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Products fetched successfully:', data?.length || 0, 'items');
    return data;
  } catch (error) {
    console.error('Error fetching sarees:', error);
    // Provide more helpful error message
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Unable to connect to server. Please check if the backend is running and VITE_BACKEND_URL is set correctly.');
    }
    throw error;
  }
};

export const fetchSareeById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch saree details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching saree details:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/header`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.navigation.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await fetch(`${API_URL}/header/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

const authHeaders = () => {
  const token = (() => { try { return localStorage.getItem('auth_token'); } catch { return null; } })();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMyAddress = async () => {
  const res = await fetch(`${API_URL}/address/me`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch address');
  return res.json();
};

export const saveMyAddress = async (payload) => {
  const res = await fetch(`${API_URL}/address`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to save address');
  return res.json();
};

export const updateAddressById = async (id, payload) => {
  const res = await fetch(`${API_URL}/address/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update address');
  return res.json();
};

export const deleteAddressById = async (id) => {
  const res = await fetch(`${API_URL}/address/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete address');
  return res.json();
};

export const createPaymentOrder = async (amount, notes = {}) => {
  const res = await fetch(`${API_URL}/payment/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ amount, currency: 'INR', notes }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to create payment order');
  return res.json();
};

export const verifyPayment = async (payload) => {
  const res = await fetch(`${API_URL}/payment/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to verify payment');
  return res.json();
};

export const getMyOrders = async () => {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};
