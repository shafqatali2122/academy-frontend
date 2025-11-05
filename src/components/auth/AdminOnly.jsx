// frontend/src/components/auth/AdminOnly.jsx
console.log("✅ AdminOnly wrapper loaded");
import { useAuth } from '@/utils/context/AuthContext';
import { useRouter } from 'next/router';
import AdminLayout from '@/layouts/AdminLayout';

const AdminOnly = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // --- THIS IS THE UPDATED LOGIC ---
  // We define all roles that are allowed to access the admin panel.
  const allowedRoles = [
    'SuperAdmin',
    'AdmissionsAdmin',
    'ContentAdmin',
    'AudienceAdmin',
    'admin', // <-- We must TEMPORARILY keep your OLD 'admin' role
             // so you don't get locked out before you can change your role
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading authentication...</div>
      </div>
    );
  }

  // If user not found OR their role is NOT in the allowed list, redirect.
  if (!loading && (!user || !allowedRoles.includes(user.role))) {
    console.warn(
      `🚫 Access denied: Role '${user?.role}' is not an admin. Redirecting...`
    );
    if (typeof window !== "undefined") {
      router.replace("/admin/login"); // ✅ Safer redirect
    }
    return null;
  }

  // If admin, render the content
  console.log(`✅ Role '${user.role}' verified, rendering AdminLayout.`);
  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminOnly;