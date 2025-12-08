import AdminLayout from '@/layouts/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaDownload, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/utils/context/AuthContext';
import { exportToCsv } from '@/utils/exportToCsv';
import SearchBar from '@/components/common/SearchBar';
import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const EnrollmentsPage = () => {
    // Component Setup
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const token = user?.token;

    const [searchTerm, setSearchTerm] = useState('');
    // FIX: Default filter status set to 'pending' (Visibility fix)
    const [filterStatus, setFilterStatus] = useState('pending'); 
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const getConfig = () => ({
        headers: { Authorization: `Bearer ${token}` },
    });

    // Data Fetching
    const { data: enrollments, isLoading, isError, error } = useQuery({
        queryKey: ['enrollments'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/enrollments`, getConfig());
            return data;
        },
        enabled: !!token,
    });

    // Filtering Logic
    const filteredEnrollments =
        enrollments?.filter((enrollment) => {
            const matchesSearch =
                enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enrollment.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enrollment.courseOfInterest.toLowerCase().includes(searchTerm.toLowerCase());

            if (filterStatus === 'pending') return matchesSearch && !enrollment.isProcessed;
            if (filterStatus === 'processed') return matchesSearch && enrollment.isProcessed;
            return matchesSearch;
        }) || [];

    // Selection Logic
    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredEnrollments.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredEnrollments.map((e) => e._id));
        }
    };

    // Export Logic
    const handleExportOption = (option) => {
        let dataToExport = [];
        if (option === 'all') dataToExport = enrollments;
        else if (option === 'pending') dataToExport = enrollments.filter((e) => !e.isProcessed);
        else if (option === 'processed') dataToExport = enrollments.filter((e) => e.isProcessed);
        else if (option === 'selected')
            dataToExport = enrollments.filter((e) => selectedIds.includes(e._id));

        if (dataToExport.length > 0) {
            const filename = `enrollment_${option}_${new Date().toLocaleDateString()}.csv`;
            exportToCsv(filename, dataToExport);
            toast.info(`Exported ${dataToExport.length} ${option} records.`);
        } else {
            toast.warn(`No ${option} records to export.`);
        }

        setShowDropdown(false);
    };

    // Mutations (Accept, Reject, Delete)
    const acceptMutation = useMutation({
        mutationFn: async (id) => {
            await axios.put(`${API_URL}/enrollments/${id}/status`, { status: 'Accepted' }, getConfig());
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['enrollments']);
            toast.success('Enrollment ACCEPTED. Confirmation email sent!');
        },
        onError: (err) => toast.error(`Acceptance failed: ${err.response?.data?.message}`),
    });

    const rejectMutation = useMutation({
        mutationFn: async (id) => {
            await axios.put(`${API_URL}/enrollments/${id}/status`, { status: 'Rejected' }, getConfig());
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['enrollments']);
            toast.success('Enrollment REJECTED. Notification email sent.');
        },
        onError: (err) => toast.error(`Rejection failed: ${err.response?.data?.message}`),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`${API_URL}/enrollments/${id}`, getConfig());
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['enrollments']);
            toast.success('Enrollment record removed.');
        },
        onError: (err) => {
            toast.error(`Deletion failed: ${err.response?.data?.message}`);
        },
    });

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this enrollment record?')) {
            deleteMutation.mutate(id);
        }
    };

    // Loading & Error States
    if (isLoading)
        return (
            <AdminLayout>
                <div className="p-8">Loading Enrollments...</div>
            </AdminLayout>
        );

    if (isError)
        return (
            <AdminLayout>
                <div className="p-8 text-red-500">Error: {error?.message}</div>
            </AdminLayout>
        );

    // MAIN RENDER
    return (
        <AdminLayout>
            {/* 1. HEADER: Title and Export Button */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Enrollment Submissions</h2>

                {/* EXPORT BUTTON WITH DROPDOWN */}
                <div className="relative inline-block text-left z-10">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        <FaDownload className="mr-2" /> Export CSV ({enrollments?.length || 0})
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <button onClick={() => handleExportOption('all')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Export All</button>
                            <button onClick={() => handleExportOption('pending')} className="block w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50">Export Pending</button>
                            <button onClick={() => handleExportOption('processed')} className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50">Export Processed</button>
                            {selectedIds.length > 0 && <button onClick={() => handleExportOption('selected')} className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">Export Selected</button>}
                        </div>
                    )}
                </div>
            </div>

            {/* 2. STATS BAR */}
            <div className="text-sm text-gray-600 mb-4 font-semibold">
                Total {enrollments?.length || 0} Enrollment Requests Found
            </div>

            {/* 3. FILTER BAR: Search and Radio Buttons */}
            <div className="flex justify-between items-center mb-4 space-x-4">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search by student name, email, or course..."
                />

                {/* Radio Filters */}
                <div className="flex space-x-4 text-sm font-medium text-gray-700">
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="statusFilter" value="all" checked={filterStatus === 'all'} onChange={() => setFilterStatus('all')} className="mr-1 text-blue-600" /> All
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="statusFilter" value="pending" checked={filterStatus === 'pending'} onChange={() => setFilterStatus('pending')} className="mr-1 text-yellow-600" /> Pending
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="statusFilter" value="processed" checked={filterStatus === 'processed'} onChange={() => setFilterStatus('processed')} className="mr-1 text-green-600" /> Processed
                    </label>
                </div>
            </div>

            {/* ENROLLMENT TABLE */}
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Table Headers (TH) are correct */}
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <input type="checkbox" checked={selectedIds.length === filteredEnrollments.length && filteredEnrollments.length > 0} onChange={toggleSelectAll} />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEnrollments.map((enrollment) => (
                            <tr key={enrollment._id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <input type="checkbox" checked={selectedIds.includes(enrollment._id)} onChange={() => toggleSelect(enrollment._id)} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(enrollment.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{enrollment.studentName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.studentEmail}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.courseOfInterest}</td>

                                {/* ✅ STATUS BUTTONS */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {enrollment.isProcessed ? (
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">Decision Made</span>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <button onClick={() => acceptMutation.mutate(enrollment._id)} disabled={acceptMutation.isLoading || rejectMutation.isLoading} className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors" title="Explicitly Accept Enrollment (sends email)">
                                                <FaCheck className="mr-1 inline" /> Accept
                                            </button>
                                            <button onClick={() => rejectMutation.mutate(enrollment._id)} disabled={acceptMutation.isLoading || rejectMutation.isLoading} className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 hover:bg-red-200 transition-colors" title="Explicitly Reject Enrollment (sends email)">
                                                <FaTimes className="mr-1 inline" /> Reject
                                            </button>
                                        </div>
                                    )}
                                </td>

                                {/* DELETE BUTTON */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleDelete(enrollment._id)} className="text-red-600 hover:text-red-900" disabled={deleteMutation.isLoading}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredEnrollments.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        {searchTerm || filterStatus !== 'pending'
                            ? 'No results found for your search/filter criteria.'
                            : 'No enrollments found yet.'}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default EnrollmentsPage;