import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/utils/context/AuthContext';
import PublicLayout from '@/layouts/PublicLayout';

// Define the API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const RegisterPage = () => {
    // --- 1. HOOKS & STATE ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const router = useRouter();
    const { user, login, isLoading: isAuthLoading } = useAuth();

    // --- 2. REDIRECT IF ALREADY LOGGED IN ---
    useEffect(() => {
        // If auth is not loading and the user is already logged in,
        // redirect them away from the register page.
        if (!isAuthLoading && user) {
            router.replace('/dashboard/profile'); // or wherever your main dashboard is
        }
    }, [user, isAuthLoading, router]);

    // --- 3. API MUTATION (using React Query) ---
    const registerMutation = useMutation({
        mutationFn: (newUserData) => {
            // This function makes the API call
            return axios.post(`${API_URL}/users/register`, newUserData);
        },
        onSuccess: (response) => {
            // This runs if the API call is successful
            toast.success('Registration successful! Logging you in...');
            
            // Automatically log the user in with the data from the backend
            // (Your backend must return { ...user, token, role })
            login(response.data);

            // The useEffect hook will now see the `user` object 
            // and automatically redirect to the dashboard.
        },
        onError: (error) => {
            // This runs if the API call fails
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
        },
    });

    // --- 4. FORM SUBMIT HANDLER ---
    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic client-side validation
        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            return;
        }

        // Call the mutation to register the user
        registerMutation.mutate({ name, email, password });
    };

    // --- 5. JSX (The Form) ---
    return (
        <PublicLayout title="Sign Up - Shafqat Ali Academy">
            <div className="flex justify-center items-center py-12 px-4">
                <div className="max-w-md w-full bg-white p-8 shadow-xl rounded-lg">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                        Create Your Account
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label 
                                htmlFor="name" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label 
                                htmlFor="email" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label 
                                htmlFor="confirmPassword" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={registerMutation.isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {registerMutation.isLoading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
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