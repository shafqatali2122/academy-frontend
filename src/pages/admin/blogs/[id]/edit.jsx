// frontend/src/pages/admin/blogs/[id]/edit.jsx

import AdminLayout from '@/layouts/AdminLayout';
import BlogForm from '@/components/admin/BlogForm';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useAuth } from '@/utils/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const EditBlogPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { id } = router.query;

    // 1. Fetch the specific blog data
    const { data: blog, isLoading, isError } = useQuery({
        queryKey: ['blog', id],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/blogs/${id}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            return data;
        },
        enabled: !!id,
        onError: (error) => {
            toast.error(`Error fetching blog: ${error.message}`);
        },
    });

    // --- UI RENDERING ---

    if (isLoading || !id)
        return (
            <AdminLayout>
                <div>Loading Blog Details...</div>
            </AdminLayout>
        );

    if (isError || !blog)
        return (
            <AdminLayout>
                <div className="text-red-500">
                    Error: Could not find blog with ID: {id}
                </div>
            </AdminLayout>
        );

    // Pass the fetched blog data to the BlogForm component
    return (
        <AdminLayout>
            <BlogForm blogData={blog} />
        </AdminLayout>
    );
};

export default EditBlogPage;
