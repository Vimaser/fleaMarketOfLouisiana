import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import '../firebaseConfig';
// import "./css/CreateEvents.css"; I need to add this!

const CreateEvents = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [endTime, setEndTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const db = getFirestore();
    const newEvent = {
      title, description, date, time, endTime, location, image, link
    };
    try {
      await addDoc(collection(db, 'events'), newEvent);
      alert('Event created successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setEndTime('');
      setLocation('');
      setImage('');
      setLink('');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to create event.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input 
            type="text"
            value={title} 
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input 
            type="date"
            value={date} 
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Time:</label>
          <input 
            type="time"
            value={time} 
            onChange={e => setTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Time:</label>
          <input 
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
          />
        </div>
        <div>
          <label>Location:</label>
          <input 
            type="text"
            value={location} 
            onChange={e => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input 
            type="text"
            value={image} 
            onChange={e => setImage(e.target.value)}
          />
        </div>
        <div>
          <label>Link (optional):</label>
          <input 
            type="url"
            value={link} 
            onChange={e => setLink(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}

export default CreateEvents;
