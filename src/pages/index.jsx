// frontend/src/pages/index.jsx 

import PublicLayout from '@/layouts/PublicLayout';
import Link from 'next/link';
import Head from 'next/head';

// We define the API URL here once
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const HomePage = ({ config, courses }) => {
    // --- ⬇️ THIS IS THE FIX ⬇️ ---

    // 1. Define the default values for the hero section
    const defaultHero = { 
      title: "Welcome", 
      subtitle: "Building Digital Excellence", 
      ctaText: "Start Learning", 
      ctaHref: "/courses",
      enabled: true 
    };
    
    // 2. Merge the default values with the config (if it exists)
    // This ensures hero.ctaHref is NEVER undefined.
    const hero = { ...defaultHero, ...(config?.hero) };

    // --- ⬆️ END OF FIX ⬆️ ---

    return (
        <PublicLayout title={`Home - ${hero.title}`} description={hero.subtitle}>
            
            {/* 1. ANNOUNCEMENT BAR (Dynamic Content) */}
            {config?.announcement?.enabled && (
                <div className="bg-red-600 text-white p-2 text-center text-sm font-medium">
                    <a href={config.announcement.href || '#'} className="hover:underline">
                        {config.announcement.text}
                    </a>
                </div>
            )}

            {/* 2. HERO SECTION (Dynamic Content) */}
            <section className="bg-gray-50 py-20 text-center" style={{ backgroundImage: `url(${hero.bgImageUrl})`, backgroundSize: 'cover' }}>
                <div className="max-w-4xl mx-auto px-4 bg-white/70 p-8 rounded-lg shadow-2xl">
                    <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
                        {hero.title} {/* Dynamic Title */}
                    </h1>
                    <p className="mt-4 text-xl text-gray-700">
                        {hero.subtitle} {/* Dynamic Subtitle */}
                    </p>
                    <Link href={hero.ctaHref} className="mt-8 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-xl transition-colors">
                        {hero.ctaText}
                    </Link>
                </div>
            </section>
            
            {/* 3. OWNER/BIO SECTION (Dynamic Content) */}
            {config?.ownerSection?.enabled && (
                <section className="py-16 bg-white border-b">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <img src={config.ownerSection.avatarUrl} alt="Instructor Avatar" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-600" />
                        <h2 className="text-3xl font-bold text-gray-900">{config.ownerSection.heading}</h2>
                        <p className="mt-4 text-lg text-gray-600">{config.ownerSection.bio}</p>
                    </div>
                </section>
            )}

            {/* 4. COURSE SHOWCASE (Dynamic Content) */}
            {config?.coursesShowcase?.enabled && courses.length > 0 && (
                <section className="py-16 max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{config.coursesShowcase.heading}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {courses.slice(0, config.coursesShowcase.limit || 3).map((course) => ( // Added default limit
                            <div key={course._id} className="bg-gray-50 p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-blue-700 mb-2">{course.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>
                                <Link href={`/courses/${course.slug}`} className="mt-4 inline-block text-blue-600 hover:underline">View Course &rarr;</Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            
            {/* 5. MEDIA GALLERY (Dynamic Content) */}
            {config?.mediaGallery?.enabled && config.mediaGallery.youtubeIds?.length > 0 && (
                <section className="py-16 bg-gray-100">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{config.mediaGallery.heading}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {config.mediaGallery.youtubeIds.map((id) => (
                                <div key={id} className="aspect-w-16 aspect-h-9 w-full shadow-xl">
                                    <iframe
                                        className="w-full h-full rounded-lg"
                                        src={`https://www.youtube.com/embed/${id}?rel=0`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="YouTube Embedded Session"
                                    ></iframe>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 6. JOIN TEAM/COLLABORATE (Dynamic Content) */}
            {config?.joinTeam?.enabled && (
                <section className="py-12 bg-blue-700 text-white text-center">
                    <div className="max-w-4xl mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-4">{config.joinTeam.text}</h2>
                        <Link href={config.joinTeam.joinHref || '#'} className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-100 transition-colors shadow-lg">
                            Be A Part of Our Team
                        </Link>
                    </div>
                </section>
            )}

        </PublicLayout>
    );
};

// Next.js function to fetch all necessary data on the server side
export async function getServerSideProps() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
        // Fetch 1: Homepage Configuration using native fetch
        const configResponse = await fetch(`${API_URL}/home`);
        const config = configResponse.ok ? await configResponse.json() : {};

        // Fetch 2: Published Courses
        const coursesResponse = await fetch(`${API_URL}/courses`);
        const allCourses = coursesResponse.ok ? await coursesResponse.json() : [];
        
        // We filter on the server now
        const courses = allCourses.filter(c => c.isPublished); 

        return {
            props: {
                config,
                courses,
                // blogs: [], // Removed as it wasn't being fetched
            },
        };
    } catch (error) {
        console.error('CRITICAL SSR FETCH ERROR:', error.message);
        return {
            props: {
                config: {}, // Return empty defaults to prevent frontend crash
                courses: [],
                // blogs: [],
            },
        };
    }
}

export default HomePage;