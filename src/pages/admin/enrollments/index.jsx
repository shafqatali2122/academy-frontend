import AdminLayout from '@/layouts/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaDownload, FaCheck, FaTimes, FaFilter } from 'react-icons/fa';
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
    // FIX: Default filter status set to 'pending'
    const [filterStatus, setFilterStatus] = useState('pending'); 
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const getConfig = () => ({
        headers: { Authorization: `Bearer ${token}` },
    });

    // --- Data Fetching ---
    const { data: enrollments, isLoading, isError, error } = useQuery({
        queryKey: ['enrollments'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/enrollments`, getConfig());
            return data;
        },
        enabled: !!token,
    });

    // --- Filtering Logic ---
    const filteredEnrollments =
        enrollments?.filter((enrollment) => {
            const matchesSearch =
                enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enrollment.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enrollment.courseOfInterest.toLowerCase().includes(searchTerm.toLowerCase());

            if (filterStatus === 'pending') return matchesSearch && !enrollment.isProcessed;
            if (filterStatus === 'processed') return matchesSearch && enrollment.isProcessed;
            return matchesSearch; // 'all' status
        }) || [];

    // --- Selection Logic ---
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

    // --- Export Logic ---
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

    // --- Mutations (Accept, Reject, Delete) ---
    // (Mutations logic remains the same for brevity and correctness)
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
            setSelectedIds((prev) => prev.filter((item) => item !== id)); // Remove from selected list
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

    // --- Loading & Error States ---
    if (isLoading)
        return (
            <AdminLayout>
                <div className="p-8 text-center text-xl text-blue-600">Loading Enrollment Data...</div>
            </AdminLayout>
        );

    if (isError)
        return (
            <AdminLayout>
                <div className="p-8 text-center text-red-600">
                    Error loading enrollments: {error?.message}
                </div>
            </AdminLayout>
        );

    // --- MAIN RENDER ---
    return (
        <AdminLayout>
            <div className="p-4 sm:p-6 lg:p-8">
                
                {/* 1. HEADER: Title and Export Button */}
                <header className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-3xl font-extrabold text-gray-900">🎓 Enrollment Submissions</h2>

                    {/* EXPORT BUTTON WITH DROPDOWN */}
                    <div className="relative inline-block text-left z-20">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
                        >
                            <FaDownload className="mr-2" /> Export CSV ({enrollments?.length || 0})
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5">
                                <button onClick={() => handleExportOption('all')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Export All</button>
                                <button onClick={() => handleExportOption('pending')} className="block w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50">Export Pending</button>
                                <button onClick={() => handleExportOption('processed')} className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50">Export Processed</button>
                                {selectedIds.length > 0 && <button onClick={() => handleExportOption('selected')} className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 border-t mt-1">Export Selected ({selectedIds.length})</button>}
                            </div>
                        )}
                    </div>
                </header>

                <hr className="my-6" />

                {/* 2. FILTER BAR: Search and Radio Buttons */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-6">
                    {/* Search Bar - Takes more space */}
                    <div className="w-full md:w-1/2">
                        <SearchBar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            placeholder="Search by student name, email, or course..."
                        />
                    </div>

                    {/* Radio Filters - Grouped and Aligned */}
                    <div className="flex items-center space-x-4 text-sm font-medium bg-gray-50 p-2 rounded-lg border">
                        <FaFilter className="text-gray-500" />
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="statusFilter" value="all" checked={filterStatus === 'all'} onChange={() => setFilterStatus('all')} className="mr-1 text-blue-600 focus:ring-blue-500" /> All
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="statusFilter" value="pending" checked={filterStatus === 'pending'} onChange={() => setFilterStatus('pending')} className="mr-1 text-yellow-600 focus:ring-yellow-500" /> Pending
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="statusFilter" value="processed" checked={filterStatus === 'processed'} onChange={() => setFilterStatus('processed')} className="mr-1 text-green-600 focus:ring-green-500" /> Processed
                        </label>
                    </div>
                </div>

                {/* 3. STATS BAR (Moved below filter for better visual flow) */}
                <div className="text-md text-gray-700 mb-4 font-semibold">
                    Showing {filteredEnrollments.length} of {enrollments?.length || 0} Total Enrollment Requests
                </div>
                
                {/* 4. ENROLLMENT TABLE CONTAINER */}
                <div className="bg-white shadow-xl rounded-xl overflow-x-auto border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                {/* Checkbox */}
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                    <input type="checkbox" checked={selectedIds.length === filteredEnrollments.length && filteredEnrollments.length > 0} onChange={toggleSelectAll} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                </th>
                                {/* Standard Headers */}
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                {/* Fixed Width Columns */}
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-64">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Delete</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredEnrollments.map((enrollment) => (
                                <tr key={enrollment._id} className="hover:bg-indigo-50/20 transition-colors">
                                    {/* Checkbox Cell */}
                                    <td className="p-4 whitespace-nowrap text-sm text-center">
                                        <input type="checkbox" checked={selectedIds.includes(enrollment._id)} onChange={() => toggleSelect(enrollment._id)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                    </td>
                                    {/* Data Cells */}
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(enrollment.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{enrollment.studentName}</td>
                                    <td className="px-4 py-4 text-sm text-indigo-600 truncate max-w-xs">{enrollment.studentEmail}</td>
                                    <td className="px-4 py-4 text-sm text-gray-700">{enrollment.courseOfInterest}</td>

                                    {/* STATUS / ACTION BUTTONS (Wide Column) */}
                                    <td className="px-4 py-4 text-center whitespace-nowrap text-sm w-64">
                                        {enrollment.isProcessed ? (
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${enrollment.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {enrollment.status || 'Processed'}
                                            </span>
                                        ) : (
                                            <div className="flex space-x-2 justify-center">
                                                <button onClick={() => acceptMutation.mutate(enrollment._id)} disabled={acceptMutation.isLoading || rejectMutation.isLoading} className="flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors shadow-sm" title="Accept Enrollment">
                                                    <FaCheck className="mr-1" /> Accept
                                                </button>
                                                <button onClick={() => rejectMutation.mutate(enrollment._id)} disabled={acceptMutation.isLoading || rejectMutation.isLoading} className="flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 hover:bg-red-200 transition-colors shadow-sm" title="Reject Enrollment">
                                                    <FaTimes className="mr-1" /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    {/* DELETE BUTTON (Narrow Column) */}
                                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium w-20">
                                        <button onClick={() => handleDelete(enrollment._id)} className="text-red-500 hover:text-red-700 transition-colors" disabled={deleteMutation.isLoading}>
                                            <FaTrash className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {filteredEnrollments.length === 0 && (
                        <div className="p-12 text-center text-gray-500 bg-gray-50">
                            {searchTerm || filterStatus !== 'pending'
                                ? '😔 No results found for your search/filter criteria.'
                                : '✨ No pending enrollment requests found yet. Check the "Processed" tab.'}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default EnrollmentsPage;