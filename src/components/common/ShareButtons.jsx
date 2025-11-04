// frontend/src/components/common/ShareButtons.jsx

import React from 'react';
import { FaShareAlt, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const ShareButtons = ({ title, url }) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return (
        <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-semibold flex items-center">
                <FaShareAlt className="mr-2" /> Share:
            </span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800"><FaFacebook className="text-xl" /></a>
            <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600"><FaTwitter className="text-xl" /></a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900"><FaLinkedin className="text-xl" /></a>
            <a href={`whatsapp://send?text=${encodedTitle} - ${url}`} data-action="share/whatsapp/share" className="text-green-500 hover:text-green-700"><FaWhatsapp className="text-xl" /></a>
        </div>
    );
};

export default ShareButtons;