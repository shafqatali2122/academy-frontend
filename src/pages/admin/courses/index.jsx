// frontend/src/pages/admin/courses/index.jsx

import AdminLayout from '@/layouts/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/utils/context/AuthContext';
import SearchBar from '@/components/common/SearchBar';
import { useState } from 'react';

// API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CoursesPage = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // ✅ Add filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // <-- NEW STATE

    // ✅ Data Fetching (READ)
    const { data: courses, isLoading, isError, error } = useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/courses`);
            return data;
        },
    });

    // ✅ Client-side filtering with search and publish status
    const filteredCourses =
        courses?.filter((course) => {
            const matchesSearch =
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.slug.toLowerCase().includes(searchTerm.toLowerCase());

            // Apply Status Filtering: Published (Active) or Unpublished (Inactive)
            if (filterStatus === 'published') {
                return matchesSearch && course.isPublished;
            }
            if (filterStatus === 'unpublished') {
                return matchesSearch && !course.isPublished;
            }
            return matchesSearch; // 'all' status
        }) || [];

    // ✅ Data Deletion (DELETE)
    const deleteMutation = useMutation({
        mutationFn: async (courseId) => {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete(`${API_URL}/courses/${courseId}`, config);
        },
        onSuccess: () => {
            toast.success('Course deleted successfully!');
            queryClient.invalidateQueries(['courses']);
        },
        onError: (err) => {
            toast.error(`Error: ${err.response?.data?.message || 'Failed to delete'}`);
        },
    });

    const handleDelete = (id, title) => {
        if (window.confirm(`Are you sure you want to delete the course: ${title}?`)) {
            deleteMutation.mutate(id);
        }
    };

    // ✅ Loading / Error states
    if (isLoading) return <AdminLayout><div>Loading Courses...</div></AdminLayout>;
    if (isError) return <AdminLayout><div className="text-red-500">Error: {error.message}</div></AdminLayout>;

    // ✅ MAIN RENDER
    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Course Management</h2>
                <Link
                    href="/admin/courses/new"
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    <FaPlusCircle className="mr-2" /> Add New Course
                </Link>
            </div>

            {/* ✅ Total count display */}
            <div className="text-sm text-gray-600 mb-4 font-semibold">
                Total {courses?.length || 0} Courses Found
            </div>

            {/* ✅ Search and Filters */}
            <div className="flex justify-between items-center mb-4">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search courses by title or slug..."
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
                        All ({courses?.length || 0})
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
                        Active
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
                        Inactive
                    </label>
                </div>
            </div>

            {/* ✅ Courses Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Published
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCourses.map((course) => (
                            <tr key={course._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {course.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${course.price ? course.price.toFixed(2) : '0.00'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            course.isPublished
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {course.isPublished ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link
                                        href={`/admin/courses/${course._id}/edit`}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(course._id, course.title)}
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

                {/* ✅ Empty state */}
                {filteredCourses.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        {searchTerm
                            ? 'No results found for your search criteria.'
                            : 'No courses found. Add a new one to begin.'}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default CoursesPage;
