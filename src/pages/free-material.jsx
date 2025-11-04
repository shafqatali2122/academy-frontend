// frontend/src/pages/free-material.jsx (FULL CODE)

import PublicLayout from '@/layouts/PublicLayout';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { FaDownload, FaLock, FaTags, FaSearch } from 'react-icons/fa';
import { useAuth } from '@/utils/context/AuthContext';
import SearchBar from '@/components/common/SearchBar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const FreeMaterialPage = () => {
    const { user } = useAuth(); // Check if user is logged in (for download gate)
    const isAuthenticated = !!user;

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const getConfig = () => ({ 
        headers: { Authorization: `Bearer ${user?.token}` } 
    });

    // 1. READ: Fetch Active Categories (for filter dropdown)
    const { data: categories } = useQuery({
        queryKey: ['publicCategories'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/materials/categories`);
            return data.filter(c => c.isActive);
        },
    });

    // 2. READ: Fetch Published Materials
    const { data: materials, isLoading } = useQuery({
        queryKey: ['publishedMaterials'],
        queryFn: async () => {
            // Backend handles filtering only published posts if no status parameter is sent
            const { data } = await axios.get(`${API_URL}/materials?status=published`);
            return data;
        },
    });

    // 3. UPDATE: Download Mutation (Increments count and gets URL)
    const downloadMutation = useMutation({
        mutationFn: async (materialId) => {
            // Protected route that checks login status, increments count, and returns the file URL
            const { data } = await axios.post(`${API_URL}/materials/${materialId}/download`, {}, getConfig());
            return data.fileUrl;
        },
        onSuccess: (fileUrl) => {
            toast.success('Download starting...');
            window.open(fileUrl, '_blank'); // Opens the file URL in a new tab
        },
        onError: () => {
            // This error should only trigger if the token is invalid, but is a safeguard
            toast.error('Download failed. Please refresh and try logging in again.');
        },
    });

    // 4. Client-side Filtering Logic
    const filteredMaterials = materials
        ?.filter(mat => {
            const matchesSearch = mat.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !selectedCategory || mat.category._id === selectedCategory;
            return matchesSearch && matchesCategory;
        }) || [];

    // --- Handlers ---
    const handleDownload = (mat) => {
        if (!isAuthenticated) {
            toast.warn('Please log in to your student account to download free resources.', { position: 'top-center' });
            return;
        }
        downloadMutation.mutate(mat._id);
    };

    // --- RENDERING ---

    return (
        <PublicLayout title="Free Material Library - Download Guides & E-books">
            <div className="py-12 max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b pb-3">
                    Free Learning Library ({filteredMaterials.length} Resources)
                </h1>

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-gray-50 rounded-lg shadow-sm border">
                    <div className="flex-1">
                        <SearchBar 
                            searchTerm={searchTerm} 
                            onSearchChange={setSearchTerm} 
                            placeholder="Search by keyword or title..."
                        />
                    </div>
                    
                    <div>
                        <select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value)} 
                            className="w-full md:w-auto p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="">All Categories</option>
                            {categories?.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {/* Download List */}
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500">Loading resources...</div>
                ) : filteredMaterials.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No published materials found matching your criteria.</div>
                ) : (
                    <div className="space-y-4">
                        {filteredMaterials.map((mat) => (
                            <div key={mat._id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-md">
                                
                                {/* Info Column */}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">{mat.title}</h2>
                                    <p className="text-sm text-gray-600 my-1">{mat.description}</p>
                                    <span className="text-xs text-blue-600 font-medium flex items-center">
                                        <FaTags className="mr-1" /> {mat.category.name} | {mat.sizeKB} KB | {mat.downloads} Downloads
                                    </span>
                                </div>
                                
                                {/* Download Button */}
                                <button 
                                    onClick={() => handleDownload(mat)}
                                    disabled={downloadMutation.isLoading}
                                    className={`flex items-center px-4 py-2 rounded-lg text-white font-bold transition-colors shadow-lg ${isAuthenticated ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                    title={isAuthenticated ? 'Click to Download' : 'Log in required to download'}
                                >
                                    {isAuthenticated ? (
                                        <>
                                            <FaDownload className="mr-2" /> Download
                                        </>
                                    ) : (
                                        <>
                                            <FaLock className="mr-2" /> Login Required
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
};

export default FreeMaterialPage;