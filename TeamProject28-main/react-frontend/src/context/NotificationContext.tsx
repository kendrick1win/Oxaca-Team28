import { createContext, useContext, useState, ReactNode } from "react";

export type Notification = {
  id: number;
  message: string;
};

type NotificationContextType = {
  notifications: Notification[];
  notification: string | null; // Add this property
  setNotification: (message: string | null) => void; // Add this property
  addNotification: (message: string) => void;
  clearNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notification, setNotification] = useState<string | null>(null); // Add this state

  // Adds a new notification object to the array
  const addNotification = (message: string) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
  };

  // Clears all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, notification, setNotification, addNotification, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};