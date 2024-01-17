import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom"; // Import Link
import "../firebaseConfig";
// import "./css/Search.css";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [vendors, setVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      const db = getFirestore();
      const vendorsRef = collection(db, "Vendors");
      try {
        const querySnapshot = await getDocs(vendorsRef);
        const fetchedVendors = [];
        querySnapshot.forEach((doc) => {
          fetchedVendors.push({ id: doc.id, ...doc.data() });
        });
        setAllVendors(fetchedVendors);
      } catch (error) {
        console.error("Error fetching vendors: ", error);
        alert("Failed to fetch vendors.");
      }
      setLoading(false);
    };

    fetchVendors();
  }, []);

  const handleSearch = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filteredVendors = allVendors.filter(vendor => 
      (vendor.name?.toLowerCase().includes(lowerCaseQuery) || 
       vendor.description?.toLowerCase().includes(lowerCaseQuery) ||
       vendor.productCategories?.toLowerCase().includes(lowerCaseQuery)) ||
      (vendor.lotNum?.toString().toLowerCase().includes(lowerCaseQuery))
    );
    setVendors(filteredVendors);
  };

  return (
    <div className="search-container">
      <h2>Search Vendor</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by lot number, products, name, and description"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {vendors.length > 0 ? (
        <div>
          {vendors.map((vendor) => (
            <div key={vendor.id} className="vendor-info">
              <Link to={`/vendorpage/${vendor.id}`}>
                <h3>{vendor.name}</h3>
              </Link>
              <p>Description: {vendor.description}</p>
              <p>Lot Number: {vendor.lotNum}</p>
              <p>Product Categories: {vendor.productCategories}</p>
              {/* Additional vendor details can be added here */}
            </div>
          ))}
        </div>
      ) : loading ? (
        <p>Searching...</p>
      ) : (
        <p>No vendors found.</p>
      )}
    </div>
  );
};

export default Search;
