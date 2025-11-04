// frontend/src/pages/admin/counselling/index.jsx

import AdminLayout from '@/layouts/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { FaTrash, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '@/utils/context/AuthContext';
import SearchBar from '@/components/common/SearchBar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CounsellingPage = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const token = user?.token;
    
    // ✅ Local state for UI filters/search
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); 
    
    const getConfig = () => ({
        headers: { Authorization: `Bearer ${token}` }
    });

    // ✅ Data Fetching (READ)
    const { data: requests, isLoading, isError, error } = useQuery({
        queryKey: ['counsellingRequests'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/enrollments/counselling`, getConfig());
            return data;
        },
        enabled: !!token, 
    });

    // ✅ Status Update (PUT)
    const statusMutation = useMutation({
        mutationFn: async (id) => {
            await axios.put(`${API_URL}/enrollments/${id}/process`, {}, getConfig());
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['counsellingRequests']);
            toast.success('Marked as Followed Up!');
        },
        onError: (err) => toast.error(`Status update failed: ${err.response?.data?.message}`),
    });

    // ✅ Data Deletion (DELETE)
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`${API_URL}/enrollments/${id}`, getConfig());
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['counsellingRequests']);
            toast.success('Counselling request deleted.');
        },
        onError: (err) => toast.error(`Deletion failed: ${err.response?.data?.message}`),
    });

    const handleDelete = (id) => {
        if (window.confirm('Delete this counselling request?')) {
            deleteMutation.mutate(id);
        }
    };

    // ✅ Apply Filtering
    const filteredRequests = requests?.filter(request => {
        const matchesSearch =
            request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.courseOfInterest.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filterStatus === 'pending') return matchesSearch && !request.isProcessed;
        if (filterStatus === 'processed') return matchesSearch && request.isProcessed;
        return matchesSearch; 
    }) || [];

    // ✅ Loading & Error Handling
    if (isLoading) return <AdminLayout><div>Loading Counselling Requests...</div></AdminLayout>;
    if (isError) return <AdminLayout><div className="text-red-500">Error: {error?.message}</div></AdminLayout>;

    // ✅ Main Render
    return (
        <AdminLayout>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Counselling Requests Management</h2>
            
            {/* FILTER + SEARCH BAR */}
            <div className="flex justify-between items-center mb-4">
                <SearchBar 
                    searchTerm={searchTerm} 
                    onSearchChange={setSearchTerm} 
                    placeholder="Search by name, email, or topic..."
                />
                
                <div className="flex space-x-3 text-sm font-medium text-gray-700">
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="statusFilter" value="all" checked={filterStatus === 'all'} onChange={() => setFilterStatus('all')} className="mr-1 text-blue-600"/>All
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="statusFilter" value="pending" checked={filterStatus === 'pending'} onChange={() => setFilterStatus('pending')} className="mr-1 text-yellow-600"/>Pending
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="statusFilter" value="processed" checked={filterStatus === 'processed'} onChange={() => setFilterStatus('processed')} className="mr-1 text-green-600"/>Processed
                    </label>
                </div>
            </div>

            {/* ✅ TABLE DISPLAY */}
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRequests.map((request) => (
                            <tr key={request._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(request.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {request.studentName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {request.studentEmail}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                                    {request.courseOfInterest.replace('Counselling Request: ', '')}
                                </td>

                                {/* ✅ UPDATED STATUS BUTTON TD BLOCK */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {request.isProcessed ? (
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                            Followed Up
                                        </span>
                                    ) : (
                                        <button 
                                            onClick={() => statusMutation.mutate(request._id)}
                                            disabled={statusMutation.isLoading}
                                            className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
                                            title="Mark this request as Followed Up"
                                        >
                                            <FaCheckCircle className="mr-1 inline" /> Follow Up
                                        </button>
                                    )}
                                </td>

                                {/* ✅ DELETE BUTTON */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button 
                                        onClick={() => handleDelete(request._id)} 
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

                {filteredRequests.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No counselling requests found.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default CounsellingPage;
