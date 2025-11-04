// frontend/src/pages/courses/[slug].jsx

import PublicLayout from '@/layouts/PublicLayout';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';

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
    
    // SEO: Course Schema Markup (Highly important for rich results in Google)
    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
            "@type": "Organization",
            "name": "Shafqat Ali Academy",
            "sameAs": "http://localhost:3000" 
        },
        "offers": {
            "@type": "Offer",
            "price": course.price,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
        }
    };

    return (
        // Use the course title and description for specific SEO on this page
        <PublicLayout title={`${course.title} | Academy`} description={course.description}>
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
                    {/* H1 Tag for maximum SEO value */}
                    <h1 className="text-4xl font-extrabold text-gray-900">{course.title}</h1>
                    <p className="mt-2 text-xl text-gray-700">{course.description}</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Main Content Area (2/3 width) */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Full Curriculum</h2>
                        <div 
                            className="prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: course.fullContent }} // Render rich HTML content
                        />
                    </div>

                    {/* Sidebar / CTA (1/3 width) */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-xl sticky top-20">
                            <img src={course.image || '/images/default-course.jpg'} alt={course.title} className="w-full rounded-md mb-4" />
                            <h3 className="text-3xl font-bold text-green-600 mb-4">${course.price.toFixed(2)}</h3>
                            
                            <a href="/contact" className="w-full block text-center py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                                Enroll Now!
                            </a>
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

// Fetch data on the server side using the URL slug
export async function getServerSideProps(context) {
    const { slug } = context.params; // Get the slug from the URL: /courses/[slug]

    try {
        // Fetch the course using the specific backend route: /api/courses/slug/:slug
        const { data } = await axios.get(`${API_URL}/courses/slug/${slug}`);

        return {
            props: {
                course: data, // Pass the fetched course data
            },
        };
    } catch (error) {
        // If course not found (404), return a redirect or null data
        if (error.response && error.response.status === 404) {
            return {
                notFound: true, // This tells Next.js to render the 404 page
            };
        }
        console.error(`Error fetching course ${slug}:`, error.message);
        return {
            props: {
                course: null, // Return null on error
            },
        };
    }
}

export default CourseDetailPage;