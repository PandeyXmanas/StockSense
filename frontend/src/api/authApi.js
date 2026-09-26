// Isolated API Service for Authentication (Login, Signup, OTP Reset)

const MOCK_USER = {
  id: 'usr-001',
  name: 'Alex Mercer',
  email: 'alex.mercer@stocksense.com',
  role: 'Inventory Manager'
};

export const authApi = {
  async login(email, password) {
    // Simulate network call
    await new Promise((res) => setTimeout(res, 300));
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    return {
      user: { ...MOCK_USER, email },
      token: 'mock-jwt-token-stocksense-2026'
    };
  },

  async signup(name, email, password, role = 'Inventory Manager') {
    await new Promise((res) => setTimeout(res, 300));
    if (!name || !email || !password) {
      throw new Error('Please fill in all required fields.');
    }
    return {
      user: { id: `usr-${Date.now()}`, name, email, role },
      token: 'mock-jwt-token-stocksense-2026'
    };
  },

  async requestOtp(email) {
    await new Promise((res) => setTimeout(res, 300));
    if (!email) {
      throw new Error('Please enter a valid email address.');
    }
    return { message: 'OTP verification code sent to your registered email.' };
  },

  async resetPassword(email, otp, newPassword) {
    await new Promise((res) => setTimeout(res, 300));
    if (!otp || otp.length < 4) {
      throw new Error('Invalid OTP code. Please check and try again.');
    }
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    return { message: 'Password reset successful. You can now log in.' };
  }
};
