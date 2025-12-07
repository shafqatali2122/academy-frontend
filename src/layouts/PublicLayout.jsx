import React from 'react';
import Head from 'next/head'; // For SEO metadata
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

// FIX: Updated default title/description to reflect Al-Khalil Institute branding
const PublicLayout = ({ 
    title = 'Al-Khalil Institute', 
    description = 'A secure, SEO-friendly digital platform for comprehensive academic and career guidance from Al-Khalil Institute.', 
    children 
}) => {
    return (
        <>
            <Head>
                {/* Critical for SEO */}
                <title>{title}</title> 
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                
                {/* General Metadata */}
                <meta charSet="UTF-8" />
                {/* FIX: Pointing to the new favicon.svg file */}
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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