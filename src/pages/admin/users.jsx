import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/utils/context/AuthContext';
import { toast } from 'react-toastify';

// Layouts and Protection
import AdminOnly from '@/components/auth/AdminOnly'; // ✅ updated

// Helper
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// --- Main Page Component ---
const ManageUsersPage = () => {
    const { user } = useAuth(); // Get auth context for the token
    const queryClient = useQueryClient(); // For invalidating cache after update

    // --- 1. DATA FETCHING (GET /api/users) ---
    const fetchUsers = async () => {
        const config = {
            headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get(`${API_URL}/users`, config);
        return data;
    };

    const { data: users, isLoading, error } = useQuery({
        queryKey: ['adminUsers'], // A unique key for this query
        queryFn: fetchUsers,
        enabled: !!user, // Only run the query if the user is loaded
    });

    // --- 2. DATA UPDATING (PATCH /api/users/:id/role) ---
    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, newRole }) => {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.patch(`${API_URL}/users/${userId}/role`, { role: newRole }, config);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['adminUsers']);
            toast.success('User role updated successfully!');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update role.');
        },
    });

    // --- 3. EVENT HANDLER ---
    const handleRoleChange = (userId, newRole) => {
        if (!newRole) return;
        updateRoleMutation.mutate({ userId, newRole });
    };

    // --- 4. RENDER LOGIC ---
    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center p-10">Loading users...</div>;
        }
        if (error) {
            return <div className="text-center p-10 text-red-500">Error: {error.message}</div>;
        }
        if (!users || users.length === 0) {
            return <div className="text-center p-10">No users found.</div>;
        }

        return (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change Role</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((member) => (
                            <tr key={member._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {member.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {member._id === user._id ? (
                                        <span className="text-gray-400">N/A (You)</span>
                                    ) : (
                                        <select
                                            defaultValue={member.role}
                                            onChange={(e) => handleRoleChange(member._id, e.target.value)}
                                            disabled={updateRoleMutation.isLoading}
                                            className="block w-full border-gray-300 rounded-md shadow-sm"
                                        >
                                            <option value="student">Student</option>
                                            <option value="content_manager">Content Manager</option>
                                            <option value="marketing_manager">Marketing Manager</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Manage Team Members</h1>
            {renderContent()}
        </div>
    );
};

// --- 5. PAGE EXPORT WITH PROTECTION ---
const ProtectedManageUsersPage = () => {
    return (
        <AdminOnly> {/* ✅ updated wrapper */}
             {/* ✅ updated layout */}
                <ManageUsersPage />
          
        </AdminOnly>
    );
};

export default ProtectedManageUsersPage;
