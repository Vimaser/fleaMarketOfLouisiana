import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, orderBy, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../firebaseConfig';
// import "./css/FAQs.css";

const FAQs = () => {
  const [faqs, setFAQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  console.log("Netlify's ESlint is a pain in the butt", isLoggedIn); 

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const faqsQuery = query(collection(db, 'FAQs'), orderBy('questionID'));
      const data = await getDocs(faqsQuery);
      setFAQs(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoggedIn(!!user);
      // ^^^ ESLint may not detect the usage of isLoggedIn here
      if (user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "Vendors", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        setUserRole(null);
      }
    });

    fetchData();

    return () => unsubscribe();
  }, []);

  const deleteFAQ = async (id) => {
    if (userRole === 'Admin') {
      const db = getFirestore();
      await deleteDoc(doc(db, 'FAQs', id));
      setFAQs(faqs.filter(faq => faq.id !== id));
    } else {
      // Optionally handle unauthorized attempt to delete
      console.log('Unauthorized delete attempt');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="faqs-container">
      <h2>Frequently Asked Questions</h2>
      {userRole === 'Admin' && (
        <Link className="create-link" to="/CreateFAQs">Create FAQs</Link>
      )}
      {faqs.map(faq => (
        <div key={faq.id} className="faq">
          <h3>{faq.questionID} {faq.question}</h3>
          <p>{faq.answer}</p>
          {userRole === 'Admin' && (
            <button onClick={() => deleteFAQ(faq.id)}>Delete</button>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
}

export default FAQs;
