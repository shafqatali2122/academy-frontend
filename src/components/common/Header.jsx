// frontend/src/components/common/Header.jsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '@/utils/context/AuthContext';

const Header = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses' },
        { name: 'Blog', path: '/blog' },
        { name: 'Free Material', path: '/free-material' },
        { name: 'Counselling', path: '/counselling' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    // --- Helper for mobile logout ---
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
                    className="flex items-center group"
                >
                    {/* If you have a logo image later, uncomment this line: 
                    <img src="/logo.png" alt="Al-Khalil Logo" className="h-10 w-auto mr-2" /> 
                    */}
                    
                    {/* Text Logo Styling */}
                    <span className="text-2xl font-extrabold text-blue-800 tracking-tight hover:text-blue-900 transition-colors">
                        AL-KHALIL <span className="text-green-600">INSTITUTE</span>
                    </span>
                </Link>

                {/* --- Desktop Nav --- */}
                <div className="hidden md:flex items-center space-x-6">
                    {/* Main Nav Links */}
                    <nav className="flex space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`text-gray-600 hover:text-blue-700 transition-colors ${
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
                        // User is LOGGED IN
                        <div className="flex items-center space-x-4 border-l pl-4 border-gray-300">
                            <Link href={user.isAdmin ? "/admin/dashboard" : "/my-dashboard"} className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
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
                        // User is LOGGED OUT
                        <div className="flex items-center space-x-4 border-l pl-4 border-gray-300">
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
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg"
                    >
                        Enroll Now
                    </Link>
                </div>


                {/* Mobile Toggle Button */}
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
                                    <Link href={user.isAdmin ? "/admin/dashboard" : "/my-dashboard"} onClick={() => setIsOpen(false)} className="block w-full font-medium text-gray-700 hover:text-blue-700">
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