// frontend/src/pages/admin/dashboard.jsx

import AdminLayout from '@/layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    FaUsers,
    FaBookOpen,
    FaRegNewspaper,
    FaCommentDots,
    FaCheckCircle,
} from 'react-icons/fa';
import { useAuth } from '@/utils/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const DashboardHome = () => {
    const { user } = useAuth();
    const token = user?.token;

    const getConfig = () => ({
        headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Fetch updated dashboard stats
    const { data: statsData, isLoading, isError } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/users/dashboard-stats`, getConfig());
            return data;
        },
        enabled: !!token,
        refetchOnWindowFocus: true,
    });

    // ✅ Corrected and Expanded Metrics Array
    const stats = [
        // 1. Total Courses
        { title: 'Total Courses', value: statsData?.totalCourses || 0, icon: FaBookOpen, color: 'text-green-600' },

        // 2. Published Blogs
        { title: 'Published Blogs', value: statsData?.publishedBlogs || 0, icon: FaRegNewspaper, color: 'text-blue-600' },

        // 3. Draft Blogs (new metric)
        { title: 'Draft Blogs', value: statsData?.draftBlogs || 0, icon: FaRegNewspaper, color: 'text-gray-500' },

        // 4. Pending Counselling (new key confirmed)
        { title: 'Pending Counselling', value: statsData?.pendingCounselling || 0, icon: FaCommentDots, color: 'text-indigo-600' },

        // 5. Pending Enrollments (Leads)
        { title: 'Pending Leads', value: statsData?.pendingEnrollments || 0, icon: FaUsers, color: 'text-yellow-600' },

        // 6. Processed Enrollments (Leads)
        { title: 'Processed Leads', value: statsData?.processedEnrollments || 0, icon: FaCheckCircle, color: 'text-green-500' },
    ];

    // ✅ Loading State
    if (isLoading) {
        return (
            <AdminLayout>
                <div className="text-center py-10">Loading Dashboard Statistics...</div>
            </AdminLayout>
        );
    }

    // ✅ Error State
    if (isError) {
        return (
            <AdminLayout>
                <div className="text-red-500 text-center py-10">
                    Error loading data. Please check backend connection.
                </div>
            </AdminLayout>
        );
    }

    // ✅ Render Dashboard
    return (
        <AdminLayout>
            {/* Expanded grid layout for 6 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-white p-4 rounded-xl shadow-md flex items-start justify-between transition-transform duration-300 hover:scale-[1.02] border-l-4 border-blue-500"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-2xl font-extrabold text-gray-900 truncate">{stat.value}</p>
                            <p className="text-xs font-medium text-gray-500 mt-0.5">{stat.title}</p>
                        </div>
                        <stat.icon className={`text-3xl mt-1 ${stat.color} ml-3 flex-shrink-0`} />
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">Welcome, Admin!</h2>
                <p className="text-gray-600">
                    Use the sidebar on the left to manage all content, student enrollments, and blog posts for the
                    Shafqat Ali Academy.
                </p>
            </div>
        </AdminLayout>
    );
};

export default DashboardHome;
