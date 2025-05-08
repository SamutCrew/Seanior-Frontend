// src/api/course_api.ts

import apiClient from "@/api/api_client";
import { APIEndpoints } from "@/constants/apiEndpoints";
import { Course } from '@/types/course'


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
  const url = `${APIEndpoints.COURSE.UPDATE}/${courseId}`;
  try {
    const response = await apiClient.put(url, updatedData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating course:", error);
    throw error;
  }
};

  
  export const deleteCourse = async (courseId: string) => {
    const url = `${APIEndpoints.COURSE.DELETE}/${courseId}`;
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
  
