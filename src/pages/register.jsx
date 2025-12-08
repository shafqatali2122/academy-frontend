// frontend/src/pages/register.jsx (CLEANED LAYOUT & BRANDING)

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/utils/context/AuthContext';
import PublicLayout from '@/layouts/PublicLayout';
import { FaUserPlus } from 'react-icons/fa'; // Use a clean icon

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const router = useRouter();
    const { user, handleLoginSuccess, isLoading: isAuthLoading } = useAuth();
    
    // --- AUTH REDIRECT LOGIC ---
    useEffect(() => {
        // Only redirect here if the user is already logged in AND wasn't redirected here (no query.redirect), send them to their dashboard
        if (!isAuthLoading && user && !router.query.redirect) {
            const path = user.role === 'User' ? '/my-dashboard' : '/admin/dashboard';
            router.replace(path);
        }
    }, [user, isAuthLoading, router]);
    // --- END AUTH REDIRECT LOGIC ---

    const registerMutation = useMutation({
        mutationFn: (newUserData) => {
            return axios.post(`${API_URL}/users/register`, newUserData);
        },
        onSuccess: (response) => {
            toast.success('Registration successful! Logging you in...');
            handleLoginSuccess(response.data); // Smart redirect to previous page (enrollment)
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            return;
        }
        registerMutation.mutate({ username, email, password });
    };

    if (!isAuthLoading && user && !router.query.redirect) return null; // Prevent showing the form if logged in and redirecting

    return (
        <PublicLayout title="Sign Up - Al Khalil Institute">
            <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 py-12 px-4">
                <div className="max-w-md w-full bg-white p-8 space-y-6 shadow-2xl rounded-lg border border-blue-100">
                    
                    <div className="flex flex-col items-center">
                        <FaUserPlus className="text-5xl text-blue-600 mb-4" />
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            Create Your Al Khalil Account
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Begin your journey with us.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="name" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm" />
                        </div>
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm" />
                        </div>
                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm" />
                        </div>
                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm" />
                        </div>


                        <div>
                            <button
                                type="submit"
                                disabled={registerMutation.isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                            >
                                {registerMutation.isLoading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link 
                                href="/login" 
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default RegisterPage;