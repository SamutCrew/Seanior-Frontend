// /admin/course/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import withLayout from '@/hocs/WithLayout';
import { LayoutType } from '@/types/layout';
import { getAllCourses } from '@/api/course_api';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from '@heroui/react';
import { Course } from '@/types/course';

const AdminCourse = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getAllCourses();
        setCourses(data);
        setError(null);
      } catch (err: any) {
        setError('Failed to fetch courses');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const openModal = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Course Dashboard</h1>
      <p className="mb-2">Welcome, {user?.user_name || 'Admin'}</p>
      <div className="mt-6">
        {loading ? (
          <p>Loading courses...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : courses.length === 0 ? (
          <p>No courses available.</p>
        ) : (
          <Table aria-label="Course List Table">
            <TableHeader>
              <TableColumn>Image</TableColumn>
              <TableColumn>Course ID</TableColumn>
              <TableColumn>Course Name</TableColumn>
              <TableColumn>Instructor</TableColumn>
              <TableColumn>Price</TableColumn>
              <TableColumn>Created At</TableColumn>
              <TableColumn>Updated At</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.course_id}>
                  <TableCell>
                    {course.image && (
                      <img
                        src={course.image}
                        alt={`${course.course_name} image`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell>{course.course_id}</TableCell>
                  <TableCell>{course.course_name}</TableCell>
                  <TableCell>{course.instructor?.name || '-'}</TableCell>
                  <TableCell>{course.price}</TableCell>
                  <TableCell>{new Date(course.created_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(course.updated_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button size="sm" color="primary" onClick={() => openModal(course)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Course Detail Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent>
            <ModalHeader>Course Details</ModalHeader>
            <ModalBody>
            {selectedCourse && (
                <div className="space-y-2 dark:text-white">
                <p><strong>Course ID:</strong> {selectedCourse.course_id}</p>
                <p><strong>Course Name:</strong> {selectedCourse.course_name}</p>
                <p><strong>Instructor:</strong> {selectedCourse.instructor?.name || '-'}</p>
                <p><strong>Price:</strong> {selectedCourse.price}</p>
                <p><strong>Pool Type:</strong> {selectedCourse.pool_type}</p>
                <p><strong>Location:</strong> {selectedCourse.location}</p>
                <p><strong>Description:</strong> {selectedCourse.description}</p>
                <p><strong>Duration:</strong> {selectedCourse.course_duration} weeks</p>
                <p><strong>Study Frequency:</strong> {selectedCourse.study_frequency}</p>
                <p><strong>Days Study:</strong> {selectedCourse.days_study}</p>
                <p><strong>Total Sessions:</strong> {selectedCourse.number_of_total_sessions}</p>
                <p><strong>Level:</strong> {selectedCourse.level}</p>
                <p><strong>Schedule:</strong> {selectedCourse.schedule}</p>
                <p><strong>Rating:</strong> {selectedCourse.rating}</p>
                <p><strong>Students:</strong> {selectedCourse.students}</p>
                <p><strong>Max Students:</strong> {selectedCourse.max_students}</p>
                {selectedCourse.image && (
                    <img
                    src={selectedCourse.image}
                    alt={`${selectedCourse.course_name} image`}
                    className="w-full max-w-xs rounded mt-2"
                    />
                )}
                </div>
            )}
            </ModalBody>
            <ModalFooter>
                <Button color="default" variant="bordered" onClick={closeModal} className="dark:text-white hover:bg-red-500">
                Close
                </Button>
            </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default withLayout(AdminCourse, LayoutType.Admin);