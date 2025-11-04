// frontend/src/pages/admin/blogs/index.jsx

import AdminLayout from '@/layouts/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/utils/context/AuthContext';
import SearchBar from '@/components/common/SearchBar';
import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const BlogsPage = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // 1. Data Fetching
    const { data: blogs, isLoading, isError, error } = useQuery({
        queryKey: ['blogs'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/blogs`);
            return data;
        },
    });

    // ✅ 2. APPLY FILTERING (Published / Unpublished)
    const filteredBlogs =
        blogs?.filter((blog) => {
            const matchesSearch =
                blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.slug.toLowerCase().includes(searchTerm.toLowerCase());

            if (filterStatus === 'published') {
                return matchesSearch && blog.isPublished;
            }
            if (filterStatus === 'unpublished') {
                return matchesSearch && !blog.isPublished;
            }
            return matchesSearch; // 'all'
        }) || [];

    // 3. DELETE MUTATION
    const deleteMutation = useMutation({
        mutationFn: async (blogId) => {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${API_URL}/blogs/${blogId}`, config);
        },
        onSuccess: () => {
            toast.success('Blog post deleted successfully!');
            queryClient.invalidateQueries(['blogs']);
        },
        onError: (err) => {
            toast.error(`Error: ${err.response?.data?.message || 'Failed to delete'}`);
        },
    });

    const handleDelete = (id, title) => {
        if (window.confirm(`Are you sure you want to delete the blog post: ${title}?`)) {
            deleteMutation.mutate(id);
        }
    };

    // --- UI RENDERING ---
    if (isLoading) return <AdminLayout><div>Loading Blogs...</div></AdminLayout>;
    if (isError) return <AdminLayout><div className="text-red-500">Error: {error.message}</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Blog Management</h2>
                <Link
                    href="/admin/blogs/new"
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    <FaPlusCircle className="mr-2" /> Add New Blog Post
                </Link>
            </div>

            {/* ✅ SEARCH + FILTER BAR */}
            <div className="flex justify-between items-center mb-4">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search blogs by title or slug..."
                />

                {/* ✅ NEW FILTER RADIO BUTTONS */}
                <div className="flex space-x-3 text-sm font-medium text-gray-700">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="statusFilter"
                            value="all"
                            checked={filterStatus === 'all'}
                            onChange={() => setFilterStatus('all')}
                            className="mr-1 text-blue-600"
                        />
                        All ({blogs?.length || 0})
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="statusFilter"
                            value="published"
                            checked={filterStatus === 'published'}
                            onChange={() => setFilterStatus('published')}
                            className="mr-1 text-green-600"
                        />
                        Published
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="statusFilter"
                            value="unpublished"
                            checked={filterStatus === 'unpublished'}
                            onChange={() => setFilterStatus('unpublished')}
                            className="mr-1 text-red-600"
                        />
                        Drafts
                    </label>
                </div>
            </div>

            {/* ✅ BLOG TABLE */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBlogs.map((blog) => (
                            <tr key={blog._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{blog.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {blog.author?.username || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            blog.isPublished
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {blog.isPublished ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link
                                        href={`/admin/blogs/${blog._id}/edit`}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(blog._id, blog.title)}
                                        className="text-red-600 hover:text-red-900"
                                        disabled={deleteMutation.isLoading}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ✅ EMPTY STATE */}
                {filteredBlogs.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        {searchTerm
                            ? 'No results found for your search criteria.'
                            : 'No blogs found. Add a new one to begin.'}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default BlogsPage;
