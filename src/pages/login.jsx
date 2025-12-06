// frontend/src/pages/login.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/context/AuthContext';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { FaSignInAlt } from 'react-icons/fa'; // --- NEW ICON ---
import Link from 'next/link'; // --- ADDED ---
import PublicLayout from '@/layouts/PublicLayout'; // --- WRAP IN LAYOUT ---

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { user, login } = useAuth();
    const router = useRouter();

    // Redirect if already logged in (this uses the logic from AuthContext)
    useEffect(() => {
        if (user) {
            if (user.role === 'User') {
                router.push('/my-dashboard');
            } else {
                router.push('/admin/dashboard');
            }
        }
    }, [user, router]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Call the login function from AuthContext
            // It will handle the smart redirect
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
        <PublicLayout title="Sign In">
            <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 py-12">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                    
                    <div className="flex flex-col items-center">
                        <FaSignInAlt className="text-5xl text-blue-600 mb-4" /> {/* --- CHANGED --- */}
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            Sign In {/* --- CHANGED --- */}
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Access your SAA account {/* --- CHANGED --- */}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={submitHandler}>
                        
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                loading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    {/* --- NEW LINKS ADDED --- */}
                    <div className="text-center mt-6 text-sm text-gray-600">
                        <p className="mb-2">
                            <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot your password?
                            </Link>
                        </p>
                        <p>
                            Don’t have an account?{' '}
                            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
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