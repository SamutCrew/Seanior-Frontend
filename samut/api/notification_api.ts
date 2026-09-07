// notification_api.ts
import apiClient from "@/api/api_client";
import { APIEndpoints } from "@/constants/apiEndpoints";
import { Notification } from "@/types";
import { isDemoMode } from "@/lib/demoMode";
import * as demoStore from "@/mocks/store";

export const getNotificationsByUserId = async (userId: string): Promise<Notification[]> => {
  if (isDemoMode) {
    return demoStore.listNotificationsForUser(userId) as unknown as Notification[]
  }
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
  if (isDemoMode) {
    demoStore.markNotificationReadById(notificationId)
    return
  }
  try {
    await apiClient.patch(
      APIEndpoints.NOTIFICATION.UPDATE.READ.replace("[notificationId]", notificationId)
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};


