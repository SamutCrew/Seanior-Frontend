// user_api.ts
import apiClient from "@/api/api_client";
import { getAuthToken } from "@/context/authToken";
import { UserCreate } from "@/types/model/user"
import { APIEndpoints } from "@/constants/apiEndpoints";

export const checkAlreadyHaveUserInDb = async (firebase_uid: string) => {
  const url = APIEndpoints.USER.RETRIEVE.CHECK_ISEXIST;
  try {
    const response = await apiClient.post(url, { firebase_uid });
    const data = response.data;
    console.log('Raw checkUser response:', { status: response.status, data });
    if (data === null || data === undefined) {
      console.log('User not found in DB, returning null');
      return null;
    }
    if (!data.firebase_uid) {
      console.warn('Unexpected response from checkUser API:', data);
      return null;
    }
    return data;
  } catch (error: any) {
    console.error('Error checking user existence:', {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    });
    if (error.response && error.response.status === 404) {
      console.log('User not found in DB, returning null');
      return null; // Handle 404 as "not found"
    }
    throw error;
  }
};

export const createUser = async (userData: UserCreate) => {
    const url = APIEndpoints.USER.CREATE;
    console.log('Attempting to create user with data:', userData);
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

export const getUserData = async (userId: string) => {
  const url = APIEndpoints.USER.RETRIEVE.DATA_BY_USERID.replace("[userId]", userId);
  try {
    const token = await getAuthToken();
    const response = await apiClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("User data response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user data:", {
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

export const updateUserData = async (userId: string, userData: any) => {
  const url = APIEndpoints.USER.UPDATE.USER.replace("[userId]", userId);
  try {
    const token = await getAuthToken();
    const response = await apiClient.put(url, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("User update response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating user data:", {
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