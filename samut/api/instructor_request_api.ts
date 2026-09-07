// instructor_request_api.ts
import apiClient from "@/api/api_client";
import { APIEndpoints } from "@/constants/apiEndpoints";
import { isDemoMode } from "@/lib/demoMode";
import * as demoStore from "@/mocks/store";

export const submitInstructorRequest = async (userId: string, requestData: any) => {
  if (isDemoMode) {
    return demoStore.submitInstructorRequestEntry(userId, requestData);
  }
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
  if (isDemoMode) {
    return demoStore.updateInstructorRequestEntry(requestId, requestData);
  }
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
  if (isDemoMode) {
    return { requests: demoStore.listInstructorRequests() };
  }
  try {
    const response = await apiClient.get(APIEndpoints.INSTRUCTOR_REQUEST.RETRIEVE.ALL);
    return response.data;
  } catch (error) {
    console.error("Error retrieving Instructor requests:", error);
    throw error;
  }
};

export const getInstructorRequestById = async (requestId: string) => {
  if (isDemoMode) {
    return demoStore.getInstructorRequestById(requestId);
  }
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
  if (isDemoMode) {
    return demoStore.getInstructorRequestByUserId(userId);
  }
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
  if (isDemoMode) {
    return demoStore.approveInstructorRequestById(requestId);
  }
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
  if (isDemoMode) {
    return demoStore.rejectInstructorRequestById(requestId, rejectionReason);
  }
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

