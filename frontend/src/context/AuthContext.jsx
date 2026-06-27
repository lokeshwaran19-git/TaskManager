import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Set up auto logout on token expiration
  useEffect(() => {
    if (!token) return;

    const decoded = parseJwt(token);
    if (!decoded) {
      logout();
      return;
    }

    const expiryTime = decoded.exp * 1000;
    const remainingTime = expiryTime - Date.now();

    if (remainingTime <= 0) {
      logout('Session expired. Please log in again.');
    } else {
      const timer = setTimeout(() => {
        logout('Session expired. Please log in again.');
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [token]);

  const login = (jwtToken, email, fullName, role) => {
    localStorage.setItem('token', jwtToken);
    const userInfo = { email, fullName, role };
    localStorage.setItem('user', JSON.stringify(userInfo));
    setToken(jwtToken);
    setUser(userInfo);
    toast.success(`Welcome back, ${fullName}!`);
  };

  const logout = (message = null) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    if (message) {
      toast.warning(message);
    }
  };

  const updateProfileState = (email, fullName) => {
    const updatedUser = { ...user, email, fullName };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ token, user, theme, toggleTheme, login, logout, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
