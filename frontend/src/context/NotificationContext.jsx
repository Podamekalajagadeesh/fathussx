/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import api from '../api';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import PropTypes from 'prop-types';

const NotificationContext = createContext();

const socket = io('http://localhost:3000');

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      // Fetch initial notifications
      api.get('/api/notifications').then(res => {
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.is_read).length);
      });

      // Join socket room
      socket.emit('join', user.id);

      // Listen for new notifications
      socket.on('new_notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });
    }

    return () => {
      if (user) {
        socket.off('new_notification');
      }
    };
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.post('/api/notifications/mark-read');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read', error);
    }
  }, [notifications]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await api.post(`/api/notifications/${notificationId}/mark-read`);
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error(`Failed to mark notification ${notificationId} as read`, error);
    }
  }, [notifications]);

  const notificationValue = useMemo(() => ({ notifications, unreadCount, markAllAsRead, markAsRead }), [notifications, unreadCount, markAllAsRead, markAsRead]);

  return (
    <NotificationContext.Provider value={notificationValue}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useNotifications = () => useContext(NotificationContext);

export { NotificationProvider, useNotifications };