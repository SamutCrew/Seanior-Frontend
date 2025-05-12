// src/api/course_api.ts
import apiClient from "@/api/api_client";
import { APIEndpoints } from "@/constants/apiEndpoints";
import { Course } from '@/types/course';

// Existing functions...
export const getAllCourses = async () => {
  const url = APIEndpoints.COURSE.RETRIEVE.ALL;
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching all courses:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    });
    throw error;
  }
};

export const createCourse = async (newCourseData: Course) => {
  const url = APIEndpoints.COURSE.CREATE;
  try {
    const response = await apiClient.post(url, newCourseData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating course:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    });
    throw error;
  }
};

export const updateCourse = async (courseId: string, updatedData: Partial<Course>) => {
  const url = APIEndpoints.COURSE.UPDATE.replace("[courseId]", courseId)
  try {
    const response = await apiClient.put(url, updatedData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating course:", error);
    throw error;
  }
};

export const deleteCourse = async (courseId: string) => {
  const url = APIEndpoints.COURSE.DELETE.replace("[courseId]", courseId);
  try {
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting course:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    });
    throw error;
  }
};

// New functions for image uploads
export const uploadCourseImage = async (courseId: string, file: File) => {
  const url = APIEndpoints.RESOURCE.CREATE.UPLOAD_COURSE_IMAGE.replace("[courseId]", courseId);
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error uploading course image:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    });
    throw error;
  }
};

export const uploadPoolImage = async (courseId: string, file: File) => {
  const url = APIEndpoints.RESOURCE.CREATE.UPLOAD_POOL_IMAGE.replace("[courseId]", courseId);
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error uploading pool image:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    });
    throw error;
  }
};
  
