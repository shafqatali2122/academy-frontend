// frontend/src/pages/admin/materials/categories.jsx

import AdminLayout from '@/layouts/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { FaPlus, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useAuth } from '@/utils/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
// Helper function for creating slugs
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const CategoryManagementPage = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const token = user?.token;

    // Local state for new category form
    const [newCatName, setNewCatName] = useState('');
    const [newCatSlug, setNewCatSlug] = useState('');
    const [parentCat, setParentCat] = useState(''); // For hierarchical categories
    const [loading, setLoading] = useState(false);

    const getConfig = () => ({ headers: { Authorization: `Bearer ${token}` } });

    // 1. READ: Fetch all categories
    const { data: categories, isLoading, isError, error } = useQuery({
        queryKey: ['materialCategories'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/materials/categories`);
            return data;
        },
        enabled: !!token,
    });

    // 2. CREATE: Mutation for adding a new category
    const createMutation = useMutation({
        mutationFn: async (newCategory) => {
            await axios.post(`${API_URL}/materials/categories`, newCategory, getConfig());
        },
        onSuccess: () => {
            toast.success('Category created successfully!');
            queryClient.invalidateQueries(['materialCategories']);
            setNewCatName('');
            setNewCatSlug('');
            setParentCat('');
            setLoading(false);
        },
        onError: (err) => {
            toast.error(`Creation failed: ${err.response?.data?.message || err.message}`);
            setLoading(false);
        },
    });

    // 3. UPDATE: Mutation for toggling category status
    const toggleMutation = useMutation({
        mutationFn: async (id) => {
            await axios.put(`${API_URL}/materials/categories/${id}/toggle`, {}, getConfig());
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['materialCategories']);
            toast.success('Category status updated.');
        },
        onError: (err) => toast.error(`Update failed: ${err.response?.data?.message}`),
    });

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (!newCatName || !newCatSlug) {
            toast.error('Name and Slug are required.');
            setLoading(false);
            return;
        }

        createMutation.mutate({
            name: newCatName,
            slug: slugify(newCatSlug),
            parent: parentCat || null,
        });
    };

    // --- RENDERING ---

    if (isLoading) return <AdminLayout><div>Loading Categories...</div></AdminLayout>;

    const activeCategories = categories?.filter(c => c.isActive) || [];
    const inactiveCategories = categories?.filter(c => !c.isActive) || [];

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-6">Material Categories Management</h1>
            <div className="text-sm text-gray-600 mb-4 font-semibold">
                Total {categories?.length || 0} Categories Defined
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMN 1: Create New Category Form */}
                <div className="lg:col-span-1 p-6 bg-white shadow-lg rounded-xl border border-blue-100 h-fit">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Create New Category</h2>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        
                        {/* Name */}
                        <div>
                            <label htmlFor="catName" className="block text-sm font-medium text-gray-700">Category Name (e.g., O-Level Islamiyat)</label>
                            <input type="text" id="catName" value={newCatName} onChange={(e) => {setNewCatName(e.target.value); setNewCatSlug(slugify(e.target.value));}} required className="w-full p-2 border rounded-md" />
                        </div>
                        
                        {/* Slug */}
                        <div>
                            <label htmlFor="catSlug" className="block text-sm font-medium text-gray-700">SEO Slug</label>
                            <input type="text" id="catSlug" value={newCatSlug} onChange={(e) => setNewCatSlug(e.target.value)} required className="w-full p-2 border rounded-md bg-gray-50" />
                            <p className="mt-1 text-xs text-gray-500">URL path: /materials?cat={newCatSlug}</p>
                        </div>

                        {/* Parent Category (Optional Hierarchy) */}
                        <div>
                            <label htmlFor="parentCat" className="block text-sm font-medium text-gray-700">Parent Category (Optional)</label>
                            <select id="parentCat" value={parentCat} onChange={(e) => setParentCat(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                                <option value="">-- No Parent (Top Level) --</option>
                                {activeCategories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <button type="submit" disabled={loading || createMutation.isLoading} className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400">
                            <FaPlus className="mr-2" /> {loading ? 'Creating...' : 'Create Category'}
                        </button>
                    </form>
                </div>

                {/* COLUMN 2 & 3: Category List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Existing Categories ({categories?.length || 0})</h2>

                    {/* Active Categories */}
                    <div className="p-4 bg-white shadow-md rounded-lg">
                        <h3 className="text-lg font-bold text-green-700 mb-3 border-b pb-2">Active ({activeCategories.length})</h3>
                        <ul className="divide-y divide-gray-200">
                            {activeCategories.map(cat => (
                                <li key={cat._id} className="flex justify-between items-center py-2">
                                    <span className="font-medium text-gray-900">{cat.name}</span>
                                    <button onClick={() => toggleMutation.mutate(cat._id)} title="Deactivate" className="text-green-500 hover:text-green-700">
                                        <FaToggleOn className="text-xl" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Inactive Categories */}
                    <div className="p-4 bg-white shadow-md rounded-lg">
                        <h3 className="text-lg font-bold text-red-700 mb-3 border-b pb-2">Inactive ({inactiveCategories.length})</h3>
                        <ul className="divide-y divide-gray-200">
                            {inactiveCategories.map(cat => (
                                <li key={cat._id} className="flex justify-between items-center py-2">
                                    <span className="font-medium text-gray-500">{cat.name}</span>
                                    <button onClick={() => toggleMutation.mutate(cat._id)} title="Activate" className="text-red-500 hover:text-red-700">
                                        <FaToggleOff className="text-xl" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CategoryManagementPage;