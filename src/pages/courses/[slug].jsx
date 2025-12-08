// frontend/src/pages/courses/[slug].jsx

import PublicLayout from '@/layouts/PublicLayout';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaBookOpen, FaDollarSign, FaClock } from 'react-icons/fa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CourseDetailPage = ({ course }) => {
    const router = useRouter();

    if (router.isFallback) {
        return (
            <PublicLayout>
                <div>Loading course details...</div>
            </PublicLayout>
        );
    }

    if (!course) {
        return (
            <PublicLayout title="Course Not Found">
                <div className="py-20 text-center">
                    <h1 className="text-4xl text-red-600">404 - Course Not Found</h1>
                    <p className="text-gray-600 mt-4">
                        The course you are looking for may have been removed or the URL is incorrect.
                    </p>
                </div>
            </PublicLayout>
        );
    }

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
            "availability": "https://schema.org/InStock"
        }
    };

    return (
        <PublicLayout
            title={`${course.title} | Al-Khalil Institute`}
            description={course.description}
        >
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
                />
            </Head>

            {/* FIXED ONLY LAYOUT / ALIGNMENT */}
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">

                {/* Header */}
                <header className="mb-8 p-5 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        {course.title}
                    </h1>
                    <p className="mt-2 text-xl text-gray-700">
                        {course.description}
                    </p>
                </header>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left - Content */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
                            Full Curriculum
                        </h2>

                        <div
                            className="prose max-w-full text-gray-700"
                            dangerouslySetInnerHTML={{ __html: course.fullContent }}
                        />
                    </div>

                    {/* Right - Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white p-5 rounded-lg shadow-md sticky top-20">

                            {/* Image */}
                            <img
                                src={course.image || '/images/default-course.jpg'}
                                alt={course.title}
                                className="w-full rounded-md mb-4"
                            />

                            {/* Price */}
                            <h3 className="text-3xl font-bold text-green-600 mb-4 flex items-center">
                                <FaDollarSign className="mr-2 text-2xl" />
                                PKR {course.price?.toLocaleString() || 'Contact'}
                            </h3>

                            {/* Features */}
                            <ul className="space-y-2 mb-5 border-t pt-4 text-gray-700 text-sm">
                                <li className="flex items-center">
                                    <FaBookOpen className="mr-2 text-blue-600" />
                                    <span>{course.modules || 10} Modules Included</span>
                                </li>
                                <li className="flex items-center">
                                    <FaClock className="mr-2 text-blue-600" />
                                    <span>Duration: {course.duration || 'Flexible'}</span>
                                </li>
                            </ul>

                            {/* Enroll */}
                            <Link
                                href={`/enroll?course_slug=${course.slug}`}
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

export async function getServerSideProps(context) {
    const { slug } = context.params;

    try {
        const { data } = await axios.get(`${API_URL}/courses/slug/${slug}`);

        return {
            props: {
                course: data
            }
        };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { notFound: true };
        }
        console.error(`Error fetching course ${slug}:`, error.message);
        return {
            props: { course: null }
        };
    }
}

export default CourseDetailPage;
