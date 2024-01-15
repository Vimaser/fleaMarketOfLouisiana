import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../firebaseConfig';
import "./css/darkMode.css";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const db = getFirestore();
      const messagesCollection = collection(db, "messages");
      const messagesSnapshot = await getDocs(messagesCollection);
      setMessages(messagesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user role from Firestore
        const userRef = doc(getFirestore(), "Vendors", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    });

    fetchMessages();
  }, []);


  if (userRole !== 'Admin') {
    return null;
  }

  return (
    <div className="messages">
      <h2>Messages</h2>
      {messages.length === 0 ? (
        <p>No messages to display</p>
      ) : (
        <ul>
          {messages.map(message => (
            <li key={message.id}>
              <strong>Name:</strong> {message.name}<br />
              <strong>Email:</strong> {message.email}<br />
              <strong>Phone Number:</strong> {message.phoneNumber}<br />
              <strong>TimeSent:</strong> {message.timestamp ? new Date(message.timestamp.seconds * 1000).toLocaleString() : 'N/A'}<br />
              <strong>Message:</strong> {message.message}<br />
              <Link to={`/deletemessages/${message.id}`}>Delete</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Messages;