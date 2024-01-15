import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import '../firebaseConfig';
// import "./css/CreateFAQs.css";

const CreateFAQs = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [questionID, setQuestionID] = useState('');
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, 'Vendors', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === 'Admin') {
          setUserRole('Admin');
        } else {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userRole === 'Admin') {
      setLoading(true);
      const db = getFirestore();
      const newFAQ = {
        questionID,
        question,      
        answer
      };
      try {
        await addDoc(collection(db, 'FAQs'), newFAQ);
        alert('FAQ added successfully!');
        setQuestionID('');
        setQuestion('');      
        setAnswer('');
      } catch (error) {
        console.error('Error adding document: ', error);
        alert('Failed to add FAQ.');
      }
      setLoading(false);
    } else {
      alert('You are not authorized to add FAQs.');
    }
  };

  if (userRole !== 'Admin') {
    return null; // Or some other indication that the user is not authorized
  }


  return (
    <div>
      <h2>Add New FAQ</h2>
      <form onSubmit={handleSubmit}>
      <div>
          <label>Question Number:</label>
          <input 
            type="text"
            value={questionID} 
            onChange={e => setQuestionID(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Question:</label>
          <input 
            type="text"
            value={question} 
            onChange={e => setQuestion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Answer:</label>
          <textarea 
            value={answer} 
            onChange={e => setAnswer(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add FAQ'}
        </button>
      </form>
    </div>
  );
}

export default CreateFAQs;
