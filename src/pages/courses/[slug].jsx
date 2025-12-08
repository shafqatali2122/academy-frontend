// frontend/src/pages/courses/[slug].jsx (FINAL ATTEMPT: FIXED REACT.CHILDREN.ONLY ERROR)

import PublicLayout from '@/layouts/PublicLayout';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link'; 
import { FaBookOpen, FaDollarSign, FaClock } from 'react-icons/fa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CourseDetailPage = ({ course }) => {
    const router = useRouter();

    // If data fetching failed, redirect to the 404 page (or a custom error page)
    if (router.isFallback) {
        return <PublicLayout><div>Loading course details...</div></PublicLayout>;
    }
    if (!course) {
        return (
            <PublicLayout title="Course Not Found">
                <div className="py-20 text-center">
                    <h1 className="text-4xl text-red-600">404 - Course Not Found</h1>
                    <p className="text-gray-600 mt-4">The course you are looking for may have been removed or the URL is incorrect.</p>
                </div>
            </PublicLayout>
        );
    }
    
    // SEO: Course Schema Markup
    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
            "@type": "Organization",
            "name": "Al-Khalil Institute", 
            "sameAs": "https://www.alkhalilinstitute.org" 
        },
        "offers": {
            "@type": "Offer",
            "price": course.price,
            "priceCurrency": "PKR",
            "availability": "https://schema.org/InStock",
        }
    };

    return (
        <PublicLayout title={`${course.title} | Al-Khalil Institute`} description={course.description}>
            <Head>
                {/* Inject Course Schema JSON-LD */}
                <script 
                    type="application/ld+json" 
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
                />
            </Head>
            
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Course Header Section */}
                <header className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                    <h1 className="text-4xl font-extrabold text-gray-900">{course.title}</h1>
                    <p className="mt-2 text-xl text-gray-700">{course.description}</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Main Content Area (2/3 width) */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Full Curriculum</h2>
                        <div 
                            className="prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: course.fullContent }} 
                        />
                    </div>

                    {/* Sidebar / CTA (1/3 width) */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-xl sticky top-20">
                            
                            {/* Course Image */}
                            <img src={course.image || '/images/default-course.jpg'} alt={course.title} className="w-full rounded-md mb-4" />
                            
                            {/* Price */}
                            <h3 className="text-3xl font-bold text-green-600 mb-4 flex items-center">
                                <FaDollarSign className="mr-2 text-2xl" /> PKR {course.price?.toLocaleString() || 'Contact'}
                            </h3>
                            
                            {/* Features List */}
                            <ul className="space-y-2 mb-6 border-t pt-4 text-gray-700">
                                <li className="flex items-center text-sm">
                                    <FaBookOpen className="mr-2 text-blue-600" />
                                    <span>{course.modules || 10} Modules Included</span>
                                </li>
                                <li className="flex items-center text-sm">
                                    <FaClock className="mr-2 text-blue-600" />
                                    <span>Duration: {course.duration || 'Flexible'}</span>
                                </li>
                            </ul>
                            
                            {/* FIX: Enroll Button - Using modern Link structure to prevent React.Children.only error */}
                            <Link 
                                href={`/enroll?course_slug=${course.slug}`}
                                // Note: Removed passHref and legacyBehavior
                                className="w-full block text-center py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md"
                            >
                                Enroll Now!
                            </Link>

                            <p className="mt-4 text-sm text-center text-gray-500">
                                Start learning immediately after registration.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </PublicLayout>
    );
};

// Fetch data on the server side using the URL slug (UNCHANGED)
export async function getServerSideProps(context) {
    const { slug } = context.params; 

    try {
        const { data } = await axios.get(`${API_URL}/courses/slug/${slug}`);

        return {
            props: {
                course: data,
            },
        };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return {
                notFound: true,
            };
        }
        console.error(`Error fetching course ${slug}:`, error.message);
        return {
            props: {
                course: null,
            },
        };
    }
}

export default CourseDetailPage;