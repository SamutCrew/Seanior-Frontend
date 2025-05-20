'use client';
import React, { useState, useEffect } from 'react';
import { getAllUsers } from '@/api';
import { useAuth } from '@/context/AuthContext';
import withLayout from '@/hocs/WithLayout';
import { LayoutType } from '@/types/layout';
import type { User } from '@/types/model/user';
import { UserType } from '@/types/model/user';
import { InstructorDescription } from '@/types/instructor'; // Import InstructorDescription
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

const AdminUser = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all'); // Filter state

  useEffect(() => {
    if (!user || user.user_type !== 'admin') {
      window.location.href = '/auth/Login';
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
        setFilteredUsers(data); // Initially, show all users
        setError(null);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Handle user type filter change
  const handleUserTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setUserTypeFilter(selectedType);

    if (selectedType === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((u) => u.user_type === selectedType));
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <p className="mb-2">Welcome, {user?.user_name || 'Admin'}</p>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Filter by User Type */}
      <div className="mb-4">
        <label htmlFor="userTypeFilter" className="mr-2 font-medium">
          Filter by User Type:
        </label>
        <select
          id="userTypeFilter"
          value={userTypeFilter}
          onChange={handleUserTypeFilterChange}
          className="border rounded p-2"
        >
          <option value="all">All</option>
          <option value={UserType.USER}>User</option>
          <option value={UserType.INSTRUCTOR}>Instructor</option>
          <option value={UserType.admin}>Admin</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <Table aria-label="Users Table">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Profile Image</TableColumn>
            <TableColumn>Gender</TableColumn>
            <TableColumn>Phone</TableColumn>
            <TableColumn>User Type</TableColumn>
            <TableColumn>Created At</TableColumn>
            <TableColumn>Updated At</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.user_id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.profile_img ? (
                    <img
                      src={user.profile_img}
                      alt={`${user.name}'s profile`}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>{user.gender || 'N/A'}</TableCell>
                <TableCell>{user.phone_number || 'N/A'}</TableCell>
                <TableCell>{user.user_type}</TableCell>
                <TableCell>{parseBackendDate(user.created_at)}</TableCell>
                <TableCell>{parseBackendDate(user.updated_at)}</TableCell>
                <TableCell>
                  <Button
                    variant="bordered"
                    color="primary"
                    size="sm"
                    onClick={() => handleViewDetails(user)}
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
          <ModalHeader>User Details</ModalHeader>
          <ModalBody>
            {selectedUser && (
              <div className="space-y-4 dark:text-white">
                <p><strong>ID:</strong> {selectedUser.user_id}</p>
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Gender:</strong> {selectedUser.gender || 'N/A'}</p>
                <p><strong>Address:</strong> {selectedUser.address || 'N/A'}</p>
                <p><strong>Phone Number:</strong> {selectedUser.phone_number || 'N/A'}</p>
                <p>
                  <strong>Profile Image:</strong>
                  {selectedUser.profile_img ? (
                    <a
                      href={selectedUser.profile_img}
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
                <p><strong>User Type:</strong> {selectedUser.user_type}</p>
                {selectedUser.user_type === UserType.INSTRUCTOR && selectedUser.description && typeof selectedUser.description === 'object' && (
                  <div>
                    <strong>Description:</strong>
                    <div className="ml-4 space-y-2">
                      <p><strong>Specialty:</strong> {(selectedUser.description as InstructorDescription).specialty || 'N/A'}</p>
                      <p><strong>Styles:</strong> {(selectedUser.description as InstructorDescription).styles || 'N/A'}</p>
                      <p><strong>Certifications:</strong> {(selectedUser.description as InstructorDescription).certification || 'N/A'}</p>
                      <p><strong>Experience (years):</strong> {(selectedUser.description as InstructorDescription).experience || 'N/A'}</p>
                      <p><strong>Bio:</strong> {(selectedUser.description as InstructorDescription).bio || 'N/A'}</p>
                      <p><strong>Specializations:</strong> {(selectedUser.description as InstructorDescription).specializations.map((s) => s.title).join(', ') || 'N/A'}</p>
                      <p><strong>Contact Hours:</strong> {(selectedUser.description as InstructorDescription).contactHours || 'N/A'}</p>
                      {/* Add other InstructorDescription fields as needed */}
                    </div>
                  </div>
                )}
                {selectedUser.user_type !== UserType.INSTRUCTOR && (
                  <p><strong>Description:</strong> {selectedUser.description as string || 'N/A'}</p>
                )}
                <p><strong>Created At:</strong> {parseBackendDate(selectedUser.created_at)}</p>
                <p><strong>Updated At:</strong> {parseBackendDate(selectedUser.updated_at)}</p>
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

export default withLayout(AdminUser, LayoutType.Admin);