// frontend/pages/admin/courses/new.jsx

import AdminLayout from '@/layouts/AdminLayout';
import CourseForm from '@/components/admin/CourseForm';

const NewCoursePage = () => {
  return (
    <AdminLayout>
      <CourseForm />
    </AdminLayout>
  );
};

export default NewCoursePage;