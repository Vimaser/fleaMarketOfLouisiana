import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "../firebaseConfig";

const VendorPage = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { vendorID } = useParams();
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      const vendorRef = doc(db, "Vendors", vendorID);
      const vendorSnap = await getDoc(vendorRef);

      if (vendorSnap.exists()) {
        setVendor(vendorSnap.data());
      } else {
        console.log("No such vendor!");
      }
      setLoading(false);
    };

    fetchData();
  }, [vendorID, db]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="vendor-page-container">
      {vendor && (
        <>
          <h2>{vendor.name}</h2>
          <p>{vendor.description}</p>
          <p>Location in Market: {vendor.locationInMarket}</p>
          <p>Product Categories: {vendor.productCategories}</p>
          {vendor.images && (
            <img
              src={vendor.images}
              alt={`Vendor ${vendor.name}`}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          )}
          {/* Additional vendor details can be added here if needed */}
        </>
      )}
    </div>
  );
};

export default VendorPage;
