// frontend/src/pages/contact.jsx (FULL CODE REPLACEMENT - Simple Contact)

import { useState } from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Submission handler for the simple message form
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!name || !email || !message) {
            toast.error('Name, Email, and Message fields are required.');
            setLoading(false);
            return;
        }

        try {
            // NOTE: We are using the main /enrollments endpoint as a catch-all for messages
            await axios.post(`${API_URL}/enrollments`, {
                studentName: name,
                studentEmail: email,
                courseOfInterest: 'General Contact Inquiry', // Distinguishing message type
                message: message,
            });

            toast.success('Your message has been sent successfully!');
            setName('');
            setEmail('');
            setMessage('');
            
        } catch (error) {
            toast.error('Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout title="Contact Shafqat Ali Academy">
            <div className="py-12 max-w-6xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4 text-center">
                    Get in Touch
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                    {/* 1. Static Contact Details (Trust Building) */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Direct Contact & Support</h2>
                        <div className="space-y-6 text-lg">
                            <p className="flex items-center text-gray-700">
                                <FaEnvelope className="mr-3 text-blue-600 text-2xl"/> 
                                Email: <span className="font-medium ml-2">info@shafqataliacademy.com</span>
                            </p>
                            <p className="flex items-center text-gray-700">
                                <FaWhatsapp className="mr-3 text-green-600 text-2xl"/> 
                                WhatsApp: <span className="font-medium ml-2">0312-0122162</span>
                            </p>
                            <p className="flex items-center text-gray-700">
                                <FaMapMarkerAlt className="mr-3 text-red-600 text-2xl"/> 
                                Location: <span className="font-medium ml-2">Karachi, Pakistan (Global Online Service)</span>
                            </p>
                        </div>
                        <p className="mt-8 text-md text-gray-600">
                            For course enrollment, please use the **Enroll Now** button or the dedicated **Counselling** page.
                        </p>
                    </div>

                    {/* 2. Simple Message Form */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send a Quick Message</h2>
                        <form onSubmit={submitHandler} className="space-y-4 p-6 bg-gray-50 rounded-lg shadow-md">
                            
                            <div><input type="text" placeholder="Your Full Name *" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-3 border rounded-md" /></div>
                            <div><input type="email" placeholder="Your Email Address *" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border rounded-md" /></div>
                            <div><textarea rows="4" placeholder="Your Message *" value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full p-3 border rounded-md"></textarea></div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-3 px-4 rounded-md text-lg font-medium text-white ${
                                    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                <FaPaperPlane className="mr-2 mt-1"/>
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default ContactPage;