// frontend/src/pages/courses.jsx

import PublicLayout from '@/layouts/PublicLayout';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CoursesPage = ({ courses }) => {
    return (
        <PublicLayout 
            // --- FIXED: Updated Brand Name ---
            title="Course Catalog | Al-Khalil Institute"
            // --- FIXED: Updated Description to be general (not coding specific) ---
            description="Explore our professional development courses, teacher training, and educational programs at Al-Khalil Institute."
        >
            <Head>
                {/* SEO: Add specific schema for Course List page */}
                <script 
                    type="application/ld+json" 
                    dangerouslySetInnerHTML={{ __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Course Catalog",
                        "description": "List of professional training courses at Al-Khalil Institute.", // --- FIXED ---
                        "provider": {
                            "@type": "Organization",
                            "name": "Al-Khalil Institute", // --- FIXED ---
                            "url": "https://www.alkhalilinstitute.org"
                        }
                    }) }}
                />
            </Head>
            
            <div className="py-12 max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
                    Our Programs ({courses.length} Available)
                </h1>

                {courses.length === 0 ? (
                    <div className="text-center p-10 bg-gray-100 rounded-lg">
                        <p className="text-xl text-gray-600">No courses are published right now. Please check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            // Course Card Component
                            <div key={course._id} className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                                <img 
                                    src={course.image || '/images/default-course.jpg'} 
                                    alt={`Featured image for ${course.title}`} 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        {/* You already had PKR here, which is great! */}
                                        <span className="text-2xl font-bold text-green-600">PKR {course.price.toLocaleString()}</span>
                                        <Link 
                                            href={`/courses/${course.slug}`} 
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
};

// Next.js function to fetch data on the server side
export async function getServerSideProps() {
    try {
        const { data } = await axios.get(`${API_URL}/courses`);
        
        // Filter to ensure only published courses are shown to the public
        const publishedCourses = data.filter(course => course.isPublished);

        return {
            props: {
                courses: publishedCourses, 
            },
        };
    } catch (error) {
        console.error('Error fetching courses for public site:', error.message);
        return {
            props: {
                courses: [], 
            },
        };
    }
}

export default CoursesPage;