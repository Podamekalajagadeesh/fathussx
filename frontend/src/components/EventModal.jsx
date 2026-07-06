import { useState } from 'react';
import './EventModal.css';
import PropTypes from 'prop-types';

const EventModal = ({ isOpen, onClose, onSave, start, end }) => {
  const [title, setTitle] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave({ title, start, end });
    setTitle('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>New Event</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

EventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  start: PropTypes.instanceOf(Date),
  end: PropTypes.instanceOf(Date),
};

export default EventModal;