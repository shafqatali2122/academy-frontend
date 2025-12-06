import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/context/AuthContext';
import PublicLayout from '@/layouts/PublicLayout';
import { toast } from 'react-toastify'; // --- THIS IS THE FIX ---

const StudentDashboard = () => {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    // --- Page Protection ---
    useEffect(() => {
        if (!loading && !user) {
            toast.error('You must be logged in to view this page.');
            router.push('/login');
        }
    }, [user, loading, router]);

    // Show loading text
    if (loading || !user) {
        return (
            <PublicLayout title="Loading...">
                <div className="text-center py-20">Loading your dashboard...</div>
            </PublicLayout>
        );
    }

    // --- Render Dashboard ---
    return (
        <PublicLayout title="My Dashboard">
            <div className="max-w-4xl mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold mb-4">
                    Assalam-o-Alaikum, {user.username}!
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                    Welcome to your student dashboard. This is where your enrolled courses
                    will appear once you have purchased them.
                </p>
                
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
        </PublicLayout>
    );
};

export default StudentDashboard;