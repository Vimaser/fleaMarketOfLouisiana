import React, { useState } from 'react';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import '../firebaseConfig';
// import "./css/DeleteEvents.css"; // Add your CSS if needed

const DeleteEvents = () => {
  const [eventId, setEventId] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(''); // 'success', 'failure', or ''

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const db = getFirestore();
    
    try {
      await deleteDoc(doc(db, 'events', eventId));
      setDeleteStatus('success');
      alert('Event deleted successfully!');
      setEventId('');
    } catch (error) {
      console.error('Error deleting event: ', error);
      setDeleteStatus('failure');
      alert('Failed to delete event.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Delete Event</h2>
      {deleteStatus === "success" && <p className="success">Event deleted successfully!</p>}
      {deleteStatus === "failure" && <p className="error">Failed to delete event. Please try again.</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event ID to Delete:</label>
          <input 
            type="text"
            value={eventId} 
            onChange={(e) => setEventId(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Deleting...' : 'Delete Event'}
        </button>
      </form>
    </div>
  );
};

export default DeleteEvents;
