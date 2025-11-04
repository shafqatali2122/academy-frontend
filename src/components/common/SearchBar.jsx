// frontend/src/components/common/SearchBar.jsx

import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchTerm, onSearchChange, placeholder }) => {
    return (
        <div className="relative mb-6">
            <input
                type="text"
                placeholder={placeholder || "Search by title, name, or keyword..."}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
    );
};

export default SearchBar;