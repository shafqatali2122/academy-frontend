// frontend/src/components/common/Header.jsx

import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
    const router = useRouter();

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses' },
        { name: 'Blog', path: '/blog' },
        { name: 'Free Material', path: '/free-material' }, // <-- NEW
        { name: 'Counselling', path: '/counselling' },     // <-- NEW
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                
                {/* Logo / Brand Name (SEO H1 on homepage) */}
                <Link href="/" className="text-2xl font-bold text-blue-700 hover:text-blue-900 transition-colors">
                    Shafqat Ali Academy
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex space-x-8">
                    {navItems.map((item) => (
                        <Link 
                            key={item.name} 
                            href={item.path}
                            className={`text-gray-600 hover:text-blue-700 transition-colors ${router.pathname === item.path ? 'font-bold text-blue-700 border-b-2 border-blue-700' : 'font-medium'}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* CTA Button (Enrollment Focus) */}
                <Link href="/enroll" className="hidden md:inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg">
                    Enroll Now
                </Link>
                
                {/* Mobile Menu Icon (Placeholder for future mobile menu implementation) */}
                <div className="md:hidden">
                    {/* FaBars icon here */}
                </div>
            </div>
        </header>
    );
};

export default Header;