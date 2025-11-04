// frontend/src/pages/admin/home/index.jsx (FINAL CODE WITH LABELS)

import AdminLayout from '@/layouts/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { FaSave, FaChevronDown, FaYoutube, FaHome, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '@/utils/context/AuthContext';
import YoutubeIdManager from '@/components/admin/YoutubeIdManager';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Reusable Collapsible Panel Component
const Panel = ({ title, children, isOpen, onToggle }) => (
    <div className="border border-gray-200 rounded-lg shadow-sm mb-4">
        <button type="button" onClick={onToggle} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
            <span className="text-lg font-semibold text-gray-700"><FaHome className="inline mr-2 text-blue-600" />{title}</span>
            <FaChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
        </button>
        {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
);

const HomeConfigPage = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const token = user?.token;

    const [config, setConfig] = useState(null);
    const [openPanel, setOpenPanel] = useState('hero'); // Control which panel is open

    const getConfig = () => ({ headers: { Authorization: `Bearer ${token}` } });

    // 1. READ: Fetch current config
    const { data: initialConfig, isLoading } = useQuery({
        queryKey: ['homeConfig'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/home`);
            return data;
        },
        enabled: !!token,
    });

    // Load initial config state when data arrives (or set safe defaults)
    useEffect(() => {
        if (initialConfig) {
            setConfig(initialConfig);
        } else if (initialConfig === null) {
            // Set defaults if no document exists yet
             setConfig({
                hero: { enabled: true, title: "Master Full-Stack Development with Expert Guidance", subtitle: "Academic Authority meets Professional Pedagogy.", ctaText: "View Course Catalog", ctaHref: "/courses", bgImageUrl: "/images/hero-default.jpg" },
                announcement: { enabled: false, text: "New Course enrollment is open!", href: "/contact" },
                testimonials: { enabled: true, items: [] },
                coursesShowcase: { enabled: true, heading: "Our Featured Programs", limit: 3 },
                mediaGallery: { enabled: true, heading: "Session Highlights & Expert Tips", youtubeIds: [] },
                blogSpotlight: { enabled: true, heading: "Latest Insights from Our Scholars", limit: 3 },
                ownerSection: { enabled: true, heading: "Meet Your Instructor: Shafqat Ali", bio: "M.Phil Scholar, Cambridge Certified Educator, and Founder.", avatarUrl: "/images/owner-avatar.jpg" },
                donate: { enabled: false, text: "Help us sponsor a student’s entire course fees.", donateHref: "/donate" },
                joinTeam: { enabled: true, text: "Join our mission. Become a part of our expert teaching team.", joinHref: "/contact?subject=Teaching%20Opportunity" }
            });
        }
    }, [initialConfig]);


    // 2. UPDATE: Mutation for saving changes
    const updateMutation = useMutation({
        mutationFn: async (newConfig) => {
            await axios.put(`${API_URL}/home`, newConfig, getConfig());
        },
        onSuccess: () => {
            toast.success('Homepage configuration updated successfully!');
            queryClient.invalidateQueries(['homeConfig']);
        },
        onError: (err) => toast.error(`Update failed: ${err.response?.data?.message || err.message}`),
    });

    // Helper to handle nested state changes
    const handleInputChange = (section, field, value) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...(prev?.[section] || {}),
                [field]: value,
            }
        }));
    };

    if (isLoading || !config) return <AdminLayout><div>Loading Homepage Configuration...</div></AdminLayout>;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Exclude Mongo metadata before sending
        const { _id, createdAt, updatedAt, __v, ...dataToSend } = config; 
        updateMutation.mutate(dataToSend);
    };


    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-6">Homepage CMS Editor</h1>
            <p className="text-gray-600 mb-6 flex items-center"><FaInfoCircle className="mr-2 text-blue-500" /> Control the visibility and content of every section on your public homepage.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* -------------------- HERO SECTION -------------------- */}
                <Panel title="Hero Section (Main Banner)" isOpen={openPanel === 'hero'} onToggle={() => setOpenPanel(openPanel === 'hero' ? null : 'hero')}>
                    <div className="space-y-4">
                        <label className="flex items-center space-x-2 text-sm font-medium">
                            <input type="checkbox" checked={config.hero.enabled} onChange={(e) => handleInputChange('hero', 'enabled', e.target.checked)} />
                            <span>Enable This Section</span>
                        </label>
                        
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Main Headline (H1)</label>
                            <input type="text" value={config.hero.title} onChange={(e) => handleInputChange('hero', 'title', e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., Master Your Vision Now" />
                        </div>
                        
                        {/* Subtitle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sub-Headline / Main Value Proposition</label>
                            <textarea value={config.hero.subtitle} onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., Academic Authority meets Professional Pedagogy." />
                        </div>
                        
                        {/* CTA Button Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">CTA Button Text</label>
                            <input type="text" value={config.hero.ctaText} onChange={(e) => handleInputChange('hero', 'ctaText', e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., Enroll Now" />
                        </div>
                        
                        {/* CTA Link */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">CTA Link (Internal URL Slug)</label>
                            <input type="text" value={config.hero.ctaHref} onChange={(e) => handleInputChange('hero', 'ctaHref', e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., /courses or /contact" />
                        </div>
                        
                        {/* Background Image URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Background Image URL (Full Link - Cloudinary/External)</label>
                            <input type="text" value={config.hero.bgImageUrl} onChange={(e) => handleInputChange('hero', 'bgImageUrl', e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., /images/hero-default.jpg or https://res.cloudinary.com/..." />
                        </div>
                    </div>
                </Panel>

                {/* -------------------- ANNOUNCEMENT BAR -------------------- */}
                <Panel title="Announcement Bar (Top Alert)" isOpen={openPanel === 'announcement'} onToggle={() => setOpenPanel(openPanel === 'announcement' ? null : 'announcement')}>
                    <div className="space-y-4">
                        <label className="flex items-center space-x-2 text-sm font-medium">
                            <input type="checkbox" checked={config.announcement.enabled} onChange={(e) => handleInputChange('announcement', 'enabled', e.target.checked)} />
                            <span>Enable Alert Bar</span>
                        </label>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Announcement Text</label>
                            <input type="text" value={config.announcement.text} onChange={(e) => handleInputChange('announcement', 'text', e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., New O-Level Islamiyat Prep Course starts next month!" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Link URL (Optional)</label>
                            <input type="text" value={config.announcement.href} onChange={(e) => handleInputChange('announcement', 'href', e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., /contact or a full external URL" />
                        </div>
                    </div>
                </Panel>
                
                {/* -------------------- COURSE SHOWCASE -------------------- */}
                <Panel title="Course Spotlight (Featured Courses)" isOpen={openPanel === 'courses'} onToggle={() => setOpenPanel(openPanel === 'courses' ? null : 'courses')}>
                    <div className="space-y-4">
                        <label className="flex items-center space-x-2 text-sm font-medium">
                            <input type="checkbox" checked={config.coursesShowcase.enabled} onChange={(e) => handleInputChange('coursesShowcase', 'enabled', e.target.checked)} />
                            <span>Enable Course Spotlight Section</span>
                        </label>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Section Heading</label>
                            <input type="text" value={config.coursesShowcase.heading} onChange={(e) => handleInputChange('coursesShowcase', 'heading', e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., Our Featured Programs" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Number of Courses to Show</label>
                            <input type="number" value={config.coursesShowcase.limit} onChange={(e) => handleInputChange('coursesShowcase', 'limit', parseInt(e.target.value))} className="w-full p-2 border rounded-md" placeholder="3" />
                            <p className="text-sm text-gray-500 mt-1">Note: Courses shown are the most recently published.</p>
                        </div>
                    </div>
                </Panel>
                

                {/* -------------------- MEDIA GALLERY -------------------- */}
                <Panel title="Media Gallery (YouTube Embeds)" isOpen={openPanel === 'media'} onToggle={() => setOpenPanel(openPanel === 'media' ? null : 'media')}>
                    <div className="space-y-4">
                    <label className="flex items-center space-x-2 text-sm font-medium">
                        <input type="checkbox" checked={config.mediaGallery.enabled} onChange={(e) => handleInputChange('mediaGallery', 'enabled', e.target.checked)} />
                        <span>Enable Media Gallery Section</span>
                    </label>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Section Heading</label>
                        <input type="text" value={config.mediaGallery.heading} onChange={(e) => handleInputChange('mediaGallery', 'heading', e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., Session Highlights & Expert Tips" />
                    </div>

                    {/* CRITICAL FIX: REPLACE TEXTAREA WITH DYNAMIC MANAGER */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Video IDs List</label>
                        <YoutubeIdManager
                            youtubeIds={config.mediaGallery.youtubeIds || []}
                            onChange={(newIds) => handleInputChange('mediaGallery', 'youtubeIds', newIds)}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Paste ONLY the video ID (the part after v=). Use the '+' button to add more fields.
                        </p>
                    </div>
                </div>
                </Panel>
                
                {/* -------------------- OWNER/BIO SECTION -------------------- */}
                <Panel title="Owner/Bio Section (The Instructor)" isOpen={openPanel === 'owner'} onToggle={() => setOpenPanel(openPanel === 'owner' ? null : 'owner')}>
                    <div className="space-y-4">
                        <label className="flex items-center space-x-2 text-sm font-medium">
                            <input type="checkbox" checked={config.ownerSection.enabled} onChange={(e) => handleInputChange('ownerSection', 'enabled', e.target.checked)} />
                            <span>Enable Owner/Bio Section</span>
                        </label>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Section Heading</label>
                            <input type="text" value={config.ownerSection.heading} onChange={(e) => handleInputChange('ownerSection', 'heading', e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., Meet Your Instructor: Shafqat Ali" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Short Bio / Vision Statement</label>
                            <textarea value={config.ownerSection.bio} onChange={(e) => handleInputChange('ownerSection', 'bio', e.target.value)} className="w-full p-2 border rounded-md" rows="3" placeholder="e.g., M.Phil Scholar, Cambridge Certified Educator, and Founder." />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Avatar Image URL (Headshot)</label>
                            <input type="text" value={config.ownerSection.avatarUrl} onChange={(e) => handleInputChange('ownerSection', 'avatarUrl', e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., /images/owner-avatar.jpg" />
                        </div>
                    </div>
                </Panel>

                {/* -------------------- SAVE BUTTON -------------------- */}
                <div className="flex justify-end pt-4 border-t">
                    <button type="submit" disabled={updateMutation.isLoading} className="flex items-center px-6 py-3 text-lg font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400">
                        <FaSave className="inline mr-2" /> {updateMutation.isLoading ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
};

export default HomeConfigPage;