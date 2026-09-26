// Centralized HTTP client for StockSense REST API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('stocksense_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.message || data.error || `HTTP ${response.status} Error`;
      const err = new Error(errorMessage);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    // If it's a network error (backend offline), throw a descriptive error or let callers handle fallback
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const networkErr = new Error('Unable to connect to StockSense backend server. Please verify backend is running on http://localhost:5000');
      networkErr.isNetworkError = true;
      throw networkErr;
    }
    throw err;
  }
}
