// frontend/src/components/common/Header.jsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Blog', path: '/blog' },
    { name: 'Free Material', path: '/free-material' },
    { name: 'Counselling', path: '/counselling' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo / Brand Name */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-700 hover:text-blue-900 transition-colors"
        >
          Shafqat Ali Academy
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
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

        {/* Enroll Button (Desktop) */}
        <Link
          href="/enroll"
          className="hidden md:inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg"
        >
          Enroll Now
        </Link>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl text-blue-700 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
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
