// /app/admin/instructor-request/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import withLayout from '@/hocs/WithLayout';
import { LayoutType } from '@/types/layout';
import {
  getAllInstructorRequests,
  approveInstructorRequest,
  rejectInstructorRequest,
  getInstructorRequestById,
} from '@/api/instructor_request_api';
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
  Textarea,
} from '@heroui/react';

const InstructorRequest = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]); // Default to empty array
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.user_type !== 'admin') {
      window.location.href = '/auth/Login';
      return;
    }

    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await getAllInstructorRequests();
        console.log('API Response:', response); // Debug log
        // Handle different response structures
        if (Array.isArray(response)) {
          setRequests(response);
        } else if (response?.requests || response?.data) {
          setRequests(response.requests || response.data || []);
        } else {
          setRequests([]);
          setError('Unexpected API response format');
        }
      } catch (err) {
        setError('Failed to fetch instructor requests');
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const handleViewDetails = async (requestId: string) => {
    try {
      const response = await getInstructorRequestById(requestId);
      console.log('Request Details Response:', response); // Debug log
      setSelectedRequest(response.request || response);
      setIsModalOpen(true);
    } catch (err) {
      setError('Failed to fetch request details');
      console.error('Error fetching details:', err);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      await approveInstructorRequest(requestId);
      setRequests((prev) =>
        prev.map((req) =>
          req.request_id === requestId ? { ...req, status: 'approved' } : req
        )
      );
      setSuccessMessage('Request approved successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to approve request');
      console.error('Error approving request:', err);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!rejectionReason) {
      setError('Please provide a rejection reason');
      return;
    }
    try {
      await rejectInstructorRequest(requestId, rejectionReason);
      setRequests((prev) =>
        prev.map((req) =>
          req.request_id === requestId
            ? { ...req, status: 'rejected', rejection_reason: rejectionReason }
            : req
        )
      );
      setSuccessMessage('Request rejected successfully');
      setIsModalOpen(false);
      setRejectionReason('');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to reject request');
      console.error('Error rejecting request:', err);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Instructor Requests</h1>
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {requests.length === 0 ? (
        <p>No instructor requests found.</p>
      ) : (
        <Table aria-label="Instructor Requests Table">
          <TableHeader>
            <TableColumn>Full Name</TableColumn>
            <TableColumn>Phone Number</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.request_id}>
                <TableCell>{request.full_name}</TableCell>
                <TableCell>{request.phone_number || 'N/A'}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  <Button
                    variant="bordered"
                    color="primary"
                    size="sm"
                    onClick={() => handleViewDetails(request.request_id)}
                    className="mr-2"
                  >
                    View Details
                  </Button>
                  {request.status === 'pending' && (
                    <>
                      <Button
                        variant="solid"
                        color="success"
                        size="sm"
                        onClick={() => handleApprove(request.request_id)}
                        className="mr-2"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="solid"
                        color="danger"
                        size="sm"
                        onClick={() => handleViewDetails(request.request_id)} // Open modal to input reason
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Request Details</ModalHeader>
          <ModalBody>
            {selectedRequest && (
                <div className="space-y-4">
                <p><strong>Full Name:</strong> {selectedRequest.full_name}</p>
                <p><strong>Phone Number:</strong> {selectedRequest.phone_number || 'N/A'}</p>
                <p><strong>Address:</strong> {selectedRequest.address}</p>
                <p><strong>Date of Birth:</strong> {selectedRequest.date_of_birth}</p>
                <p><strong>Education Record:</strong> {selectedRequest.education_record}</p>
                <p><strong>Profile Image:</strong> <a href={selectedRequest.profile_image} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View</a></p>
                <p><strong>ID Card:</strong> <a href={selectedRequest.id_card_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View</a></p>
                <p><strong>Swimming License:</strong> <a href={selectedRequest.swimming_instructor_license} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View</a></p>
                <div>
                    <strong>Contact Channels:</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                    {selectedRequest.contact_channels?.line && (
                        <li>
                        <span className="font-medium">Line:</span>{' '}
                        <a
                            href={`https://line.me/ti/p/~${selectedRequest.contact_channels.line}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            {selectedRequest.contact_channels.line}
                        </a>
                        </li>
                    )}
                    {selectedRequest.contact_channels?.facebook && (
                        <li>
                        <span className="font-medium">Facebook:</span>{' '}
                        <a
                            href={`https://www.facebook.com/${selectedRequest.contact_channels.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            {selectedRequest.contact_channels.facebook}
                        </a>
                        </li>
                    )}
                    {selectedRequest.contact_channels?.instagram && (
                        <li>
                        <span className="font-medium">Instagram:</span>{' '}
                        <a
                            href={`https://www.instagram.com/${selectedRequest.contact_channels.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            {selectedRequest.contact_channels.instagram}
                        </a>
                        </li>
                    )}
                    {!selectedRequest.contact_channels?.line &&
                        !selectedRequest.contact_channels?.facebook &&
                        !selectedRequest.contact_channels?.instagram && (
                        <li>N/A</li>
                        )}
                    </ul>
                </div>
                <p><strong>Teaching History:</strong> {selectedRequest.teaching_history || 'N/A'}</p>
                <p><strong>Additional Skills:</strong> {selectedRequest.additional_skills || 'N/A'}</p>
                <p><strong>Status:</strong> {selectedRequest.status}</p>
                {selectedRequest.status === 'rejected' && (
                    <p><strong>Rejection Reason:</strong> {selectedRequest.rejection_reason}</p>
                )}
                {selectedRequest.status === 'pending' && (
                    <Textarea
                    label="Rejection Reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter rejection reason"
                    className="mt-2"
                    />
                )}
                </div>
            )}
            </ModalBody>
          <ModalFooter>
            {selectedRequest?.status === 'pending' && (
              <Button
                color="danger"
                variant="solid"
                onClick={() => handleReject(selectedRequest.request_id)}
                className="mr-2"
              >
                Reject
              </Button>
            )}
            <Button color="default" variant="bordered" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default withLayout(InstructorRequest, LayoutType.Admin);