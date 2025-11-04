// frontend/pages/admin/courses/[id].jsx (The Edit Page)

import AdminLayout from '@/layouts/AdminLayout';
import CourseForm from '@/components/admin/CourseForm';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const EditCoursePage = () => {
    const router = useRouter();
    // Get the course ID from the URL: /admin/courses/12345/edit
    const { id } = router.query; 

    // 1. Fetch the specific course data
    const { data: course, isLoading, isError } = useQuery({
        queryKey: ['course', id],
        queryFn: async () => {
            // We use the ID route here, not the slug route
            const { data } = await axios.get(`${API_URL}/courses/${id}`);
            return data;
        },
        // Only run the query if we have a valid ID
        enabled: !!id, 
        onError: (error) => {
            toast.error(`Error fetching course: ${error.message}`);
        }
    });
    
    // --- UI RENDERING ---
    
    if (isLoading || !id) return <AdminLayout><div>Loading Course Details...</div></AdminLayout>;
    
    // If we get an error or no course is found
    if (isError || !course) return <AdminLayout><div className="text-red-500">Error: Could not find course with ID: {id}</div></AdminLayout>;

    // Pass the fetched course data to the CourseForm component
    return (
        <AdminLayout>
            {/* The CourseForm component handles the PUT request for updates */}
            <CourseForm courseData={course} />
        </AdminLayout>
    );
};

export default EditCoursePage;