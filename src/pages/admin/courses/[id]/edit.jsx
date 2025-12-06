// frontend/pages/admin/courses/[id]/edit.jsx (or edit.jsx)

import AdminLayout from '@/layouts/AdminLayout';
import CourseForm from '@/components/admin/CourseForm';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const EditCoursePage = () => {
    const router = useRouter();
    // Get the course ID from the URL
    const { id } = router.query; 

    // 1. Fetch the specific course data
    const { data: course, isLoading, isError } = useQuery({
        queryKey: ['course', id],
        queryFn: async () => {
            // --- FIX: Get Token directly from Storage ---
            // This ensures we have the "Key" to open the door
            const userInfo = typeof window !== 'undefined' 
                ? JSON.parse(localStorage.getItem('userInfo')) 
                : null;
            
            const token = userInfo?.token;

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            };

            // Send request WITH the token
            const { data } = await axios.get(`${API_URL}/courses/${id}`, config);
            return data;
        },
        // Only run the query if we have a valid ID
        enabled: !!id, 
        onError: (error) => {
            const message = error.response?.data?.message || error.message;
            toast.error(`Error fetching course: ${message}`);
        }
    });
    
    // --- UI RENDERING ---
    
    if (isLoading || !id) return <AdminLayout><div>Loading Course Details...</div></AdminLayout>;
    
    // If we get an error or no course is found
    if (isError || !course) return (
        <AdminLayout>
            <div className="text-red-500 p-4 border border-red-200 bg-red-50 rounded">
                <strong>Error:</strong> Could not find course with ID: {id}. <br/>
                Please try logging out and logging back in.
            </div>
        </AdminLayout>
    );

    // Pass the fetched course data to the CourseForm component
    return (
        <AdminLayout>
            {/* The CourseForm component handles the PUT request for updates */}
            <CourseForm courseData={course} />
        </AdminLayout>
    );
};

export default EditCoursePage;