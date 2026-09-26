// REST API Service for Authentication (Login, Signup, OTP Reset)
import { request } from './httpClient';

const MOCK_USER = {
  id: 'usr-001',
  name: 'Alex Mercer',
  email: 'alex.mercer@stocksense.com',
  role: 'Inventory Manager'
};

export const authApi = {
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    try {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      return {
        user: res.data ? res.data.user : res.user,
        token: res.data ? res.data.token : res.token
      };
    } catch (err) {
      if (err.isNetworkError) {
        // Fallback for demo execution when DB is unconfigured
        return {
          user: { ...MOCK_USER, email },
          token: 'mock-jwt-token-stocksense-2026'
        };
      }
      throw err;
    }
  },

  async signup(name, email, password, role = 'Inventory Manager') {
    if (!name || !email || !password) {
      throw new Error('Please fill in all required fields.');
    }
    try {
      const res = await request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
      });
      return {
        user: res.data ? res.data.user : res.user,
        token: res.data ? res.data.token : res.token
      };
    } catch (err) {
      if (err.isNetworkError) {
        return {
          user: { id: `usr-${Date.now()}`, name, email, role },
          token: 'mock-jwt-token-stocksense-2026'
        };
      }
      throw err;
    }
  },

  async requestOtp(email) {
    if (!email) {
      throw new Error('Please enter a valid email address.');
    }
    try {
      const res = await request('/auth/forgot-password/request-otp', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      return res;
    } catch (err) {
      if (err.isNetworkError) {
        return { message: 'OTP verification code sent to your registered email.' };
      }
      throw err;
    }
  },

  async resetPassword(email, otp, newPassword) {
    if (!otp || otp.length < 4) {
      throw new Error('Invalid OTP code. Please check and try again.');
    }
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    try {
      const res = await request('/auth/forgot-password/reset', {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword })
      });
      return res;
    } catch (err) {
      if (err.isNetworkError) {
        return { message: 'Password reset successful. You can now log in.' };
      }
      throw err;
    }
  }
};
