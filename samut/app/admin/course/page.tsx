// /admin/course/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import withLayout from '@/hocs/WithLayout';
import { LayoutType } from '@/types/layout';
import { getAllCourses, updateCourse, deleteCourse, uploadCourseImage, uploadPoolImage } from '@/api/course_api';
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
  Input,
  Textarea,
} from '@heroui/react';
import { Course } from '@/types/course';

interface UploadImageResponse {
  message: string;
  resource_url: string;
  resource_id: string;
}

const AdminCourse = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [updateFormData, setUpdateFormData] = useState<Partial<Course>>({});
  const [courseImageFile, setCourseImageFile] = useState<File | null>(null);
  const [poolImageFile, setPoolImageFile] = useState<File | null>(null);

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

  const openDetailModal = (course: Course) => {
    setSelectedCourse(course);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCourse(null);
  };

  const openUpdateModal = (course: Course) => {
    setSelectedCourse(course);
    setUpdateFormData({
      course_name: course.course_name,
      price: course.price,
      pool_type: course.pool_type,
      location: course.location,
      description: course.description,
      course_duration: course.course_duration,
      study_frequency: course.study_frequency,
      days_study: course.days_study,
      number_of_total_sessions: course.number_of_total_sessions,
      level: course.level,
      schedule: course.schedule,
      max_students: course.max_students,
      course_image: course.course_image,
      pool_image: course.pool_image,
    });
    setCourseImageFile(null);
    setPoolImageFile(null);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedCourse(null);
    setUpdateFormData({});
    setCourseImageFile(null);
    setPoolImageFile(null);
  };

  const handleUpdateFormChange = (field: keyof Course, value: any) => {
    setUpdateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (type: 'course' | 'pool') => {
    if (!selectedCourse?.course_id) return;

    try {
      let result: UploadImageResponse;
      if (type === 'course' && courseImageFile) {
        result = await uploadCourseImage(selectedCourse.course_id, courseImageFile);
        setCourses((prev) =>
          prev.map((course) =>
            course.course_id === selectedCourse.course_id
              ? { ...course, course_image: result.resource_url }
              : course
          )
        );
      } else if (type === 'pool' && poolImageFile) {
        result = await uploadPoolImage(selectedCourse.course_id, poolImageFile);
        setCourses((prev) =>
          prev.map((course) =>
            course.course_id === selectedCourse.course_id
              ? { ...course, pool_image: result.resource_url }
              : course
          )
        );
      }
      setError(null);
    } catch (err: any) {
      setError(`Failed to upload ${type} image`);
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse?.course_id) return;

    try {
      await updateCourse(selectedCourse.course_id, updateFormData);
      setCourses((prev) =>
        prev.map((course) =>
          course.course_id === selectedCourse.course_id
            ? { ...course, ...updateFormData }
            : course
        )
      );
      if (courseImageFile) await handleImageUpload('course');
      if (poolImageFile) await handleImageUpload('pool');
      closeUpdateModal();
    } catch (err: any) {
      setError('Failed to update course');
    }
  };

  const openDeleteModal = (courseId: string) => {
    setCourseToDelete(courseId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      await deleteCourse(courseToDelete);
      setCourses((prev) =>
        prev.filter((course) => course.course_id !== courseToDelete)
      );
      closeDeleteModal();
    } catch (err: any) {
      setError('Failed to delete course');
    }
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
                    {course.course_image && (
                      <img
                        src={course.course_image}
                        alt={`${course.course_name} image`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell>{course.course_name}</TableCell>
                  <TableCell>{course.instructor?.name || '-'}</TableCell>
                  <TableCell>{course.price}</TableCell>
                  <TableCell>{new Date(course.created_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(course.updated_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        onClick={() => openDetailModal(course)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        color="warning"
                        onClick={() => openUpdateModal(course)}
                      >
                        Update
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => openDeleteModal(course.course_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* View Details Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={closeDetailModal}>
        <ModalContent className="max-w-2xl w-full mx-auto p-4">
          <ModalHeader>Course Details</ModalHeader>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="dark:text-white">
                <strong>Course ID:</strong> {selectedCourse?.course_id || '-'}
              </div>
              <div className="dark:text-white">
                <strong>Course Name:</strong> {selectedCourse?.course_name || '-'}
              </div>
              <div className="dark:text-white">
                <strong>Instructor:</strong> {selectedCourse?.instructor?.name || '-'}
              </div>
              <div className="dark:text-white">
                <strong>Price:</strong> {selectedCourse?.price || '-'}
              </div>
              <div className="dark:text-white">
                <strong>Pool Type:</strong> {selectedCourse?.pool_type || '-'}
              </div>
              <div className="dark:text-white">
                <strong>Location:</strong> {selectedCourse?.location || '-'}
              </div>
              <div className="dark:text-white col-span-full">
                <strong>Description:</strong> {selectedCourse?.description || '-'}
              </div>
              <div className="dark:text-white">
                <strong>Duration (weeks):</strong> {selectedCourse?.course_duration || '-'}
              </div>
              <div className="dark:text-white">
                <strong>Study Frequency:</strong> {selectedCourse?.study_frequency || '-'}
              </div>
              <div className="dark:text-white">
                <strong>Days Study:</strong> {selectedCourse?.days_study || '-'}
              </div>
              <div className="dark:text-white">
                <strong>Total Sessions:</strong> {selectedCourse?.number_of_total_sessions || '-'}
              </div>
              <div className="dark:text-white">
                <strong>Level:</strong> {selectedCourse?.level || '-'}
              </div>
              <div className="dark:text-white">
                <strong>Schedule:</strong> {selectedCourse?.schedule || '-'}
              </div>
              <div className="dark:text-white">
                <strong>Rating:</strong> {selectedCourse?.rating || '-'}
              </div>
              <div className="dark:text-white">
                <strong>Students:</strong> {selectedCourse?.students || '-'}
              </div>
              <div className="dark:text-white">
                <strong>Max Students:</strong> {selectedCourse?.max_students || '-'}
              </div>
              <div className="dark:text-white col-span-full">
                <strong>Course Image:</strong>
                {selectedCourse?.course_image && (
                  <img
                    src={selectedCourse.course_image}
                    alt={`${selectedCourse.course_name} course image`}
                    className="w-full max-w-xs rounded mt-2"
                  />
                )}
              </div>
              <div className="dark:text-white col-span-full">
                <strong>Pool Image:</strong>
                {selectedCourse?.pool_image && (
                  <img
                    src={selectedCourse.pool_image}
                    alt={`${selectedCourse.course_name} pool image`}
                    className="w-full max-w-xs rounded mt-2"
                  />
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-end gap-2">
            <Button
              color="default"
              variant="bordered"
              onClick={closeDetailModal}
              className="dark:text-white hover:bg-red-500"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update Course Modal */}
      <Modal isOpen={isUpdateModalOpen} onClose={closeUpdateModal}>
        <ModalContent className="max-w-2xl w-full mx-auto p-4">
          <ModalHeader>Update Course</ModalHeader>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Course Name"
                value={updateFormData.course_name || ''}
                onChange={(e) => handleUpdateFormChange('course_name', e.target.value)}
                className="dark:text-white"
              />
              <Input
                label="Price"
                type="number"
                value={updateFormData.price?.toString() || ''}
                onChange={(e) => handleUpdateFormChange('price', Number(e.target.value))}
                className="dark:text-white"
              />
              <Input
                label="Pool Type"
                value={updateFormData.pool_type || ''}
                onChange={(e) => handleUpdateFormChange('pool_type', e.target.value)}
                className="dark:text-white"
              />
              <Input
                label="Location"
                value={updateFormData.location || ''}
                onChange={(e) => handleUpdateFormChange('location', e.target.value)}
                className="dark:text-white"
              />
              <Textarea
                label="Description"
                value={updateFormData.description || ''}
                onChange={(e) => handleUpdateFormChange('description', e.target.value)}
                className="dark:text-white col-span-full"
              />
              <Input
                label="Duration (weeks)"
                type="number"
                value={updateFormData.course_duration?.toString() || ''}
                onChange={(e) => handleUpdateFormChange('course_duration', Number(e.target.value))}
                className="dark:text-white"
              />
              <Input
                label="Study Frequency"
                type="number"
                value={updateFormData.study_frequency?.toString() || ''}
                onChange={(e) => handleUpdateFormChange('study_frequency', Number(e.target.value))}
                className="dark:text-white"
              />
              <Input
                label="Days Study"
                type="number"
                value={updateFormData.days_study?.toString() || ''}
                onChange={(e) => handleUpdateFormChange('days_study', Number(e.target.value))}
                className="dark:text-white"
              />
              <Input
                label="Total Sessions"
                type="number"
                value={updateFormData.number_of_total_sessions?.toString() || ''}
                onChange={(e) => handleUpdateFormChange('number_of_total_sessions', Number(e.target.value))}
                className="dark:text-white"
              />
              <Input
                label="Level"
                value={updateFormData.level || ''}
                onChange={(e) => handleUpdateFormChange('level', e.target.value)}
                className="dark:text-white"
              />
              <Input
                label="Schedule"
                value={updateFormData.schedule || ''}
                onChange={(e) => handleUpdateFormChange('schedule', e.target.value)}
                className="dark:text-white"
              />
              <Input
                label="Max Students"
                type="number"
                value={updateFormData.max_students?.toString() || ''}
                onChange={(e) => handleUpdateFormChange('max_students', Number(e.target.value))}
                className="dark:text-white"
              />
              <div className="col-span-full">
                <label className="dark:text-white block mb-2">Course Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCourseImageFile(e.target.files?.[0] || null)}
                  className="dark:text-white"
                />
                <Button
                  color="primary"
                  onClick={() => handleImageUpload('course')}
                  className="mt-2 dark:text-white"
                  disabled={!courseImageFile}
                >
                  Upload Course Image
                </Button>
                {selectedCourse?.course_image && (
                  <img
                    src={selectedCourse.course_image}
                    alt={`${selectedCourse.course_name} course image`}
                    className="w-full max-w-xs rounded mt-2"
                  />
                )}
              </div>
              <div className="col-span-full">
                <label className="dark:text-white block mb-2">Pool Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPoolImageFile(e.target.files?.[0] || null)}
                  className="dark:text-white"
                />
                <Button
                  color="primary"
                  onClick={() => handleImageUpload('pool')}
                  className="mt-2 dark:text-white"
                  disabled={!poolImageFile}
                >
                  Upload Pool Image
                </Button>
                {selectedCourse?.pool_image && (
                  <img
                    src={selectedCourse.pool_image}
                    alt={`${selectedCourse.course_name} pool image`}
                    className="w-full max-w-xs rounded mt-2"
                  />
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-end gap-2">
            <Button
              color="default"
              variant="bordered"
              onClick={closeUpdateModal}
              className="dark:text-white hover:bg-red-500"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleUpdateCourse}
              className="dark:text-white"
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            <p className="dark:text-white">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="bordered"
              onClick={closeDeleteModal}
              className="dark:text-white hover:bg-gray-500"
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={handleDeleteCourse}
              className="dark:text-white"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default withLayout(AdminCourse, LayoutType.Admin);