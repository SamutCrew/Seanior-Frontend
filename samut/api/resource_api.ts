// resource_api.ts
import apiClient from "@/api/api_client";
import { APIEndpoints } from "@/constants/apiEndpoints";
import { Resource } from "@/types";
import { getAuthToken } from "@/context/authToken";

export const uploadResource = async (
  userId: string,
  file: File,
): Promise<Resource> => {
  const formData = new FormData();
  try {
    formData.append("userId", userId);
    formData.append("file", file);

    const token = await getAuthToken();

    const response = await apiClient.post<Resource>(
      APIEndpoints.RESOURCE.CREATE.UPLOAD.replace("[userId]", userId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading the resource:", error);
    throw error;
  }
};

export const uploadProfileImage = async (
  userId: string,
  file: File,
): Promise<Resource> => {
  const formData = new FormData();
  try {
    formData.append("file", file);

    const token = await getAuthToken();

    const response = await apiClient.post<Resource>(
      APIEndpoints.RESOURCE.CREATE.UPLOAD_PROFILE_IMAGE.replace("[userId]", userId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading the profile image:", error);
    throw error;
  }
};

export const uploadIdCard = async (
  userId: string,
  file: File,
): Promise<Resource> => {
  const formData = new FormData();
  try {
    formData.append("file", file);

    const token = await getAuthToken();

    const response = await apiClient.post<Resource>(
      APIEndpoints.RESOURCE.CREATE.UPLOAD_ID_CARD.replace("[userId]", userId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading the ID card:", error);
    throw error;
  }
};

export const uploadSwimmingLicense = async (
  userId: string,
  file: File,
): Promise<Resource> => {
  const formData = new FormData();
  try {
    formData.append("file", file);

    const token = await getAuthToken();

    const response = await apiClient.post<Resource>(
      APIEndpoints.RESOURCE.CREATE.UPLOAD_SWIMMING_LICENSE.replace("[userId]", userId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading the swimming license:", error);
    throw error;
  }
};

export const getAllResources = async () => {
  const url = APIEndpoints.RESOURCE.RETRIEVE.ALL;
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: any) {
    console.error("getAllResources error:", error.message);
    return error.message;
  }
};

export const getResourceByuserId = async (userId: string) => {
  const url = APIEndpoints.RESOURCE.RETRIEVE.ALL_BY_USERID.replace("[userId]", userId);
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: any) {
    console.error("getResourceByuserId error:", error.message);
    return error.message;
  }
};

export const deleteResource = async (userId: string) => {
  const url = APIEndpoints.RESOURCE.DELETE.replace("[userId]", userId);
  try {
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error: any) {
    console.error("deleteResource error:", error.message);
    return error.message;
  }
};