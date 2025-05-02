'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@heroui/react';
import { submitInstructorRequest, updateInstructorRequest, getInstructorRequestByUserId } from '@/api/instructor_request_api';
import { uploadProfileImage, uploadIdCard, uploadSwimmingLicense } from '@/api/resource_api';

const InstructorRequestPage = () => {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    address: '',
    profile_image: '',
    date_of_birth: '',
    education_record: '',
    id_card_url: '',
    contact_channels: { line: '', facebook: '', instagram: '' },
    swimming_instructor_license: '',
    teaching_history: '',
    additional_skills: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedIdCard, setSelectedIdCard] = useState<File | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [existingRequest, setExistingRequest] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/Login');
      return;
    }

    // Prefill form with user data
    setFormData((prev) => ({
      ...prev,
      full_name: user.name || '',
      phone_number: user.phone_number || '',
      address: user.address || '',
      profile_image: user.profile_img || '',
    }));

    setImagePreview(user.profile_img || null);

    const fetchExistingRequest = async () => {
      try {
        setLoading(true);
        const response = await getInstructorRequestByUserId(user.user_id);
        const request = response.request;
        setExistingRequest(request);

        if (request) {
          setFormData({
            full_name: request.full_name || user.name || '',
            phone_number: request.phone_number || user.phone_number || '',
            address: request.address || user.address || '',
            profile_image: request.profile_image || user.profile_img || '',
            date_of_birth: new Date(request.date_of_birth).toISOString().split('T')[0],
            education_record: request.education_record,
            id_card_url: request.id_card_url || '',
            contact_channels: request.contact_channels || { line: '', facebook: '', instagram: '' },
            swimming_instructor_license: request.swimming_instructor_license || '',
            teaching_history: request.teaching_history || '',
            additional_skills: request.additional_skills || '',
          });
          setImagePreview(request.profile_image || user.profile_img || null);
          setIdCardPreview(request.id_card_url || null);
          setLicensePreview(request.swimming_instructor_license || null);
        }
      } catch (err) {
        console.error('Error fetching existing request:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingRequest();
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChannelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contact_channels: { ...prev.contact_channels, [name]: value },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'idCard' | 'license') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'profile' && !file.type.startsWith('image/')) {
        setError('Profile image must be an image file');
        return;
      }
      if ((type === 'idCard' || type === 'license') && !['image/', 'application/pdf'].some((t) => file.type.startsWith(t))) {
        setError(`${type === 'idCard' ? 'ID card' : 'Swimming instructor license'} must be an image or PDF file`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setImagePreview(reader.result as string);
          setSelectedImage(file);
        } else if (type === 'idCard') {
          setIdCardPreview(reader.result as string);
          setSelectedIdCard(file);
        } else {
          setLicensePreview(reader.result as string);
          setSelectedLicense(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {

      // Initialize with existing values or empty strings as fallback
      let profileImageUrl = formData.profile_image || '';
      let idCardUrl = formData.id_card_url || '';
      let licenseUrl = formData.swimming_instructor_license || '';

      // Upload profile image if changed
      if (selectedImage) {
        const uploadResult = await uploadProfileImage(user.user_id, selectedImage);
        profileImageUrl = uploadResult.resource_url;
      }

      // Upload ID card if changed
      if (selectedIdCard) {
        const uploadResult = await uploadIdCard(user.user_id, selectedIdCard);
        idCardUrl = uploadResult.resource_url;
      }

      // Upload swimming instructor license if changed
      if (selectedLicense) {
        const uploadResult = await uploadSwimmingLicense(user.user_id, selectedLicense);
        licenseUrl = uploadResult.resource_url;
      }

      const requestData = {
        ...formData,
        profile_image: profileImageUrl,
        id_card_url: idCardUrl, // Use the updated or existing value
        swimming_instructor_license: licenseUrl, // Use the updated or existing value
      };

      console.log('Final request data:', requestData); // Debug log

      if (existingRequest && existingRequest.status === 'rejected') {
        await updateInstructorRequest(existingRequest.request_id, requestData);
        setSuccessMessage('Instructor request updated and resubmitted successfully! Waiting for admin approval.');
      } else if (!existingRequest) {
        await submitInstructorRequest(user.user_id, requestData);
        setSuccessMessage('Instructor request submitted successfully! Waiting for admin approval.');
      } else {
        setError('You already have an Instructor request. Please wait for admin review or edit if rejected.');
        return;
      }

      await refreshUser();
      const response = await getInstructorRequestByUserId(user.user_id);
      setExistingRequest(response.request);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit Instructor request');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (existingRequest && existingRequest.status !== 'rejected') {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Instructor Request Status</h1>
        <p className="text-gray-700">
          You have already submitted an Instructor request. Status: <span className="font-semibold">{existingRequest.status}</span>
        </p>
        {existingRequest.status === 'approved' && (
          <p className="text-green-500 mt-2">Congratulations! You are now an Instructor.</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {existingRequest ? 'Edit Instructor Request' : 'Submit Instructor Request'}
      </h1>

      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {existingRequest && existingRequest.status === 'rejected' && (
        <p className="text-red-500 mb-4">Rejection Reason: {existingRequest.rejection_reason}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <Input
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            className="mt-1 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <Input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="mt-1 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="mt-1 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Image</label>
          {imagePreview ? (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-full"
              />
            </div>
          ) : (
            <p className="mt-2 text-gray-500">No profile image selected</p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'profile')}
            className="mt-2 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required={!formData.profile_image}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <Input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            className="mt-1 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Education Record</label>
          <Input
            name="education_record"
            value={formData.education_record}
            onChange={handleInputChange}
            className="mt-1 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">ID Card (PDF or Image)</label>
          {idCardPreview && idCardPreview.startsWith('data:image/') ? (
            <div className="mt-2">
              <img
                src={idCardPreview}
                alt="ID Card Preview"
                className="w-32 h-32 object-cover"
              />
            </div>
          ) : (
            <p className="mt-2 text-gray-500">{idCardPreview ? 'ID card uploaded (PDF)' : 'No ID card selected'}</p>
          )}
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => handleFileChange(e, 'idCard')}
            className="mt-2 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required={!formData.id_card_url}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Channels</label>
          <div className="space-y-2 mt-1">
            <Input
              name="line"
              placeholder="Line ID"
              value={formData.contact_channels.line}
              onChange={handleContactChannelChange}
              className="w-full"
            />
            <Input
              name="facebook"
              placeholder="Facebook"
              value={formData.contact_channels.facebook}
              onChange={handleContactChannelChange}
              className="w-full"
            />
            <Input
              name="instagram"
              placeholder="Instagram"
              value={formData.contact_channels.instagram}
              onChange={handleContactChannelChange}
              className="w-full"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Swimming Instructor License (PDF or Image)</label>
          {licensePreview && licensePreview.startsWith('data:image/') ? (
            <div className="mt-2">
              <img
                src={licensePreview}
                alt="License Preview"
                className="w-32 h-32 object-cover"
              />
            </div>
          ) : (
            <p className="mt-2 text-gray-500">{licensePreview ? 'License uploaded (PDF)' : 'No license selected'}</p>
          )}
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => handleFileChange(e, 'license')}
            className="mt-2 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required={!formData.swimming_instructor_license}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Teaching History (Optional)</label>
          <Input
            name="teaching_history"
            value={formData.teaching_history}
            onChange={handleInputChange}
            className="mt-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Skills, Language, etc. (Optional)</label>
          <Input
            name="additional_skills"
            value={formData.additional_skills}
            onChange={handleInputChange}
            className="mt-1 w-full"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {existingRequest ? 'Edit and Resubmit' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstructorRequestPage;