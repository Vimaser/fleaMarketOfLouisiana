import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import '../firebaseConfig';
// import "./css/Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const eventsQuery = query(collection(db, 'events'), orderBy('date', 'desc'));
      const data = await getDocs(eventsQuery);
      setEvents(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    };

    fetchData();
  }, []);
    
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="events-container">
      <h2>Upcoming Events</h2>
      {events.map(event => (
        <div key={event.id} className="event">
          <h3>{event.title}</h3>
          <img src={event.image} alt={event.title} />
          <p>{event.description}</p>
          <p>Date: {event.date}</p>
          <p>Time: {event.time}</p>
          <p>Location: {event.location}</p>
          {event.link && <a href={event.link}>More Info</a>}
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Events;
