// frontend/src/components/common/Header.jsx (ALIGNMENT & SPACING FIX)

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '@/utils/context/AuthContext';

const Header = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    // --- NEW, SAFER SMART NAVIGATION LOGIC (Kept Unchanged) ---
    let dashboardPath = null;

    if (user) {
        const adminRoles = [
            'SuperAdmin',
            'AdmissionsAdmin',
            'ContentAdmin',
            'AudienceAdmin',
        ];
        const isUserAdmin = adminRoles.includes(user.role);
        dashboardPath = isUserAdmin ? "/admin/dashboard" : "/my-dashboard";
    }
    // --- END NEW, SAFER SMART NAVIGATION LOGIC ---

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses' },
        { name: 'Blog', path: '/blog' },
        { name: 'Free Material', path: '/free-material' },
        { name: 'Counselling', path: '/counselling' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const handleMobileLogout = () => {
        logout();
        setIsOpen(false);
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                {/* Logo / Brand Name */}
                <Link
                    href="/"
                    className="flex items-center group shrink-0" // shrink-0 ensures logo doesn't compress
                >
                    <span className="text-2xl font-extrabold text-blue-800 tracking-tight hover:text-blue-900 transition-colors">
                        AL-KHALIL <span className="text-green-600">INSTITUTE</span>
                    </span>
                </Link>

                {/* --- Desktop Nav Container --- */}
                {/* Use flex-grow and justify-end to push elements to the right */}
                <div className="hidden md:flex flex-grow items-center justify-end space-x-4">
                    
                    {/* Main Nav Links - Reduced spacing to space-x-4 */}
                    <nav className="flex space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`text-gray-600 hover:text-blue-700 transition-colors text-sm ${ // Added text-sm to save space
                                    router.pathname === item.path
                                        ? 'font-bold text-blue-700 border-b-2 border-blue-700'
                                        : 'font-medium'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* --- AUTH SECTION (DESKTOP) --- */}
                    {user ? (
                        // User is LOGGED IN: Show Dashboard and Logout
                        <div className="flex items-center space-x-3 border-l pl-4 border-gray-300 ml-4">
                            <Link href={dashboardPath} className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                                <FaUserCircle className="mr-2 text-lg" />
                                Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm font-medium text-red-600 hover:text-red-800"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        // User is LOGGED OUT: Show Login and Sign Up
                        <div className="flex items-center space-x-3 border-l pl-4 border-gray-300 ml-4">
                            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                Login
                            </Link>
                            <Link href="/register" className="text-sm font-medium text-blue-700 hover:text-blue-900">
                                Sign Up
                            </Link>
                        </div>
                    )}
                    {/* --- END AUTH SECTION --- */}


                    {/* Enroll Button (Desktop) */}
                    <Link
                        href="/enroll"
                        className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg ml-4"
                    >
                        Enroll Now
                    </Link>
                </div>


                {/* Mobile Toggle Button (UNCHANGED) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-2xl text-blue-700 focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* --- Mobile Dropdown Menu --- */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
                    <nav className="flex flex-col items-start p-4 space-y-3">
                        {/* Main Nav Links (UNCHANGED) */}
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`block w-full text-gray-700 hover:text-blue-700 ${
                                    router.pathname === item.path
                                        ? 'font-semibold text-blue-700'
                                        : 'font-medium'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* --- AUTH SECTION (MOBILE) --- */}
                        <div className="border-t border-gray-200 pt-4 mt-4 w-full space-y-3">
                            {user ? (
                                <>
                                    {/* Dashboard Link uses the safe calculated path (Mobile) */}
                                    <Link href={dashboardPath} onClick={() => setIsOpen(false)} className="block w-full font-medium text-gray-700 hover:text-blue-700">
                                        My Dashboard
                                    </Link>
                                    <button
                                        onClick={handleMobileLogout}
                                        className="block w-full text-left font-medium text-red-600 hover:text-red-800"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full font-medium text-gray-700 hover:text-blue-700">
                                        Login
                                    </Link>
                                    <Link href="/register" onClick={() => setIsOpen(false)} className="block w-full font-medium text-gray-700 hover:text-blue-700">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        <Link
                            href="/enroll"
                            onClick={() => setIsOpen(false)}
                            className="w-full mt-2 px-4 py-2 text-center text-white bg-green-600 hover:bg-green-700 rounded-md shadow"
                        >
                            Enroll Now
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;