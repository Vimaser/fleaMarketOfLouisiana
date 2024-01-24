import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "../firebaseConfig";
import "./css/VendorPage.css";

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
          <h2 className="vendor-name">{vendor.name}</h2>
          <p className="vendor-description">{vendor.description}</p>

          {vendor.images && (
            <img
              className="vendor-image"
              src={vendor.images}
              alt={`Vendor ${vendor.name}`}
            />
          )}
          <p className="vendor-location">
            Location in Market: {vendor.locationInMarket}
          </p>
          <p className="vendor-categories">
            Product Categories: {vendor.productCategories}
          </p>
          {/* Additional vendor details can be added here if needed */}
        </>
      )}
    </div>
  );
};

export default VendorPage;
