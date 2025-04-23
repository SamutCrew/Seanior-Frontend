// user_api.ts

import apiClient from "@/api/api_client";
import { getAuthToken } from "@/context/authToken";
import { UserCreate } from "@/types/model/user"
import { APIEndpoints } from "@/constants/apiEndpoints";

export const checkAlreadyHaveUserInDb = async (firebase_uid: string) => {
    const url = APIEndpoints.USER.RETRIEVE.CHECK_ISEXIST;
    try {
      const response = await apiClient.post(url, { firebase_uid });
      console.log("User existence check response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error checking user existence:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : null,
      });
      throw error;
    }
  };

export const createUser = async (userData: UserCreate) => {
    const url = APIEndpoints.USER.CREATE;
    try {
      const response = await apiClient.post(url, userData);
      console.log("User creation response:", response.data);
      return response.data;
    } catch (error : any) {
      console.error("Error creating user:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : null,
      });
      throw error; // Rethrow to let AuthContext handle it
    }
  };
 
export const verifyUserToken = async (): Promise<boolean> => {
    const url = APIEndpoints.AUTH.VERIFY_TOKEN;
    try {
        const token = await getAuthToken();
        const response = await apiClient.post(url, { token });
        console.log("Token verification response:", response.data);
        return response.status === 201;
    } catch (error) {
        console.error("Error verifying token:", error);
        return false;
    }
} 