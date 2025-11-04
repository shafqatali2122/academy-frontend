// frontend/src/pages/about.jsx

import PublicLayout from '@/layouts/PublicLayout';

const AboutPage = () => {
    return (
        <PublicLayout title="About Shafqat Ali Academy">
            <div className="py-12 max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-6 border-b pb-3">
                    Our Mission: Building Full-Stack Masters
                </h1>
                
                <section className="text-lg space-y-6 text-gray-700">
                    <p>
                        Shafqat Ali Academy was founded on the principle that modern web development requires mastery of the entire stack. We focus exclusively on the **MERN (MongoDB, Express, React, Node.js)** and **Next.js** ecosystems, providing real-world training that translates directly into high-value careers.
                    </p>
                    <p>
                        Our platform itself is a testament to our skills: a secure, highly scalable, and SEO-optimized CMS built from the ground up using the same technologies we teach. We believe in learning by doing, ensuring every student graduates with a portfolio of complete, production-ready applications.
                    </p>
                    <p className="font-semibold text-blue-700">
                        Join us to become more than just a developer—become a full-stack architect.
                    </p>
                </section>

                {/* Placeholder for team images or stats */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-5 bg-blue-50 rounded-lg shadow-md">
                        <h3 className="text-4xl font-extrabold text-blue-600">5+</h3>
                        <p className="text-gray-600">Years Industry Experience</p>
                    </div>
                    <div className="p-5 bg-blue-50 rounded-lg shadow-md">
                        <h3 className="text-4xl font-extrabold text-blue-600">100%</h3>
                        <p className="text-gray-600">Focus on JavaScript Stacks</p>
                    </div>
                    <div className="p-5 bg-blue-50 rounded-lg shadow-md">
                        <h3 className="text-4xl font-extrabold text-blue-600">SSR</h3>
                        <p className="text-gray-600">SEO-First Methodology</p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default AboutPage;