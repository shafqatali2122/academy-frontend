// frontend/src/pages/admin/materials/index.jsx (FULL CODE REPLACEMENT)

import AdminLayout from '@/layouts/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { FaUpload, FaTrash } from 'react-icons/fa';
import { useAuth } from '@/utils/context/AuthContext';
import SearchBar from '@/components/common/SearchBar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const MaterialManagementPage = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const token = user?.token;
    
    // Local state for UI
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Upload Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [isPublished, setIsPublished] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const getConfig = (contentType = 'application/json') => ({ 
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': contentType,
        } 
    });

    // 1. READ: Fetch Categories (for the dropdown)
    const { data: categories } = useQuery({
        queryKey: ['materialCategories'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/materials/categories`);
            return data.filter(c => c.isActive);
        },
        enabled: !!token,
    });

    // 2. READ: Fetch Materials
    const { data: materials, isLoading } = useQuery({
        queryKey: ['materials', filterStatus],
        queryFn: async () => {
            const statusParam = filterStatus === 'all' ? '' : `&status=${filterStatus}`;
            const { data } = await axios.get(`${API_URL}/materials?${statusParam}`, getConfig());
            return data;
        },
        enabled: !!token,
    });

    // 3. CREATE: File Upload Mutation (Cloudinary)
    const uploadMutation = useMutation({
        mutationFn: async (formData) => {
            await axios.post(`${API_URL}/materials`, formData, getConfig('multipart/form-data'));
        },
        onSuccess: () => {
            toast.success('File uploaded and material created successfully!');
            queryClient.invalidateQueries(['materials']);
            // Reset form
            setTitle('');
            setDescription('');
            setCategory('');
            setSelectedFile(null);
            setLoading(false);
        },
        onError: (err) => {
            toast.error(`Upload failed: ${err.response?.data?.message || 'Server error'}`);
            setLoading(false);
        },
    });

    // 4. DELETE: Material Deletion
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`${API_URL}/materials/${id}`, getConfig());
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['materials']);
            toast.success('Material deleted successfully!');
        },
        onError: (err) => toast.error(`Deletion failed: ${err.response?.data?.message}`),
    });

    const handleFileUploadSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (!title || !category || !selectedFile) {
            toast.error('Title, Category, and File are required.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('isPublished', isPublished);
        formData.append('file', selectedFile); 

        uploadMutation.mutate(formData);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this material and permanently remove the file from Cloudinary?')) {
            deleteMutation.mutate(id);
        }
    };

    // Apply Client-side filtering for the table
    const filteredMaterials = materials?.filter(mat =>
        mat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mat.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // --- RENDERING ---

    if (isLoading) return <AdminLayout><div>Loading Materials...</div></AdminLayout>;

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-6">Free Material Management</h1>
            <div className="text-sm text-gray-600 mb-4 font-semibold">
                Total {materials?.length || 0} Material Resources Found
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMN 1: Upload Form */}
                <div className="lg:col-span-1 p-6 bg-white shadow-lg rounded-xl border border-blue-100 h-fit">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Upload New Resource</h2>
                    <form onSubmit={handleFileUploadSubmit} className="space-y-4">
                        
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title (E-book Name / Guide Name)</label>
                            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 border rounded-md" />
                        </div>
                        
                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Short Description (for public page)</label>
                            <textarea id="description" rows="2" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded-md"></textarea>
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
                            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-2 border rounded-md bg-white">
                                <option value="">-- Select Category --</option>
                                {categories?.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                            {/* Link to create categories if none exist */}
                            {categories?.length === 0 && <p className="mt-1 text-xs text-red-500">Please create a category first!</p>}
                        </div>
                        
                        {/* File Input */}
                        <div>
                            <label htmlFor="file" className="block text-sm font-medium text-gray-700">Select File (PDF, DOCX, ZIP, etc.) *</label>
                            <input type="file" id="file" onChange={(e) => setSelectedFile(e.target.files[0])} required className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            {selectedFile && <p className="mt-1 text-xs text-gray-500">File selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>}
                        </div>

                        {/* Publish Status */}
                        <div className="flex items-center">
                            <input id="isPublished" type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                            <label htmlFor="isPublished" className="ml-2 block text-sm font-medium text-gray-700">
                                Publish Material (Make public)
                            </label>
                        </div>

                        <button type="submit" disabled={loading || uploadMutation.isLoading || !selectedFile || categories?.length === 0} className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400">
                            <FaUpload className="mr-2" /> {loading ? 'Uploading...' : 'Upload & Create'}
                        </button>
                    </form>
                </div>

                {/* COLUMN 2 & 3: Materials List */}
                <div className="lg:col-span-2 space-y-4">
                    
                    <div className="flex justify-between items-center">
                        <SearchBar 
                            searchTerm={searchTerm} 
                            onSearchChange={setSearchTerm} 
                            placeholder="Search materials by title..."
                        />
                        <div className="flex space-x-3 text-sm font-medium text-gray-700">
                            {/* Status Filter Placeholder */}
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredMaterials.map((mat) => (
                                    <tr key={mat._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="font-medium text-gray-900">{mat.title}</span>
                                            <span className="block text-xs text-gray-500 uppercase">.{mat.fileType}</span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{mat.category.name}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{mat.sizeKB} KB</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${mat.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {mat.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => handleDelete(mat._id)} title="Delete from CMS & Cloudinary" className="text-red-600 hover:text-red-900">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredMaterials.length === 0 && <div className="p-6 text-center text-gray-500">No materials match your criteria.</div>}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default MaterialManagementPage;