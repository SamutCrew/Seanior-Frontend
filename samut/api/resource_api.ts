// src/api/resource_api.ts
import apiClient from "@/api/api_client"
import { APIEndpoints } from "@/constants/apiEndpoints"

// Get all resources for a user
export const getUserResources = async (userId: string) => {
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
  const url = APIEndpoints.RESOURCE.RETRIEVE.ALL;
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: any) {
    console.error("getAllResources error:", error.message);
    return error.message;
  }
};