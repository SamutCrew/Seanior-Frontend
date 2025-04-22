import { Toast } from "@/components/Responseback/Toast";
import axios from "axios";
import { getAuthToken } from "@/context/authToken";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let retryCount = 0;

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    retryCount = 0;
    return response;
  },
  async (error) => {
    retryCount++;
    console.error("API error details:", {
      message: error.message,
      config: error.config,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (retryCount <= 2) {
      const errorMsg = "Request failed. Retrying...";

      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Retrying request (${retryCount}/3)`);
      return apiClient.request(error.config); // Retry the request
    } else {
      const errorMsg =
        error.response?.data?.message || "An unexpected error occurred.";
      retryCount = 0;
      // Toast.error("Retry . . .");
      return Promise.reject(error);
    }
  }
);

export default apiClient;