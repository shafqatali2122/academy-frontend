import React from 'react';
import Head from 'next/head';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

const PublicLayout = ({ 
    title = 'Al-Khalil Institute', 
    description = 'A secure, SEO-friendly digital platform for comprehensive academic and career guidance from Al-Khalil Institute.', 
    children 
}) => {
    return (
        <>
            <Head>
                <title>{title}</title> 
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta charSet="UTF-8" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <Header />
                
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
