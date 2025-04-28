// /profile/[user_id]/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { Input } from "@heroui/react";
import { getUserData, updateUserData } from "@/api/user_api";
import { uploadProfileImage } from "@/api"
import { User } from '@/types/model/user';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const { user_id } = useParams();
  const router = useRouter();

  const [userData, setUserData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For image preview
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // For the selected image file

  const isOwnProfile = user?.user_id && user.user_id === user_id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getUserData(user_id as string);
        setUserData(data);
        setFormData(data);
        setImagePreview(data.profile_img || null); // Set initial image preview
        setError(null);
      } catch (err: any) {
        if (err.response?.status === 404) {
          notFound();
        } else if (err.response?.status === 401) {
          setError('Please log in to view this profile');
          router.push('/auth/Login');
        } else {
          setError('Failed to load user profile');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!user_id) {
      notFound();
    } else {
      fetchUserData();
    }
  }, [user_id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccessMessage(null);

      let updatedProfileImg = userData?.profile_img;

      // Upload new profile image if selected
      if (selectedImage) {
        const uploadResult = await uploadProfileImage(user_id as string, selectedImage);
        updatedProfileImg = uploadResult.resource_url;
      }

      // Update user profile with new data and profile image URL
      const updatedData = await updateUserData(user_id as string, {
        ...formData,
        profile_img: updatedProfileImg,
      });

      setUserData(updatedData);
      await refreshUser();
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setSelectedImage(null); // Reset selected image
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
      console.error(err);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setFormData(userData || {});
    setImagePreview(userData?.profile_img || null); // Reset image preview
    setSelectedImage(null); // Reset selected image
    setError(null);
    setSuccessMessage(null);
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!userData) {
    return <div className="p-4 text-red-500">{error || 'User not found'}</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>

      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      {isEditing && isOwnProfile ? (
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <p className="mt-2 text-gray-500">No profile image</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              className="mt-1 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              className="mt-1 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <Input
              name="gender"
              value={formData.gender || ''}
              onChange={handleInputChange}
              className="mt-1 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <Input
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              className="mt-1 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <Input
              name="phone_number"
              value={formData.phone_number || ''}
              onChange={handleInputChange}
              className="mt-1 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Input
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              className="mt-1 w-full"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={toggleEditMode}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Image</label>
            {userData.profile_img ? (
              <img
                src={userData.profile_img}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full mt-2"
              />
            ) : (
              <p className="mt-2 text-gray-500">No profile image</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{userData.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-gray-900">{userData.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <p className="mt-1 text-gray-900">{userData.gender || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <p className="mt-1 text-gray-900">{userData.address || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <p className="mt-1 text-gray-900">{userData.phone_number || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <p className="mt-1 text-gray-900">{userData.description || 'Not specified'}</p>
          </div>

          {isOwnProfile && (
            <button
              onClick={toggleEditMode}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;