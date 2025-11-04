// frontend/src/pages/blog/[slug].jsx (FINAL UPDATED)

import PublicLayout from '@/layouts/PublicLayout';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ShareButtons from '@/components/common/ShareButtons'; // <-- ALREADY PRESENT

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const BlogDetailPage = ({ blog }) => {
    const router = useRouter();

    if (router.isFallback) {
        return <PublicLayout><div>Loading blog article...</div></PublicLayout>;
    }
    if (!blog) {
        return (
            <PublicLayout title="Article Not Found">
                <div className="py-20 text-center">
                    <h1 className="text-4xl text-red-600">404 - Blog Article Not Found</h1>
                    <p className="text-gray-600 mt-4">The article you are looking for may have been removed or the URL is incorrect.</p>
                </div>
            </PublicLayout>
        );
    }
    
    // SEO: Article Schema Markup (Crucial for Google News and search visibility)
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `http://localhost:3000/blog/${blog.slug}`
        },
        "headline": blog.title,
        "image": [
            blog.image || 'http://localhost:3000/images/default-blog.jpg'
        ],
        "datePublished": blog.createdAt,
        "dateModified": blog.updatedAt,
        "author": {
            "@type": "Person",
            "name": "Shafqat Ali Academy Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Shafqat Ali Academy",
            "logo": {
                "@type": "ImageObject",
                "url": "http://localhost:3000/logo.png"
            }
        },
        "description": blog.summary
    };

    return (
        <PublicLayout title={blog.title} description={blog.summary}>
            <Head>
                {/* Inject Article Schema JSON-LD */}
                <script 
                    type="application/ld+json" 
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
                />
            </Head>
            
            <article className="max-w-4xl mx-auto px-4 py-12">
                
                {/* Article Header */}
                <header className="mb-10 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                        {blog.title}
                    </h1>
                    <p className="text-md text-gray-500">
                        Published on {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                </header>
                
                {/* Featured Image */}
                {blog.image && (
                    <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-auto object-cover rounded-lg shadow-xl mb-10" 
                    />
                )}

                {/* Main Content Area */}
                <div 
                // NEW CLASS: rte-content ensures all the headings are properly styled
                className="rte-content prose prose-lg max-w-none text-gray-700 mx-auto" 
                dangerouslySetInnerHTML={{ __html: blog.content }} 
                />
                {/* ✅ NEW: Share Buttons */}
                <footer className="mt-10 pt-6 border-t border-gray-200">
                    <ShareButtons 
                        title={blog.title} 
                        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${blog.slug}`}
                    />
                </footer>

            </article>
        </PublicLayout>
    );
};

// Fetch data on the server side using the URL slug
export async function getServerSideProps(context) {
    const { slug } = context.params;

    try {
        const { data } = await axios.get(`${API_URL}/blogs/slug/${slug}`);

        return {
            props: {
                blog: data,
            },
        };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { notFound: true };
        }
        console.error(`Error fetching blog ${slug}:`, error.message);
        return { props: { blog: null } };
    }
}

export default BlogDetailPage;
