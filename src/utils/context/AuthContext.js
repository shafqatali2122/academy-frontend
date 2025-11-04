// frontend/src/utils/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

// ✅ Diagnostic log to confirm this file is loaded by Next.js
console.log('✅ AuthContext file loaded');

const AuthContext = createContext(undefined); // create context safely

// Get the API URL from the environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  // ✅ Diagnostic log to confirm the provider renders
  console.log('✅ AuthProvider rendered');

  // 1. STATE: Hold the user object and loading status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 2. EFFECT: Check for user in Local Storage on initial load
  useEffect(() => {
    try {
      const userData = localStorage.getItem('userInfo');
      if (userData) {
        setUser(JSON.parse(userData));
        console.log('✅ Existing user loaded from localStorage');
      }
    } catch (err) {
      console.error('⚠️ Failed to parse user data from localStorage', err);
    }
    setLoading(false); // Done checking storage
  }, []);

  // 3. LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };

      // POST request to backend login route
      const { data } = await axios.post(
        `${API_URL}/users/login`,
        { email, password },
        config
      );

      // Store user data and token in local storage
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);

      console.log('✅ Login successful:', data);

      // Redirect to Admin Dashboard
      router.push('/admin/dashboard');
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      console.error('❌ Login failed:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  // 4. LOGOUT FUNCTION
  const logout = () => {
    console.log('🚪 Logging out user...');
    localStorage.removeItem('userInfo');
    setUser(null);
    router.push('/'); // Redirect to homepage or login
  };

  // 5. RETURN CONTEXT PROVIDER
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 6. Custom Hook: Safe access to the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('❌ useAuth() called outside <AuthProvider>');
  }
  return context;
};
