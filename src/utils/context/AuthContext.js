// frontend/src/utils/context/AuthContext.js (FINAL SMART REDIRECT FIX)

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

console.log('✅ AuthContext file loaded');
const AuthContext = createContext(undefined);
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // 2. EFFECT (Unchanged)
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
        setLoading(false);
    }, []);

    // --- NEW HELPER FUNCTION: Handles setting state and SMART REDIRECT ---
    const handleLoginSuccess = (data) => {
        // 1. Store user data
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        console.log('✅ Login/Register successful. User role:', data.role);

        // 2. SMART REDIRECT LOGIC
        // Check if a redirect URL was passed to the /login page (e.g., from /enroll?course_slug=X)
        const redirectPath = router.query.redirect;
        
        if (redirectPath) {
            // Redirect to the specific page the user was trying to access
            router.replace(redirectPath);
            return;
        } 
        
        // 3. FALLBACK: Default dashboard redirect (if no specific redirect was requested)
        if (data.role === 'User') {
            router.replace('/my-dashboard'); 
        } else {
            router.replace('/admin/dashboard');
        }
    };
    // --- END NEW FUNCTION ---


    // 3. LOGIN FUNCTION (Updated to call new helper)
    const login = async (email, password) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const { data } = await axios.post(
                `${API_URL}/users/login`,
                { email, password },
                config
            );

            // --- Call the new helper function ---
            handleLoginSuccess(data);

        } catch (error) {
            const errorMessage =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;

            console.error('❌ Login failed:', errorMessage);
            throw new Error(errorMessage);
        }
    };

    // 4. LOGOUT FUNCTION (Unchanged)
    const logout = () => {
        console.log('🚪 Logging out user...');
        localStorage.removeItem('userInfo');
        setUser(null);
        router.push('/'); // Redirect to homepage
    };

    // 5. RETURN CONTEXT PROVIDER (Updated to expose handleLoginSuccess)
    return (
        <AuthContext.Provider value={{ user, login, logout, loading, handleLoginSuccess }}>
            {children}
        </AuthContext.Provider>
    );
};

// 6. Custom Hook (Unchanged)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        console.error('❌ useAuth() called outside <AuthProvider>');
    }
    return context;
};