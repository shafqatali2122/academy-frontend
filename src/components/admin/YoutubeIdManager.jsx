// frontend/src/components/admin/YoutubeIdManager.jsx

import React from 'react';
import { FaPlus, FaTrash, FaYoutube } from 'react-icons/fa';
import { toast } from 'react-toastify';

const YoutubeIdManager = ({ youtubeIds, onChange }) => {
    // Handler to update a single ID in the array
    const handleIdChange = (index, newId) => {
        const newIds = [...youtubeIds];
        newIds[index] = newId.trim();
        onChange(newIds);
    };

    // Handler to add a new empty input field
    const handleAddId = () => {
        // Prevent adding too many empty fields
        if (youtubeIds.length >= 12) {
             toast.warn("Limit reached. Please manage existing videos.");
             return;
        }
        onChange([...youtubeIds, '']);
    };

    // Handler to remove an input field by index
    const handleRemoveId = (index) => {
        if (youtubeIds.length === 0) return;
        const newIds = youtubeIds.filter((_, i) => i !== index);
        onChange(newIds);
    };

    return (
        <div className="space-y-3">
            {youtubeIds.map((id, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <FaYoutube className="text-red-500 flex-shrink-0" />
                    
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => handleIdChange(index, e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm"
                        placeholder={`Paste YouTube Video ID ${index + 1} here...`}
                    />
                    
                    <button
                        type="button"
                        onClick={() => handleRemoveId(index)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        title="Remove Video"
                    >
                        <FaTrash />
                    </button>
                </div>
            ))}

            {/* Button to add a new video ID field */}
            <button
                type="button"
                onClick={handleAddId}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
                <FaPlus className="mr-2" /> Add New Video Field
            </button>
        </div>
    );
};

export default YoutubeIdManager;