import { useState, useEffect } from 'react';
import api from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/api/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications.');
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkRead = async () => {
    try {
      await api.post('/api/notifications/mark-read');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed to mark notifications as read.');
    }
  };

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      <button onClick={handleMarkRead}>Mark all as read</button>
      <div className="notification-list">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}>
            <p>{notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;