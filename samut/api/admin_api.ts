// admin_api.ts

import apiClient from "@/api/api_client";
import { APIEndpoints } from "@/constants/apiEndpoints";

export const getAllUsers = async () => {
    const url = APIEndpoints.USER.RETRIEVE.ALL;
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching all users:", {
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