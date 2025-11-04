// frontend/src/pages/blog.jsx

import PublicLayout from '@/layouts/PublicLayout';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const BlogPage = ({ blogs }) => {
    return (
        <PublicLayout 
            title="Tech Blog - Full-Stack Development Insights & Tutorials"
            description="Stay updated with the latest trends in MERN, Next.js, and web development through our expert blog posts and tutorials."
        >
            <Head>
                {/* SEO: Add specific schema for Blog List page */}
                <script 
                    type="application/ld+json" 
                    dangerouslySetInnerHTML={{ __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        "name": "Shafqat Ali Academy Tech Blog",
                        "description": "Insights and tutorials on web development.",
                    }) }}
                />
            </Head>

            <div className="py-12 max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
                    Latest Insights from the Academy Blog
                </h1>

                {blogs.length === 0 ? (
                    <div className="text-center p-10 bg-gray-100 rounded-lg">
                        <p className="text-xl text-gray-600">No blog articles are published yet. Check back soon for updates!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <div key={blog._id} className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                                <img 
                                    src={blog.image || '/images/default-blog.jpg'} // Use stored image URL
                                    alt={`Featured image for ${blog.title}`} 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{blog.title}</h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.summary}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-sm text-gray-500">
                                            {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </span>
                                        <Link 
                                            href={`/blog/${blog.slug}`} // Link to the dynamic blog detail page
                                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Read Article
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
        // Fetch all blog posts
        const { data } = await axios.get(`${API_URL}/blogs`);
        
        // Filter to ensure only published blogs are shown to the public
        const publishedBlogs = data.filter(blog => blog.isPublished);

        return {
            props: {
                blogs: publishedBlogs, // Pass data to the component as props
            },
        };
    } catch (error) {
        console.error('Error fetching blogs for public site:', error.message);
        return {
            props: {
                blogs: [], // Return empty array on failure
            },
        };
    }
}

export default BlogPage;