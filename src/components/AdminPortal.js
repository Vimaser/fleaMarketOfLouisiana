import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AdminPortal = () => {
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Function to fetch vendors from Firestore
    const fetchVendors = async () => {
      try {
        const db = getFirestore();
        const vendorsSnapshot = await getDocs(collection(db, "Vendors"));
        setVendors(
          vendorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // Authenticate and get the user role
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch user role from Firestore
        const db = getFirestore();
        getDoc(doc(db, "Vendors", user.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            setUserRole(docSnap.data().role);
          }
          fetchVendors(); // Call fetchVendors after setting user role
        });
      } else {
        // Handle scenario when user is not logged in
        setUserRole(null);
        setLoading(false);
      }
    });
  }, []);

  const handleDelete = async (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        // Delete from Firestore
        const db = getFirestore();
        await deleteDoc(doc(db, "Vendors", vendorId));

        // Update the local state to reflect the change
        setVendors(vendors.filter((vendor) => vendor.id !== vendorId));
      } catch (err) {
        console.error("Error deleting vendor: ", err);
      }
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const name = vendor.name || ""; // Default to empty string if undefined
    const lotNum = vendor.lotNum || ""; // Default to empty string if undefined
    const query = searchQuery.toLowerCase();
    return (
      name.toLowerCase().includes(query) || lotNum.toLowerCase().includes(query)
    );
  });

  if (userRole !== "Admin") {
    return <div>Access Denied: You must be an admin to view this page.</div>;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search by Name or Lot Number"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {filteredVendors.map((vendor) => (
            <li key={vendor.id}>
              <Link to={`/vendor/${vendor.id}`}>{vendor.name}</Link>
              <button onClick={() => handleDelete(vendor.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPortal;
