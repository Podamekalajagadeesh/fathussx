import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import PropTypes from 'prop-types';

const Notification = ({ notification }) => {
  const { markAsRead } = useNotifications();

  const handleMarkAsRead = () => {
    markAsRead(notification.id);
  };

  return (
    <div className={`notification ${notification.is_read ? 'read' : 'unread'}`}>
      <Link to={notification.link || '#'} className="notification-link">
        <p>{notification.message}</p>
        <small>{new Date(notification.created_at).toLocaleString()}</small>
      </Link>
      {!notification.is_read && (
        <button onClick={handleMarkAsRead} className="mark-as-read-btn">
          Mark as Read
        </button>
      )}
    </div>
  );
};

Notification.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    link: PropTypes.string,
    is_read: PropTypes.bool.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
};

export default Notification;