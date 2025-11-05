// frontend/src/pages/admin/users.jsx

console.log("✅ Rendering Manage Users page (users.jsx)");
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/utils/context/AuthContext';
import { toast } from 'react-toastify';
import AdminOnly from '@/components/auth/AdminOnly';

// Helper
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// --- Main Page Component ---
const ManageUsersPage = () => {
  const { user } = useAuth(); // Get auth context for the token
  const queryClient = useQueryClient(); // For invalidating cache

  // --- 1. DATA FETCHING (GET /api/users) ---
  const fetchUsers = async () => {
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };
    const { data } = await axios.get(`${API_URL}/users`, config);
    return data;
  };

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: fetchUsers,
    enabled: !!user,
  });

  // --- 2. DATA UPDATING (PUT /api/users/:id/role) --- // <-- CHANGED to PUT
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      // <-- CHANGED to axios.put to match our backend route
      await axios.put(
        `${API_URL}/users/${userId}/role`,
        { role: newRole },
        config
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      toast.success('User role updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update role.');
    },
  });

  // --- 3. DATA DELETING (DELETE /api/users/:id) --- // <-- NEW SECTION
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.delete(`${API_URL}/users/${userId}`, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      toast.success('User deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    },
  });

  // --- 4. EVENT HANDLERS ---
  const handleRoleChange = (userId, newRole) => {
    if (!newRole) return;
    updateRoleMutation.mutate({ userId, newRole });
  };

  // <-- NEW handler for delete
  const handleDeleteUser = (userId, username) => {
    // Safety check
    if (window.confirm(`Are you sure you want to delete user: ${username}?`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  // --- 5. RENDER LOGIC ---
  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center p-10">Loading users...</div>;
    }
    if (error) {
      return (
        <div className="text-center p-10 text-red-500">
          Error: {error.message}
        </div>
      );
    }
    if (!users || users.length === 0) {
      return <div className="text-center p-10">No users found.</div>;
    }

    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* <-- CHANGED from 'Name' to 'Username' */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((member) => (
              <tr key={member._id}>
                {/* <-- CHANGED from member.name to member.username */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {member.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {/* Can't change your own role or other SuperAdmins */}
                  {member._id === user._id || member.role === 'SuperAdmin' ? (
                    <span className="text-gray-400">N/A</span>
                  ) : (
                    <select
                      defaultValue={member.role}
                      onChange={(e) =>
                        handleRoleChange(member._id, e.target.value)
                      }
                      disabled={updateRoleMutation.isLoading}
                      className="block w-full border-gray-300 rounded-md shadow-sm"
                    >
                      {/* <-- CHANGED roles to match backend */}
                      <option value="User">User (Student)</option>
                      <option value="ContentAdmin">ContentAdmin</option>
                      <option value="AdmissionsAdmin">AdmissionsAdmin</option>
                      <option value="AudienceAdmin">AudienceAdmin</option>
                      <option value="SuperAdmin">SuperAdmin</option>
                    </select>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {/* <-- NEW Delete Button */}
                  {/* Can't delete yourself or other SuperAdmins */}
                  {member._id === user._id || member.role === 'SuperAdmin' ? (
                    <span className="text-gray-400">N/A</span>
                  ) : (
                    <button
                      onClick={() =>
                        handleDeleteUser(member._id, member.username)
                      }
                      disabled={deleteUserMutation.isLoading}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
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

// --- 6. PAGE EXPORT WITH PROTECTION ---
const ProtectedManageUsersPage = () => {
  return (
    <AdminOnly>
      <ManageUsersPage />
    </AdminOnly>
  );
};

export default ProtectedManageUsersPage;