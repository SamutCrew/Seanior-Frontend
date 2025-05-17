import { getAuthToken } from "@/context/authToken"
import { APIEndpoints } from "@/constants/apiEndpoints"

interface CheckoutSessionResponse {
  url: string
  sessionId: string
  bookingId: string
}

/**
 * Creates a checkout session for a course request
 * @param requestId The ID of the course request
 * @returns The checkout session data including URL, sessionId, and bookingId
 */
export const createCheckoutSession = async (requestId: string): Promise<CheckoutSessionResponse> => {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error("Authentication token not found. Please log in again.")
    }

    // For development/testing: Use mock data if the API endpoint is not available
    // Remove this in production or when the actual API endpoint is ready
    const useMockData = true // Set to false when the real API is available

    if (useMockData) {
      console.log("Using mock payment data for development")
      // Return mock data for testing
      return {
        url: "https://checkout.stripe.com/c/pay/cs_test_a1q8JGaza19mrdLHGBTb4F2fCLgC3Y3L8wemCJ2SnX9c6kFBuTOxGA82zu",
        sessionId: "cs_test_a1q8JGaza19mrdLHGBTb4F2fCLgC3Y3L8wemCJ2SnX9c6kFBuTOxGA82zu",
        bookingId: "cmas4umdu000gec3187vxd7ge",
      }
    }

    // Real API call
    const response = await fetch(`${APIEndpoints}/payment/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requestId }),
    })

    if (!response.ok) {
      // Try to parse error as JSON first
      let errorMessage = `Failed to create checkout session: ${response.status}`
      try {
        const errorData = await response.json()
        if (errorData.message) {
          errorMessage = errorData.message
        }
      } catch {
        // If not JSON, get text
        const errorText = await response.text()
        if (errorText && errorText.length < 100) {
          // Only use text if it's reasonably short
          errorMessage = `${errorMessage} ${errorText}`
        }
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    throw new Error(error.message || "Failed to create checkout session")
  }
}
