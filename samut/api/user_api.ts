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
    } catch (error) {
        console.error("Error checking user existence:", error);

        return null;
    }
}

export const createUser = async ( userData: UserCreate) => {
    const url = APIEndpoints.USER.CREATE;
    try {
        const response = await apiClient.post(url, userData);
        console.log("User creation response:", response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error creating user:", error);
        return null;
    }
}
 
export const verifyUserToken = async (): Promise<boolean> => {
    const url = APIEndpoints.AUTH.VERIFY_TOKEN;
    try {
        const token = await getAuthToken();
        const response = await apiClient.post(url, { token });
        console.log("response.status", response.status);
        console.log("response.data", response.data);

        return response.status === 200;
    } catch (error) {
        console.error("Error verifying token:", error);
        return false;
    }
} 