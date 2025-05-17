import axios from "axios"
import { getAuthToken } from "@/context/authToken"

// Create a more robust API client with better error handling
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 15000, // 15 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a list of public endpoints that don't require authentication
const publicEndpoints = [
  "/instructors", // Instructor endpoints
  "/courses", // Course endpoints
  "/instructors/all",
  "/courses/all",
  "/users/retrieve/getAllInstructors",
  "/about"
]

// Add request interceptor for logging
apiClient.interceptors.request.use(
  async (config) => {
    try {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      })

      const isPublicEndpoint = publicEndpoints.some((endpoint) => config.url && config.url.includes(endpoint))
      if (!isPublicEndpoint) {
        // Only add the authorization header for non-public endpoints
        const token = await getAuthToken()
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`
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

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response (${response.status}):`, {
      url: response.config.url,
      method: response.config.method,
      data: response.data,
    })
    return response
  },
  async (error) => {
    // Handle network errors (when no response is received)
    if (!error.response) {
      console.error("API network error:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
      })
      // Return a standardized error object
      return Promise.reject({
        message: "Network error. Please check your internet connection.",
        isNetworkError: true,
        originalError: error,
      })
    }

    // Handle API errors (when a response with error status is received)
    console.error("API error details:", {
      message: error.message,
      url: error.config.url,
      method: error.config.method,
      status: error.response.status,
      data: error.response.data,
    })

    return Promise.reject(error)
  },
)

export default apiClient
