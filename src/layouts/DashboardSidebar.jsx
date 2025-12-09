// frontend/src/components/admin/Sidebar.jsx

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/context/AuthContext';
import {
  FaUsers,
  FaCog,
  FaFileAlt,
  FaVideo,
  FaChartBar,
  FaUserGraduate,
} from 'react-icons/fa';

const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  // If no user loaded, hide sidebar
  if (!user) return null;

  // --- ROLE MAPPING (NEW, but minimal and safe) ---
  const role = user.role;

  const isSuperAdmin = ['SuperAdmin', 'admin'].includes(role);
  const isAdmissionsAdmin = ['AdmissionsAdmin'].includes(role);
  const isContentAdmin = ['ContentAdmin', 'content_manager'].includes(role);
  const isAudienceAdmin = ['AudienceAdmin', 'marketing_manager'].includes(role);
  const isStudent = ['User', 'student'].includes(role);
  // -------------------------------------------------

  // Logout handler
  const handleLogout = () => {
    logout();
    router.push('/login'); // or '/admin/login' if that is your flow
  };

  // Helper to style active links
  const linkClass = (path) =>
    `flex items-center p-2 rounded transition-colors ${
      router.pathname === path
        ? 'bg-gray-700 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-5 flex flex-col">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      <nav className="flex-grow space-y-4">
        {/* --- Director / System (ONLY SUPER ADMIN) --- */}
        {isSuperAdmin && (
          <div>
            <h3 className="text-xs uppercase text-gray-400 mb-2">Director</h3>
            <Link href="/admin/users" className={linkClass('/admin/users')}>
              <FaUsers className="mr-3" /> Manage Users
            </Link>
            <Link href="/admin/settings" className={linkClass('/admin/settings')}>
              <FaCog className="mr-3" /> Site Settings
            </Link>
          </div>
        )}

        {/* --- Content (Ausaf) – SuperAdmin + ContentAdmin --- */}
        {(isSuperAdmin || isContentAdmin) && (
          <div>
            <h3 className="text-xs uppercase text-gray-400 mb-2">Content (Ausaf)</h3>
            <Link href="/admin/blogs" className={linkClass('/admin/blogs')}>
              <FaFileAlt className="mr-3" /> Manage Blogs
            </Link>
            <Link href="/admin/materials" className={linkClass('/admin/materials')}>
              <FaVideo className="mr-3" /> Manage Materials
            </Link>
            <Link href="/admin/courses" className={linkClass('/admin/courses')}>
              <FaFileAlt className="mr-3" /> Manage Courses
            </Link>
          </div>
        )}

        {/* --- Marketing (Sajid) – SuperAdmin + AudienceAdmin --- */}
        {(isSuperAdmin || isAudienceAdmin) && (
          <div>
            <h3 className="text-xs uppercase text-gray-400 mb-2">Marketing (Sajid)</h3>
            <Link href="/admin/analytics" className={linkClass('/admin/analytics')}>
              <FaChartBar className="mr-3" /> View Analytics
            </Link>
          </div>
        )}

        {/* --- Admissions section (if you want AdmissionsAdmin to see enrollments) --- */}
        {(isSuperAdmin || isAdmissionsAdmin || isAudienceAdmin) && (
          <div>
            <h3 className="text-xs uppercase text-gray-400 mb-2">Admissions</h3>
            <Link
              href="/admin/enrollments"
              className={linkClass('/admin/enrollments')}
            >
              <FaFileAlt className="mr-3" /> Manage Enrollments
            </Link>
          </div>
        )}

        {/* --- Student Link (User student) --- */}
        {isStudent && (
          <div>
            <h3 className="text-xs uppercase text-gray-400 mb-2">Student</h3>
            <Link
              href="/dashboard/my-courses"
              className={linkClass('/dashboard/my-courses')}
            >
              <FaUserGraduate className="mr-3" /> My Premium Resources
            </Link>
          </div>
        )}
      </nav>

      {/* --- Footer Links --- */}
      <div className="mt-auto border-t border-gray-700 pt-4">
        <Link href="/dashboard/profile" className={linkClass('/dashboard/profile')}>
          <FaCog className="mr-3" /> My Profile
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-2 rounded mt-2 text-left text-red-400 hover:bg-red-500 hover:text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
