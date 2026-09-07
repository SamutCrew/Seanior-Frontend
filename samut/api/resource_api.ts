// src/api/resource_api.ts
import apiClient from "@/api/api_client"
import { APIEndpoints } from "@/constants/apiEndpoints"
import { Resource } from "@/types";
import { getAuthToken } from "@/context/authToken";
import { isDemoMode } from "@/lib/demoMode";
import * as demoStore from "@/mocks/store";
// Get all resources for a user
export const getUserResources = async (userId: string) => {
  if (isDemoMode) {
    return demoStore.listResourcesForUser(userId)
  }
  const url = APIEndpoints.RESOURCE.RETRIEVE.ALL_BY_USERID.replace("[userId]", userId)
  try {
    const response = await apiClient.get(url)
    console.log("User resources API response:", response.data)
    return response.data
  } catch (error: any) {
    console.error("Error fetching user resources:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    })
    throw error
  }
}

// Upload a resource
export const uploadResource = async (userId: string, file: File) => {
  if (isDemoMode) {
    return demoStore.addResourceEntry(userId, file, "resource")
  }
  const url = APIEndpoints.RESOURCE.CREATE.UPLOAD.replace("[userId]", userId)
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error: any) {
    console.error("Error uploading resource:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    })
    throw error
  }
}

// Upload profile image
export const uploadProfileImage = async (userId: string, file: File) => {
  if (isDemoMode) {
    const resource = demoStore.addResourceEntry(userId, file, "profile_image")
    demoStore.updateUserById(userId, { profile_img: resource.resource_url })
    return resource
  }
  const url = APIEndpoints.RESOURCE.CREATE.UPLOAD_PROFILE_IMAGE.replace("[userId]", userId)
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error: any) {
    console.error("Error uploading profile image:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    })
    throw error
  }
}

// Delete a resource
export const deleteResource = async (userId: string, resourceId: string) => {
  if (isDemoMode) {
    demoStore.deleteResourceEntry(resourceId)
    return { message: "deleted" }
  }
  const url = `${APIEndpoints.RESOURCE.DELETE.replace("[userId]", userId)}/${resourceId}`
  try {
    const response = await apiClient.delete(url)
    return response.data
  } catch (error: any) {
    console.error("Error deleting resource:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    })
    throw error
  }
}


export const getAllResources = async () => {
  if (isDemoMode) {
    return demoStore.listAllResources()
  }
  const url = APIEndpoints.RESOURCE.RETRIEVE.ALL;
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: any) {
    console.error("getAllResources error:", error.message);
    return error.message;
  }
};



export const uploadIdCard = async (
  userId: string,
  file: File,
): Promise<Resource> => {
  if (isDemoMode) {
    return demoStore.addResourceEntry(userId, file, "id_card") as unknown as Resource
  }
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
  if (isDemoMode) {
    return demoStore.addResourceEntry(userId, file, "swimming_license") as unknown as Resource
  }
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
