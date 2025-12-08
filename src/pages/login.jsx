// frontend/src/pages/login.jsx (BRANDING, LAYOUT & SMART REDIRECT FIX)

import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/context/AuthContext';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { FaSignInAlt } from 'react-icons/fa'; 
import Link from 'next/link'; 
import PublicLayout from '@/layouts/PublicLayout'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { user, login } = useAuth();
    const router = useRouter();
    
    // Get the original page the user tried to access (e.g., '/enroll')
    const redirectPath = router.query.redirect;

    // --- AUTH REDIRECT LOGIC ---
    // If the user is ALREADY logged in, redirect them immediately.
    useEffect(() => {
        if (user) {
            // Priority 1: Redirect back to the page they wanted (e.g., /enroll)
            if (redirectPath) {
                router.replace(redirectPath);
            } 
            // Priority 2: Default redirect based on role
            else if (user.role === 'User') {
                router.replace('/my-dashboard');
            } else {
                router.replace('/admin/dashboard');
            }
        }
    }, [user, router, redirectPath]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // login function in AuthContext now handles the smart redirect
            await login(email, password); 
            toast.success('Login Successful! Welcome back.');

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Don't show anything if the user is logged in and redirecting
    if (user) return null; 

    return (
        <PublicLayout title="Sign In - Al Khalil Institute">
            <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 py-12 px-4">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-blue-100">
                    
                    <div className="flex flex-col items-center">
                        <FaSignInAlt className="text-5xl text-blue-600 mb-4" />
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            Sign In to Al Khalil Institute
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Access your account to proceed.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={submitHandler}>
                        
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-lg font-medium text-white transition-colors ${
                                loading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    {/* --- NEW LINKS --- */}
                    <div className="text-center mt-6 text-sm text-gray-600 border-t pt-4">
                        <p className="mb-2">
                            <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot your password?
                            </Link>
                        </p>
                        <p>
                            Don’t have an account?{' '}
                            {/* Pass the redirect parameter to the register page too! */}
                            <Link href={`/register${redirectPath ? `?redirect=${redirectPath}` : ''}`} className="font-medium text-blue-600 hover:text-blue-500">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                
                </div>
            </div>
        </PublicLayout>
    );
};

export default LoginPage;