// frontend/pages/admin/login.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/context/AuthContext';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { FaUserShield } from 'react-icons/fa';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Get login function and user status from context
    const { user, login } = useAuth();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/admin/dashboard');
        }
    }, [user, router]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Call the login function from AuthContext
            await login(email, password); 
            toast.success('Login Successful! Welcome Back Admin.');

        } catch (error) {
            // Display error message using react-toastify
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // If user is already logged in, show nothing or a loading spinner briefly
    if (user) return null; 

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                
                <div className="flex flex-col items-center">
                    <FaUserShield className="text-5xl text-blue-600 mb-4" />
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Admin Login
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Shafqat Ali Academy CMS Access
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
                            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    >
                        {loading ? 'Logging In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;