import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../services/api';
import EventModal from '../components/EventModal';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/api/calendar/events');
        setEvents(res.data.map(event => ({
          ...event,
          start: new Date(event.start_time),
          end: new Date(event.end_time),
        })));
      } catch (err) {
        console.error('Failed to fetch events.');
      }
    };
    fetchEvents();
  }, []);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    setIsModalOpen(true);
  };

  const handleSaveEvent = async ({ title, start, end }) => {
    try {
      const res = await api.post('/api/calendar/events', { title, start, end });
      setEvents([...events, { ...res.data, start: new Date(res.data.start_time), end: new Date(res.data.end_time) }]);
    } catch (err) {
      console.error('Failed to create event.');
    }
  };

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
      />
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        start={selectedSlot?.start}
        end={selectedSlot?.end}
      />
    </div>
  );
};

export default MyCalendar;