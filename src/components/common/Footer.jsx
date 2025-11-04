// frontend/src/components/common/Footer.jsx

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white mt-12 border-t-4 border-blue-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    
                    {/* 1. Branding & Mission */}
                    <div>
                        <h3 className="text-xl font-bold text-blue-400 mb-4">Academy</h3>
                        <p className="text-sm text-gray-400">
                            Our mission is to provide cutting-edge full-stack development skills to the next generation of developers.
                        </p>
                    </div>

                    {/* 2. Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/courses" className="text-gray-400 hover:text-white transition-colors">Course Catalog</Link></li>
                            <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Tech Blog</Link></li>
                            <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">Our Vision</Link></li>
                            <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    
                    {/* 3. Get Started */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Enrollment</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Enroll Today</Link></li>
                            <li><Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors">Admin Login</Link></li>
                            <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* 4. Contact & Social */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="mailto:info@sa-academy.com" className="text-gray-400 hover:text-blue-400 transition-colors"><FaEnvelope className="text-xl" /></a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><FaTwitter className="text-xl" /></a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><FaLinkedin className="text-xl" /></a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><FaFacebook className="text-xl" /></a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
                    &copy; {currentYear} Shafqat Ali Academy. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;