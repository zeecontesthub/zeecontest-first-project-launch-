import React, { createContext, useContext, useState, useEffect } from 'react';

// Notification types
export const NOTIFICATION_TYPES = {
  HIGHLIGHT_NEW: 'highlight_new',
  CLASH_NEW: 'clash_new',
  CLASH_POLL_UPDATE: 'clash_poll_update',
  PREDICTION_AVAILABLE: 'prediction_available',
  PREDICTION_UPDATED: 'prediction_updated',
  CONTEST_STARTED: 'contest_started',
  CONTEST_ENDED: 'contest_ended'
};

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children, contestId }) => {
  const [notifications, setNotifications] = useState([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`zee_notifications_${contestId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Filter out notifications older than 24 hours
        const now = new Date();
        const validNotifications = parsed.filter(n => {
          const notificationTime = new Date(n.timestamp);
          return (now - notificationTime) < 24 * 60 * 60 * 1000; // 24 hours
        });
        setNotifications(validNotifications);
      } catch (e) {
        console.error('Failed to parse stored notifications:', e);
      }
    }
  }, [contestId]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`zee_notifications_${contestId}`, JSON.stringify(notifications));
  }, [notifications, contestId]);

  const addNotification = (type, feature, message, data = {}) => {
    const notification = {
      id: Date.now() + Math.random(),
      type,
      feature, // 'highlights', 'zeeClash', 'zeePrediction'
      message,
      timestamp: new Date().toISOString(),
      read: false,
      data
    };

    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = (feature = null) => {
    setNotifications(prev =>
      prev.map(n => !feature || n.feature === feature ? { ...n, read: true } : n)
    );
  };

  const getUnreadCount = (feature = null) => {
    return notifications.filter(n => !n.read && (!feature || n.feature === feature)).length;
  };

  const getNotifications = (feature = null) => {
    return feature
      ? notifications.filter(n => n.feature === feature)
      : notifications;
  };

  const clearOldNotifications = () => {
    const now = new Date();
    setNotifications(prev =>
      prev.filter(n => {
        const notificationTime = new Date(n.timestamp);
        return (now - notificationTime) < 24 * 60 * 60 * 1000; // 24 hours
      })
    );
  };

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    getNotifications,
    clearOldNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
