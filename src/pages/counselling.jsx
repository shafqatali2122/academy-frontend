import PublicLayout from '@/layouts/PublicLayout';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CounsellingPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [category, setCategory] = useState('');
    const [subject, setSubject] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false); // <-- NEW LINE

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_URL}/enrollments`, {
                studentName: name,
                studentEmail: email,
                phone,
                courseOfInterest: `Counselling Request: ${subject}`,
                category,
            });
            toast.success('Your counselling request has been submitted successfully!');
            setName('');
            setEmail('');
            setPhone('');
            setCategory('');
            setSubject('');
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit your request. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout title="Free Career Counselling - Shafqat Ali Academy">
            <div className="py-12 max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b pb-3 text-center">
                    Beyond Grades: Find Your Academic and Personal Path
                </h1>

                <section className="text-lg space-y-6 text-gray-700 max-w-3xl mx-auto mb-10">
                    <p>
                        The Shafqat Ali Academy philosophy extends beyond the classroom. We understand that educational choices, career transitions, and personal development require expert, compassionate guidance—the same depth of guidance found in classical scholarship applied to modern life.
                    </p>

                    <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50 italic">
                        This is your space for personalized, confidential discussion, whether you're a parent guiding a student, a teacher seeking professional development, or an adult navigating a career pivot.
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 pt-4">Our Counseling Focus Areas:</h2>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>O-Level and Cambridge Curriculum Strategy (Exam Confidence)</li>
                        <li>Academic Planning (Mapping the right path to university)</li>
                        <li>Teacher Training and Pedagogical Mentorship</li>
                        <li>Personal Development and Emotional Handling for Adults</li>
                    </ul>
                    <p className="font-semibold text-xl text-center pt-8 text-indigo-700">
                        Take the first step toward clarity. Submit your request below.
                    </p>
                </section>

                {/* The CTA button */}
                {!showForm && (
                    <div className="text-center py-10">
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl transition-colors text-2xl"
                        >
                            Start Your Counselling Session
                        </button>
                    </div>
                )}

                {/* Conditional Form Rendering */}
                {showForm && (
                    <form
                        onSubmit={submitHandler}
                        className="max-w-xl mx-auto space-y-6 p-8 bg-white shadow-2xl rounded-xl border border-indigo-100"
                    >
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number * (e.g., WhatsApp contact)
                            </label>
                            <input
                                type="text"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                I am a *
                            </label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                <option value="">-- Select --</option>
                                <option value="Student">Student</option>
                                <option value="Parent">Parent</option>
                                <option value="Teacher">Teacher / Colleague</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Subject */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                Counselling Topic * (e.g., O-Level Islamiyat Strategy, Career Shift, Personal Development)
                            </label>
                            <input
                                type="text"
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* WhatsApp Checkbox */}
                        <div className="flex items-start">
                            <input
                                id="whatsapp"
                                name="whatsapp"
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-green-600 border-gray-300 rounded mt-1"
                            />
                            <label htmlFor="whatsapp" className="ml-2 block text-sm font-medium text-gray-700">
                                I agree to be contacted on the provided phone number via WhatsApp for scheduling the session.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${
                                loading
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                        >
                            {loading ? 'Submitting Request...' : 'Submit Request'}
                        </button>
                    </form>
                )}
            </div>
        </PublicLayout>
    );
};

export default CounsellingPage;
