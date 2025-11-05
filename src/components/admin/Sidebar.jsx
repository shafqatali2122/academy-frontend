// frontend/src/components/admin/Sidebar.jsx

import Link from 'next/link';
import { 
    FaGraduationCap, 
    FaPenNib, 
    FaUserCheck, 
    FaTachometerAlt,
    FaSignOutAlt,  // <-- ADD THIS LINE
    FaCommentDots, // <-- ADD THIS LINE (Needed for Counselling)
    FaFilePdf,
    FaTags,
    FaHome,
    FaUsers      // <-- ADD THIS LINE (Needed for Materials)
} from 'react-icons/fa';
import { useAuth } from '@/utils/context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth(); // Get the logout function

    const navItems = [
        { name: 'Dashboard', icon: FaTachometerAlt, href: '/admin/dashboard' },
        { name: 'Home CMS', icon: FaHome, href: '/admin/home' },
        { name: 'Courses', icon: FaGraduationCap, href: '/admin/courses' },
        { name: 'Blog Posts', icon: FaPenNib, href: '/admin/blogs' },
        { name: 'Enrollments', icon: FaUserCheck, href: '/admin/enrollments' },
        { name: 'Counselling', icon: FaCommentDots, href: '/admin/counselling' },
        { name: 'Materials', icon: FaFilePdf, href: '/admin/materials' },
        { name: 'Categories', icon: FaTags, href: '/admin/materials/categories' },
        { name: 'Manage Users', icon: FaUsers, href: '/admin/users' },

        
    ];

    return (
        <div className="flex flex-col w-64 bg-gray-800 text-white min-h-screen p-4">
            <h2 className="text-xl font-bold mb-8 border-b border-gray-700 pb-3">
                Academy CMS
            </h2>
            <nav className="flex-grow">
                {navItems.map((item) => (
                    <Link key={item.name} href={item.href} className="flex items-center p-3 my-2 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                        <item.icon className="mr-3" />
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="pt-4 border-t border-gray-700">
                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="flex items-center w-full p-3 text-red-400 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                    <FaSignOutAlt className="mr-3" />
                    Logout ({/* Displaying username is a good addition for the future */})
                </button>
            </div>
        </div>
    );
};

export default Sidebar;