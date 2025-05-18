import { getAuthToken } from "@/context/authToken"
import { APIEndpoints } from "@/constants/apiEndpoints"
import apiClient from "@/api/api_client";
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
export const createCheckoutSession = async (
  requestId: string
): Promise<CheckoutSessionResponse> => {
  const url = APIEndpoints.PAYMENT.CREATE_PROMPTPAY_SESSION;

  try {
    const token = await getAuthToken();

    if (!token) {
      throw new Error("Authentication token not found. Please log in again.");
    }

    const response = await apiClient.post(
      url,
      { requestId }, // POST body as JS object
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Axios will throw on HTTP errors unless you configured it not to.
    return response.data;
  } catch (error: any) {
    console.error('Error CheckoutSession existence:', {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    });
    throw error
  }
};
