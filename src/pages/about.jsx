// frontend/src/pages/about.jsx

import PublicLayout from '@/layouts/PublicLayout';

const AboutPage = () => {
    return (
        <PublicLayout title="About Al-Khalil Institute | Islamic Teacher Training">
            <div className="py-12 max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b pb-3">
                    Our Mission: Blending Classical Scholarship with Modern Pedagogy
                </h1>
                
                <section className="text-lg space-y-6 text-gray-700">
                    <p>
                        The <strong className="text-gray-900">Al-Khalil Institute</strong> was founded by scholar and educator <strong className="text-gray-900">Shafqat Ali</strong> to address a critical gap in modern education: the need for teachers who possess both the <strong className="text-gray-900">deep, authentic knowledge</strong> (<em className="italic">Ilm</em>) of traditional Islamic scholarship and the specialized skills required to excel in the <strong className="text-gray-900">Cambridge Assessment International Education (CAIE)</strong> system.
                    </p>
                    <p>
                        We specialize exclusively in professional development, offering rigorous training that transforms <em className="italic">Ulama</em> (Dars-e-Nizami graduates) and Islamic Studies professionals into highly competent <strong className="text-gray-900">O-Levels Islamiyat (2058)</strong> teachers. Our goal is to ensure that the next generation receives authentic Islamic education delivered with modern teaching methodologies.
                    </p>
                    <p className="font-semibold text-blue-700">
                        We believe that the most valuable teachers are those who can successfully bridge these two worlds—the <em className="italic">Madrasah</em> and the modern classroom.
                    </p>
                </section>

                {/* Statistics / Value Propositions */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-5 bg-blue-50 rounded-lg shadow-md">
                        <h3 className="text-4xl font-extrabold text-blue-600">Dars-e-Nizami</h3>
                        <p className="text-gray-600">Foundation in Classical Texts</p>
                    </div>
                    <div className="p-5 bg-blue-50 rounded-lg shadow-md">
                        <h3 className="text-4xl font-extrabold text-blue-600">2058</h3>
                        <p className="text-gray-600">O-Level Syllabus Focus</p>
                    </div>
                    <div className="p-5 bg-blue-50 rounded-lg shadow-md">
                        <h3 className="text-4xl font-extrabold text-blue-600">PKR</h3>
                        <p className="text-gray-600">Serving the Pakistani Education Sector</p>
                    </div>
                </div>
                
                {/* Section for Founder's Bio Summary */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Founder: Shafqat Ali</h2>
                    <div className="md:flex md:space-x-8 items-start">
                        <div className="md:w-1/4 mb-4 md:mb-0">
                            <img 
                                src="https://placehold.co/300x300/1e88e5/ffffff?text=Shafqat+Ali" 
                                alt="Shafqat Ali, Founder of Al-Khalil Institute" 
                                className="w-full h-auto rounded-xl shadow-lg" 
                            />
                        </div>
                        <div className="md:w-3/4 text-gray-700 space-y-4">
                            <p>
                                Shafqat Ali is an acclaimed Imam, a dedicated <strong className="text-gray-900">M.Phil Scholar in Islamic Learning (Karachi University)</strong>, and the driving force behind Al-Khalil Institute. With years of experience serving as an Imam, he deeply understands the community's need for authentic religious teaching.
                            </p>
                            <p>
                                His vision is rooted in transforming the teaching landscape by providing rigorous training that is both academically sound and ethically grounded. He continues to teach, ensuring the institute's programs remain relevant and impactful.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </PublicLayout>
    );
};

export default AboutPage;