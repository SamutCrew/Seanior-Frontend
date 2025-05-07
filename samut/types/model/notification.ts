// types/model/notification.ts
export interface Notification {
    notification_id: string;
    user_id: string;
    type: string;
    message: string;
    is_read: boolean;
    related_entity_id?: string;
    created_at: string;
  }