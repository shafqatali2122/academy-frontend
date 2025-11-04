// frontend/src/pages/enroll.jsx (FULL CODE - Multi-Step Enrollment)

import { useState } from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaBookOpen, FaCheckCircle, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import Link from 'next/link';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const EnrollPage = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Consolidated state for all form data
    const [formData, setFormData] = useState({
        studentName: '',
        studentEmail: '',
        studentPhone: '',
        studentCategory: '',
        courseOfInterest: '',
        motivation: '',
        agreeConsent: false,
    });

    const steps = [
        { id: 1, title: 'Your Details', icon: FaUser },
        { id: 2, title: 'Course Selection', icon: FaBookOpen },
        { id: 3, title: 'Review & Submit', icon: FaCheckCircle },
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNext = () => {
        if (step === 1 && (!formData.studentName || !formData.studentEmail || !formData.studentPhone || !formData.studentCategory)) {
            return toast.error("Please fill all required fields in Step 1.");
        }
        if (step === 2 && !formData.courseOfInterest) {
            return toast.error("Please select a course of interest.");
        }
        setStep(prev => prev + 1);
    };

    const handlePrev = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.agreeConsent) {
            return toast.error("You must agree to the terms and privacy policy.");
        }
        setLoading(true);

        try {
            // Submission structure matches your existing /api/enrollments endpoint
            await axios.post(`${API_URL}/enrollments`, {
                studentName: formData.studentName,
                studentEmail: formData.studentEmail,
                studentPhone: formData.studentPhone,
                studentCategory: formData.studentCategory,
                courseOfInterest: formData.courseOfInterest,
                message: formData.motivation, // Using motivation field as the main message
            });

            toast.success('Enrollment request submitted successfully! Check your email for confirmation.');
            setIsSubmitted(true);
            setFormData({ // Clear state after successful submission
                studentName: '', studentEmail: '', studentPhone: '', studentCategory: '', 
                courseOfInterest: '', motivation: '', agreeConsent: false,
            });

        } catch (error) {
            toast.error('Submission failed. Please check your data and connection.');
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER SECTIONS ---

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Step 1: Personal Contact Details</h2>
                        
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                            <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} required className="mt-1 block w-full p-3 border rounded-md" />
                        </div>
                        
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                            <input type="email" name="studentEmail" value={formData.studentEmail} onChange={handleChange} required className="mt-1 block w-full p-3 border rounded-md" />
                        </div>
                        
                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number (WhatsApp) *</label>
                            <input type="text" name="studentPhone" value={formData.studentPhone} onChange={handleChange} required className="mt-1 block w-full p-3 border rounded-md" />
                        </div>
                        
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">I am a *</label>
                            <select name="studentCategory" value={formData.studentCategory} onChange={handleChange} required className="mt-1 block w-full p-3 border rounded-md bg-white">
                                <option value="">-- Select --</option>
                                <option value="Student">Student</option>
                                <option value="Parent">Parent</option>
                                <option value="Teacher">Teacher / Colleague</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Step 2: Course Selection & Goals</h2>
                        
                        {/* Course of Interest */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Course of Interest *</label>
                            {/* NOTE: In a production setting, this list would be dynamically fetched from the Course API */}
                            <select name="courseOfInterest" value={formData.courseOfInterest} onChange={handleChange} required className="mt-1 block w-full p-3 border rounded-md bg-white">
                                <option value="">-- Select a Course --</option>
                                <option value="Full-Stack MERN Mastery">Full-Stack MERN Mastery</option>
                                <option value="Next.js SEO Masterclass">Next.js SEO Masterclass</option>
                                <option value="O-Level Islamiyat (2058) Prep">O-Level Islamiyat (2058) Prep</option>
                                <option value="Academic Counseling">Academic Counseling (if unsure)</option>
                            </select>
                        </div>
                        
                        {/* Motivation/Message */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Your Goals/Motivation (Why do you want to join?)</label>
                            <textarea name="motivation" value={formData.motivation} onChange={handleChange} rows="4" className="mt-1 block w-full p-3 border rounded-md"></textarea>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Step 3: Review & Final Submit</h2>
                        
                        {/* Review Summary */}
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <p className="text-sm font-medium">Name: <span className="font-normal">{formData.studentName}</span></p>
                            <p className="text-sm font-medium">Course: <span className="font-normal">{formData.courseOfInterest}</span></p>
                            <p className="text-sm font-medium">Category: <span className="font-normal">{formData.studentCategory}</span></p>
                        </div>

                        {/* Consent Checkbox */}
                        <div className="flex items-start">
                            <input type="checkbox" name="agreeConsent" checked={formData.agreeConsent} onChange={handleChange} required className="h-5 w-5 text-blue-600 border-gray-300 rounded mt-1" />
                            <label className="ml-3 block text-sm text-gray-700">
                                I agree to the <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> and consent to be contacted by email or WhatsApp regarding my enrollment. *
                            </label>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <PublicLayout title="Enrollment Wizard - Begin Your Journey">
            <div className="py-12 max-w-2xl mx-auto px-4">
                
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                    Enrollment Wizard
                </h1>

                {isSubmitted ? (
                    <div className="text-center p-10 bg-green-50 rounded-xl shadow-lg border border-green-200">
                        <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-green-700">Success! Request Received.</h2>
                        <p className="text-gray-700 mt-3">We have received your enrollment request. A confirmation email has been sent to you. We will reach out shortly!</p>
                        <Link href="/" className="mt-6 inline-block text-blue-600 hover:underline">Return to Homepage</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-8 bg-white shadow-2xl rounded-xl border border-blue-100">
                        
                        {/* Progress Bar/Indicator */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                {steps.map(s => (
                                    <div key={s.id} className={`flex-1 text-center border-b-2 pb-2 ${s.id <= step ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'}`}>
                                        <s.icon className="mx-auto mb-1" />
                                        <span className="text-xs font-medium hidden sm:inline">{s.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Current Step Content */}
                        {renderStep()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-4 border-t">
                            {step > 1 && (
                                <button type="button" onClick={handlePrev} className="flex items-center px-4 py-2 text-sm rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">
                                    <FaChevronLeft className="mr-2" /> Back
                                </button>
                            )}
                            
                            {step < steps.length ? (
                                <button type="button" onClick={handleNext} className={`flex items-center px-4 py-2 text-sm rounded-md text-white ${step === 1 ? 'ml-auto' : ''} bg-blue-600 hover:bg-blue-700`}>
                                    Next <FaChevronRight className="ml-2" />
                                </button>
                            ) : (
                                <button type="submit" disabled={loading} className={`flex items-center px-6 py-2 text-sm rounded-md text-white font-bold transition-colors ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}>
                                    {loading ? 'Submitting...' : 'Confirm & Submit'}
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </PublicLayout>
    );
};

export default EnrollPage;