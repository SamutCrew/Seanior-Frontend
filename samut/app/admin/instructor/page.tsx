'use client';
import React, { useState, useEffect } from 'react';
import { fetchInstructorsAdmin } from '@/api';
import { useAuth } from '@/context/AuthContext';
import withLayout from '@/hocs/WithLayout';
import { LayoutType } from '@/types/layout';
import type { InstructorAdmin } from '@/types/instructor';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';

// Utility function to parse backend date string
const parseBackendDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
  } catch (error) {
    console.error(`Error parsing date string: ${dateString}`, error);
    return 'N/A';
  }
};

const AdminInstructor = () => {
  const { user } = useAuth();
  const [instructors, setInstructors] = useState<InstructorAdmin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorAdmin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!user || user.user_type !== 'admin') {
      window.location.href = '/auth/Login';
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchInstructorsAdmin();
        setInstructors(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch instructors');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleViewDetails = (instructor: InstructorAdmin) => {
    setSelectedInstructor(instructor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInstructor(null);
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Instructor Dashboard</h1>
      <p className="mb-2">Welcome, {user?.user_name || 'Admin'}</p>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {instructors.length === 0 ? (
        <p>No instructors found.</p>
      ) : (
        <Table aria-label="Instructors Table">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Profile Image</TableColumn>
            <TableColumn>Gender</TableColumn>
            <TableColumn>Phone</TableColumn>
            <TableColumn>Created At</TableColumn>
            <TableColumn>Updated At</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {instructors.map((instructor) => (
              <TableRow key={instructor.id}>
                <TableCell>{instructor.id}</TableCell>
                <TableCell>{instructor.name}</TableCell>
                <TableCell>{instructor.email}</TableCell>
                <TableCell>
                  {instructor.profile_img ? (
                    <img
                      src={instructor.profile_img}
                      alt={`${instructor.name}'s profile`}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>{instructor.gender || 'N/A'}</TableCell>
                <TableCell>{instructor.phone_number || 'N/A'}</TableCell>
                <TableCell>{parseBackendDate(instructor.created_at)}</TableCell>
                <TableCell>{parseBackendDate(instructor.updated_at)}</TableCell>
                <TableCell>
                  <Button
                    variant="bordered"
                    color="primary"
                    size="sm"
                    onClick={() => handleViewDetails(instructor)}
                    className="mr-2"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent>
          <ModalHeader>Instructor Details</ModalHeader>
          <ModalBody>
            {selectedInstructor && (
              <div className="space-y-4 dark:text-white">
                <p><strong>ID:</strong> {selectedInstructor.id}</p>
                <p><strong>Firebase UID:</strong> {selectedInstructor.firebase_uid || 'N/A'}</p>
                <p><strong>Name:</strong> {selectedInstructor.name}</p>
                <p><strong>Email:</strong> {selectedInstructor.email}</p>
                <p><strong>Gender:</strong> {selectedInstructor.gender || 'N/A'}</p>
                <p><strong>Address:</strong> {selectedInstructor.address || 'N/A'}</p>
                <p><strong>Phone Number:</strong> {selectedInstructor.phone_number || 'N/A'}</p>
                <p><strong>Profile Image:</strong>
                  {selectedInstructor.profile_img ? (
                    <a
                      href={selectedInstructor.profile_img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    'N/A'
                  )}
                </p>
                <p><strong>Created At:</strong> {parseBackendDate(selectedInstructor.created_at)}</p>
                <p><strong>Updated At:</strong> {parseBackendDate(selectedInstructor.updated_at)}</p>
                <div>
                  <strong>Description:</strong>
                  <div className="ml-4 space-y-2">
                    <p><strong>Specialty:</strong> {selectedInstructor.description.specialty || 'N/A'}</p>
                    <p><strong>Styles:</strong> {selectedInstructor.description.styles || 'N/A'}</p>
                    <p><strong>Certifications:</strong> {selectedInstructor.description.certification || 'N/A'}</p>
                    <p><strong>Experience (years):</strong> {selectedInstructor.description.experience || 'N/A'}</p>
                    <p><strong>Bio:</strong> {selectedInstructor.description.bio || 'N/A'}</p>
                    <p><strong>Specializations:</strong>{' '}
                      {selectedInstructor.description.specializations?.map((s) => s.title).join(', ') || 'N/A'}
                    </p>
                    <p><strong>Contact Hours:</strong> {selectedInstructor.description.contactHours || 'N/A'}</p>
                    <p><strong>Schedule:</strong>
                      {Object.entries(selectedInstructor.description.schedule || {}).map(([day, slots]) => (
                        <div key={day}>
                          <strong>{day}:</strong>{' '}
                          {slots.map((slot) => `${slot.startTime}-${slot.endTime}`).join(', ')}
                        </div>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="bordered" onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default withLayout(AdminInstructor, LayoutType.Admin);