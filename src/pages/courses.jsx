// frontend/src/pages/courses.jsx

import PublicLayout from '@/layouts/PublicLayout';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head'; // Necessary for SEO metadata on specific pages

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CoursesPage = ({ courses }) => {
    return (
        <PublicLayout 
            title="Course Catalog - Full-Stack MERN & Next.js Training"
            description="Explore our complete list of technical training courses including MERN Stack, Next.js, and MongoDB mastery programs."
        >
            <Head>
                {/* SEO: Add specific schema for Course List page */}
                <script 
                    type="application/ld+json" 
                    dangerouslySetInnerHTML={{ __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Course Catalog",
                        "description": "Comprehensive list of our online tech courses.",
                        // More dynamic data can be added here
                    }) }}
                />
            </Head>
            
            <div className="py-12 max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
                    Our Complete Course Catalog ({courses.length} Programs)
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
                                    src={course.image || '/images/default-course.jpg'} // Use stored image URL
                                    alt={`Featured image for ${course.title}`} 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-2xl font-bold text-green-600">${course.price.toFixed(2)}</span>
                                        <Link 
                                            href={`/courses/${course.slug}`} // Link to the dynamic course detail page
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
        // Fetch ALL courses (for now, our backend sends all, but in prod, we filter by isPublished: true)
        const { data } = await axios.get(`${API_URL}/courses`);
        
        // Filter to ensure only published courses are shown to the public
        const publishedCourses = data.filter(course => course.isPublished);

        return {
            props: {
                courses: publishedCourses, // Pass data to the component as props
            },
        };
    } catch (error) {
        console.error('Error fetching courses for public site:', error.message);
        return {
            props: {
                courses: [], // Return empty array on failure
            },
        };
    }
}

export default CoursesPage;