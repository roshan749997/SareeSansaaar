// src/utils/api.js

// Prefer VITE_BACKEND_URL. If not set, fall back to window.location.origin in browser.
// Make sure VITE_BACKEND_URL is defined for production builds (Vite requires VITE_ prefix).
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? (typeof window !== 'undefined' ? window.location.origin : '');
console.log('API_BASE_URL', API_BASE_URL);

function buildUrl(path) {
  // ensure path begins with /
  if (!path.startsWith('/')) path = `/${path}`;
  // Use URL to safely join base + path
  try {
    return new URL(path, API_BASE_URL).toString();
  } catch {
    // fallback (if API_BASE_URL empty)
    return `${API_BASE_URL}${path}`;
  }
}

async function request(path, options = {}) {
  const url = buildUrl(path);

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  // cookie session marker: token === 'cookie'
  const isCookieSession = token === 'cookie';
  // For tokens which are JWT-like we expect a dot (.), but don't rely solely on that. Use explicit 'cookie' marker in your app.
  const headers = { ...(options.headers || {}) };

  const body = options.body;
  // If body is FormData, don't set Content-Type — the browser sets the boundary automatically.
  if (!(body instanceof FormData)) {
    // set Content-Type only if not already provided
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
  }

  if (!isCookieSession && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Build final fetch options
  const fetchOpts = {
    ...options,
    headers,
    // include credentials only when you're using cookie-based sessions
    credentials: isCookieSession ? 'include' : 'same-origin',
  };

  // Avoid sending body on GET/HEAD
  if (fetchOpts.method && ['GET', 'HEAD'].includes(fetchOpts.method.toUpperCase())) {
    delete fetchOpts.body;
  }

  const res = await fetch(url, fetchOpts);

  // handle no-content responses (204)
  if (res.status === 204) return {};

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }

  if (!res.ok) {
    // Attach status to the error for easier debugging
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.response = data;
    throw err;
  }
  return data;
}

export const api = {
  signin: (payload) => request('/auth/signin', { method: 'POST', body: JSON.stringify(payload) }),
  signup: (payload) => request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  forgotPassword: (payload) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload) }),

  me: async () => {
    try {
      return await request('/me', { method: 'GET' });
    } catch (e) {
      // Fallback for older APIs
      return await request('/auth/me', { method: 'GET' });
    }
  },

  // Cart endpoints
  getCart: () => request('/cart', { method: 'GET' }),
  addToCart: ({ productId, quantity = 1 }) => request('/cart/add', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  removeFromCart: (productId) => request(`/cart/remove/${productId}`, { method: 'DELETE' }),

  // Admin endpoints
  admin: {
    stats: () => request('/admin/stats', { method: 'GET' }),
    createProduct: (payload) => request('/admin/products', { method: 'POST', body: JSON.stringify(payload) }),
    updateProduct: (id, payload) => request(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    listProducts: () => request('/admin/products', { method: 'GET' }),
    deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
    listOrders: () => request('/admin/orders', { method: 'GET' }),
    listAddresses: () => request('/admin/addresses', { method: 'GET' }),

    // more robust updateOrderStatus that tries multiple routes
    updateOrderStatus: async (id, status) => {
      const base = API_BASE_URL;
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const isCookieSession = token === 'cookie';
      const headers = {
        'Content-Type': 'application/json',
        ...(!isCookieSession && token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const payloadVariants = [{ status }, { orderStatus: status }];
      const opts = (method, body) => ({ method, headers, body: JSON.stringify(body), credentials: isCookieSession ? 'include' : 'same-origin' });
      const tryRoutes = [
        { path: `/admin/orders/${id}/status`, methods: ['PUT', 'POST', 'PATCH'] },
        { path: `/admin/orders/${id}`, methods: ['PATCH', 'PUT'] },
        { path: `/orders/${id}/status`, methods: ['PUT', 'POST', 'PATCH'] },
        { path: `/orders/${id}`, methods: ['PATCH', 'PUT'] },
        { path: `/admin/order-status/${id}`, methods: ['PUT', 'POST'] },
      ];
      let lastErr;
      for (const route of tryRoutes) {
        for (const method of route.methods) {
          for (const body of payloadVariants) {
            try {
              const url = new URL(route.path, base).toString();
              const res = await fetch(url, opts(method, body));
              const text = await res.text();
              let data; try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
              if (!res.ok) { lastErr = new Error(`${res.status} ${res.statusText} at ${url}`); continue; }
              return data;
            } catch (e) {
              lastErr = e;
            }
          }
        }
      }
      throw lastErr || new Error('Failed to update order status');
    },
  },
};

export default api;
