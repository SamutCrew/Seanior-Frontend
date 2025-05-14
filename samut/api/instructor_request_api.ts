// instructor_request_api.ts
import apiClient from "@/api/api_client";
import { APIEndpoints } from "@/constants/apiEndpoints";

export const submitInstructorRequest = async (userId: string, requestData: any) => {
  try {
    const response = await apiClient.post(
      APIEndpoints.INSTRUCTOR_REQUEST.SUBMIT.replace("[userId]", userId),
      requestData
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting Instructor request:", error);
    throw error;
  }
};

export const updateInstructorRequest = async (requestId: string, requestData: any) => {
  try {
    const response = await apiClient.patch(
      APIEndpoints.INSTRUCTOR_REQUEST.UPDATE.replace("[requestId]", requestId),
      requestData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating Instructor request:", error);
    throw error;
  }
};

export const getAllInstructorRequests = async () => {
  try {
    const response = await apiClient.get(APIEndpoints.INSTRUCTOR_REQUEST.RETRIEVE.ALL);
    return response.data;
  } catch (error) {
    console.error("Error retrieving Instructor requests:", error);
    throw error;
  }
};

export const getInstructorRequestById = async (requestId: string) => {
  try {
    const response = await apiClient.get(
      APIEndpoints.INSTRUCTOR_REQUEST.RETRIEVE.BY_ID.replace("[requestId]", requestId)
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving Instructor request by ID:", error);
    throw error;
  }
};

export const getInstructorRequestByUserId = async (userId: string) => {
  try {
    const response = await apiClient.get(
      APIEndpoints.INSTRUCTOR_REQUEST.RETRIEVE.BY_USER_ID.replace("[userId]", userId)
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving Instructor request by user ID:", error);
    throw error;
  }
};

export const approveInstructorRequest = async (requestId: string) => {
  try {
    const response = await apiClient.patch(
      APIEndpoints.INSTRUCTOR_REQUEST.APPROVE.replace("[requestId]", requestId),
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Error approving Instructor request:", error);
    throw error;
  }
};

export const rejectInstructorRequest = async (requestId: string, rejectionReason: string) => {
  try {
    const response = await apiClient.patch(
      APIEndpoints.INSTRUCTOR_REQUEST.REJECT.replace("[requestId]", requestId),
      { rejection_reason: rejectionReason }
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting Instructor request:", error);
    throw error;
  }
};

