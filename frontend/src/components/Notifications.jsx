import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FaBell } from 'react-icons/fa';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const res = await api.get('/api/notifications');
          setNotifications(res.data);
        } catch (err) {
          console.error('Failed to fetch notifications.');
        }
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute

    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read.');
    }
  };

  return (
    <div className="notifications-container">
      <button
        className="notifications-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Notifications, ${unreadCount} unread`}
      >
        <FaBell aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="unread-count" aria-live="polite">{unreadCount}</span>
        )}
      </button>
      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
          </div>
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                    className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <p><strong>{notification.type}</strong></p>
                  <p>{notification.message}</p>
                  <span className="notification-time">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-notifications">No notifications yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;