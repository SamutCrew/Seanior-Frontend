// admin_api.ts

import apiClient from "@/api/api_client";
import { APIEndpoints } from "@/constants/apiEndpoints";
import { getAuthToken } from "@/context/authToken";

  // List of public endpoints that don't require authentication
const publicEndpoints = [
  "/instructors", // Instructor endpoints
  "/courses",     // Course endpoints
  "/instructors/all",
  "/courses/all",
  "/users/retrieve/getAllInstructors",
  "/about",
  "/users/retrieve/",
]

// Add request interceptor for logging and auth handling
apiClient.interceptors.request.use(
  async (config) => {
    try {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      })

      const isPublicEndpoint = publicEndpoints.some((endpoint) =>
        config.url?.includes(endpoint)
      )

      if (!isPublicEndpoint) {
        try {
          const token = await getAuthToken()
          if (token) {
            config.headers["Authorization"] = `Bearer ${token}`
          }
        } catch (tokenError) {
          console.warn("No auth token available or error retrieving token:", tokenError)
          // Continue without auth header
        }
      }

      return config
    } catch (error) {
      console.error("Request preparation error:", error)
      return Promise.reject(error)
    }
  },
  (error) => {
    console.error("API request error:", error)
    return Promise.reject(error)
  },
)

export const getAllUsers = async () => {
  const url = APIEndpoints.USER.RETRIEVE.ALL;

  try {
    const token = await getAuthToken();

    if (!token) {
      throw new Error("Authentication token not found. Please log in again.");
    }

    const response = await apiClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
