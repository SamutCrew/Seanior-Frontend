// notification_api.ts
import apiClient from "@/api/api_client";
import { APIEndpoints } from "@/constants/apiEndpoints";
import { Notification } from "@/types";

export const getNotificationsByUserId = async (userId: string): Promise<Notification[]> => {
  try {
    const response = await apiClient.get<Notification[]>(
      APIEndpoints.NOTIFICATION.RETRIEVE.BY_USER_ID.replace("[userId]", userId)
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving notifications by user ID:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await apiClient.patch(
      APIEndpoints.NOTIFICATION.UPDATE.READ.replace("[notificationId]", notificationId)
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};


