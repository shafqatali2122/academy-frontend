// frontend/src/components/admin/BlogForm.jsx

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/context/AuthContext';
import { FaSave, FaTimesCircle } from 'react-icons/fa';
import TextEditor from '@/components/common/TextEditor'

// API URL and Slug helper
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const BlogForm = ({ blogData = {} }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { user } = useAuth();
    
    // Check if we are in Edit mode (if blogData has an _id)
    const isEditMode = !!blogData._id;

    // 1. STATE Management
    const [title, setTitle] = useState(blogData.title || '');
    const [slug, setSlug] = useState(blogData.slug || '');
    const [description, setDescription] = useState(blogData.description || '');
    const [content, setContent] = useState(blogData.content || '');
    const [summary, setSummary] = useState(blogData.summary || '');
    const [isPublished, setIsPublished] = useState(blogData.isPublished || false);
    const [image, setImage] = useState(blogData.image || ''); // Currently placeholder for URL

    // Update slug when title changes, but only if it's a new blog or slug hasn't been manually edited
    useEffect(() => {
        if (!isEditMode && title && !slug) {
            setSlug(slugify(title));
        }
    }, [title, isEditMode, slug]);

    // 2. MUTATION SETUP (Handles both Create and Update)
    const mutation = useMutation({
        mutationFn: async (formData) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            if (isEditMode) {
                // PUT request for UPDATE
                await axios.put(`${API_URL}/blogs/${blogData._id}`, formData, config);
            } else {
                // POST request for CREATE
                await axios.post(`${API_URL}/blogs`, formData, config);
            }
        },
        onSuccess: () => {
            const successMessage = isEditMode ? 'Blog post updated successfully!' : 'New blog post created successfully!';
            toast.success(successMessage);
            queryClient.invalidateQueries(['blogs']); // Refresh the blog list
            router.push('/admin/blogs'); // Redirect back to the blog list
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || 'Action failed. Check your data.';
            toast.error(errorMessage);
        },
    });

    // 3. SUBMIT HANDLER
    const submitHandler = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!title || !slug || !description || !content) {
            toast.error('Please fill in all required fields.');
            return;
        }

        const formData = {
            title,
            slug: slugify(slug),
            description,
            content,
            summary,
            image,
            isPublished,
        };

        mutation.mutate(formData);
    };

    return (
        <form onSubmit={submitHandler} className="space-y-6 p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-semibold border-b pb-3 mb-4 text-gray-800">
                {isEditMode ? `Edit Blog Post: ${blogData.title}` : 'Create New Blog Post'}
            </h2>

            {/* Title and Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Blog Title <span className="text-red-500">*</span></label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">URL Slug (SEO Focus) <span className="text-red-500">*</span></label>
                    <input type="text" id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50" />
                    <p className="mt-1 text-xs text-gray-500">Public URL will be: /blogs/{slug}</p>
                </div>
            </div>

            {/* Short Description (Meta) */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Short Description (SEO Meta Tag) <span className="text-red-500">*</span></label>
                <textarea id="description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                <p className="mt-1 text-xs text-gray-500">Used for blog cards and search engine snippets.</p>
            </div>

            {/* Full Content */}
        <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Full Blog Content (Rich Text Editor) <span className="text-red-500">*</span></label>
            {/* NEW: Use the TextEditor component */}
            <TextEditor 
                value={content}
                onChange={setContent}
                placeholder="Enter the full, formatted blog article here..."
            />
        </div>

            {/* Summary and Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Summary</label>
                    <input type="text" id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL (Placeholder)</label>
                    <input type="text" id="image" value={image} onChange={(e) => setImage(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    <p className="mt-1 text-xs text-gray-500">Paste the public image URL here.</p>
                </div>
            </div>

            {/* Publish Status */}
            <div className="flex items-center">
                <input id="isPublished" name="isPublished" type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <label htmlFor="isPublished" className="ml-2 block text-sm font-medium text-gray-700">
                    Publish Blog Post (Make visible on public site)
                </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                    type="button"
                    onClick={() => router.push('/admin/blogs')}
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                >
                    <FaTimesCircle className="mr-2" /> Cancel
                </button>
                <button
                    type="submit"
                    disabled={mutation.isLoading}
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 transition-colors"
                >
                    <FaSave className="mr-2" /> {mutation.isLoading ? 'Processing...' : (isEditMode ? 'Update Blog Post' : 'Create Blog Post')}
                </button>
            </div>
        </form>
    );
};

export default BlogForm;
