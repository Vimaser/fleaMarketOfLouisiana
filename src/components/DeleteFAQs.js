import React, { useState, useEffect } from 'react';
import { getFirestore, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../firebaseConfig';
// import "./css/DeleteFAQs.css"; // Add your CSS if needed

const DeleteFAQs = () => {
  const [questionID, setQuestionID] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState('');
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
      try {
        await deleteDoc(doc(db, 'FAQs', questionID));
        setDeleteStatus('success');
        alert('FAQ deleted successfully!');
        setQuestionID('');
      } catch (error) {
        console.error('Error deleting document: ', error);
        setDeleteStatus('failure');
        alert('Failed to delete FAQ.');
      }
      setLoading(false);
    } else {
      alert('You are not authorized to delete FAQs.');
    }
  };

  if (userRole !== 'Admin') {
    return null; // Or some other indication that the user is not authorized
  }


  return (
    <div>
      <h2>Delete FAQ</h2>
      {deleteStatus === "success" && <p className="success">FAQ deleted successfully!</p>}
      {deleteStatus === "failure" && <p className="error">Failed to delete FAQ. Please try again.</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>FAQ ID to Delete:</label>
          <input 
            type="text"
            value={questionID} 
            onChange={(e) => setQuestionID(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Deleting...' : 'Delete FAQ'}
        </button>
      </form>
    </div>
  );
};

export default DeleteFAQs;