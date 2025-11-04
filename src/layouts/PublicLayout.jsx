// frontend/src/layouts/PublicLayout.jsx

import React from 'react';
import Head from 'next/head'; // For SEO metadata
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

const PublicLayout = ({ title = 'Shafqat Ali Academy', description = 'A secure, SEO-friendly digital platform for managing course content, blog articles, and student enrollment.', children }) => {
    return (
        <>
            <Head>
                {/* Critical for SEO */}
                <title>{title}</title> 
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                
                {/* General Metadata */}
                <meta charSet="UTF-8" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <Header />
                
                {/* Main content area. Flex-1 ensures content pushes the footer down */}
                <main className="flex-grow">
                    {children}
                </main>
                
                <Footer />
                <WhatsAppIcon />
            </div>
        </>
    );
};

export default PublicLayout;