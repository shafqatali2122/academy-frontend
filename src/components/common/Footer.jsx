// frontend/src/components/common/Footer.jsx

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    // The WhatsApp number for the mailto: link (from your previous update)
    const whatsappNumber = '923481631827'; 
    const whatsappLink = `https://wa.me/${whatsappNumber}`;

    return (
        <footer className="bg-gray-800 text-white mt-12 border-t-4 border-blue-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    
                    {/* 1. Branding & Mission (UPDATED) */}
                    <div>
                        <h3 className="text-xl font-bold text-blue-400 mb-4">Al-Khalil Institute</h3>
                        <p className="text-sm text-gray-400">
                            Our mission is to empower Ulama and scholars with specialized pedagogical skills to excel in teaching **Cambridge O-Levels Islamiyat (2058)**.
                        </p>
                    </div>

                    {/* 2. Quick Links (UPDATED) */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/courses" className="text-gray-400 hover:text-white transition-colors">Teacher Training</Link></li>
                            <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Resource Blog</Link></li>
                            <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    
                    {/* 3. Get Started (UPDATED) */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            {/* Changed Enroll Today to Counselling */}
                            <li><Link href="/counselling" className="text-gray-400 hover:text-white transition-colors">Free Counselling</Link></li>
                            <li><Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors">Admin Login</Link></li>
                            <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
                            {/* Added new link to Enroll Page */}
                            <li><Link href="/enroll" className="text-blue-400 hover:text-white font-semibold transition-colors">Enroll Now</Link></li>
                        </ul>
                    </div>

                    {/* 4. Contact & Social (UPDATED) */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            {/* Updated Email Link */}
                            <a href="mailto:info@alkhalilinstitute.org" className="text-gray-400 hover:text-blue-400 transition-colors" title="Email Us"><FaEnvelope className="text-xl" /></a>
                            {/* Added WhatsApp Link */}
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors" title="WhatsApp Chat"><FaFacebook className="text-xl" /></a>
                            {/* Social Media (Placeholders left to be filled by you later) */}
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" title="Twitter"><FaTwitter className="text-xl" /></a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" title="LinkedIn"><FaLinkedin className="text-xl" /></a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
                    &copy; {currentYear} **Al-Khalil Institute**. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;