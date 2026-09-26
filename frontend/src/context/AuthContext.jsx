import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('stocksense_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr-001',
      name: 'Alex Mercer',
      email: 'alex.mercer@stocksense.com',
      role: 'Inventory Manager'
    }; // Default logged-in user state for seamless initial viewing
  });

  const [token, setToken] = useState(() => localStorage.getItem('stocksense_token') || 'mock-jwt-token-stocksense-2026');

  useEffect(() => {
    if (user) {
      localStorage.setItem('stocksense_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('stocksense_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('stocksense_token', token);
    } else {
      localStorage.removeItem('stocksense_token');
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const signup = async (name, email, password, role) => {
    const data = await authApi.signup(name, email, password, role);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('stocksense_user');
    localStorage.removeItem('stocksense_token');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
