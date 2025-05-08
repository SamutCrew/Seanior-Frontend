import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getNotificationsByUserId, markNotificationAsRead } from '@/api';
import { Bell } from "lucide-react";
import { Notification } from '@/types';
import { useRouter } from 'next/navigation';

const NotificationPanel: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getNotificationsByUserId(user.user_id) as { notifications: Notification[] } | Notification[];
        console.log('Fetched notifications:', data);
        setNotifications(Array.isArray(data) ? data : data.notifications || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch notifications');
        console.error(err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notification_id === notificationId
            ? { ...notif, is_read: true }
            : notif,
        ),
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Redirect based on user role
    const redirectPath = user?.user_type === 'admin' ? '/admin/instructor-request' : '/become-instructor';
    router.push(redirectPath);
    // Optionally mark as read on click
    if (!notification.is_read) {
      handleMarkAsRead(notification.notification_id);
    }
    setIsOpen(false); // Close dropdown after click
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  if (!user) return null;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={toggleDropdown}
        className="p-2 mt-1"
        aria-label="Toggle notifications"
      >
        <Bell className="h-6 w-6 text-gray-700 dark:text-white" />
        {!loading && notifications.some((n) => !n.is_read) && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            {notifications.filter((n) => !n.is_read).length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Notifications
              </h2>
              <button
                onClick={toggleDropdown}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                ✕
              </button>
            </div>
            {loading && <p className="text-gray-600 dark:text-gray-300">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && notifications.length === 0 && (
              <p className="text-gray-600 dark:text-gray-300">No notifications</p>
            )}
            <ul className="max-h-60 overflow-y-auto space-y-2">
              {notifications.map((notification) => (
                <li
                  key={notification.notification_id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-2 rounded-lg cursor-pointer ${
                    notification.is_read
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'bg-blue-100 dark:bg-blue-900'
                  }`}
                >
                  <p className="text-gray-800 dark:text-gray-200">
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                  {!notification.is_read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the li onClick from firing
                        handleMarkAsRead(notification.notification_id);
                      }}
                      className="mt-1 text-blue-500 hover:underline text-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;