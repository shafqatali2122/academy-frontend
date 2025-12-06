// frontend/src/components/common/WhatsAppIcon.jsx

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppIcon = () => {
    // IMPORTANT: Replace this with your actual WhatsApp contact number
    const whatsappNumber = '923481631827'; 
    const message = encodeURIComponent('Assalam-o-Alaikum! I have a question about the Shafqat Ali Academy courses and need assistance.');

    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

    return (
        <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-transform duration-300 transform hover:scale-105"
            title="Chat with us on WhatsApp"
        >
            <FaWhatsapp className="text-3xl" />
        </a>
    );
};

export default WhatsAppIcon;