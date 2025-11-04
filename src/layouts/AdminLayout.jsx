// frontend/src/layouts/AdminLayout.jsx (UPDATED)

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/context/AuthContext';
import Sidebar from '@/components/admin/Sidebar';
import { FaExternalLinkAlt, FaSignOutAlt } from 'react-icons/fa'; // <-- NEW IMPORT

const AdminLayout = ({ children }) => {
    const { user, loading, logout } = useAuth(); // <-- Added logout
    const router = useRouter();

    // Protection logic: Redirect if no user
    useEffect(() => {
        if (!loading && !user) {
            router.push('/admin/login');
        }
    }, [user, loading, router]);

    // 1️⃣ Loading screen
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-xl">
                Verifying Session...
            </div>
        );
    }

    // 2️⃣ Show layout only if authenticated
    if (user) {
        return (
            <div className="flex h-screen bg-gray-100">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Section */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    
                    {/* 🧭 HEADER BAR (NEW) */}
                    <header className="flex justify-between items-center p-4 bg-white border-b shadow-sm">
                        {/* Dashboard Title */}
                        <div className="text-xl font-bold text-gray-800">
                            Admin Dashboard
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* NEW: Quick link to public site */}
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-3 py-1 text-sm rounded-lg text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
                            >
                                <FaExternalLinkAlt className="mr-2" />
                                View Public Site
                            </a>

                            {/* Logout button */}
                            <button
                                onClick={logout}
                                className="flex items-center text-sm px-3 py-1 rounded-lg text-red-600 hover:text-red-800 transition-colors"
                            >
                                <FaSignOutAlt className="mr-2" />
                                Logout
                            </button>
                        </div>
                    </header>

                    {/* 🧩 MAIN CONTENT */}
                    <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        );
    }

    // 3️⃣ Fallback (in case of redirect delay)
    return null;
};

export default AdminLayout;
