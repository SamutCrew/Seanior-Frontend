import axios from "axios"
import { getAuthToken } from "@/context/authToken"

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Don't retry these status codes as they indicate client errors, not server issues
const NON_RETRYABLE_STATUS_CODES = [400, 401, 403, 404, 422]

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAuthToken()
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
      return config
    } catch (error) {
      console.error("Request preparation error:", error)
      return Promise.reject(error)
    }
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // Log detailed error information
    console.error("API error details:", {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    })

    // Don't retry if:
    // 1. We don't have a response (network error)
    // 2. The status code indicates a client error (4xx)
    // 3. We've already retried this request
    if (!error.response || NON_RETRYABLE_STATUS_CODES.includes(error.response.status) || error.config?._isRetry) {
      return Promise.reject(error)
    }

    // Mark this request as a retry to prevent infinite loops
    error.config._isRetry = true

    // Wait a bit before retrying
    console.log("Retrying request once after 1000ms delay...")
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Try one more time
    return apiClient.request(error.config)
  },
)

export default apiClient
