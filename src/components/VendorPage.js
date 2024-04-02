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
      setLoading(true);
      try {
        const vendorRef = doc(db, "Vendors", vendorID);
        const vendorSnap = await getDoc(vendorRef);

        if (vendorSnap.exists()) {
          setVendor(vendorSnap.data());
        } else {
          console.log("No such vendor!");
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      } finally {
        setLoading(false);
      }
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
            <div className="vendor-images">
              {vendor.images.split(", ").map((img, index) => (
                <img
                  key={index}
                  className="vendor-image"
                  src={img}
                  alt={`Vendor content ${index + 1}`}
                />
              ))}
            </div>
          )}
          <p className="vendor-location">
            Location in Market: {vendor.locationInMarket}
          </p>
          <p className="vendor-categories">
            Product Categories: {vendor.productCategories}
          </p>
          {vendor.facebookUrl && (
            <iframe
              src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(vendor.facebookUrl)}&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
              width="340"
              height="500"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title="Vendor's Facebook Page"
            ></iframe>
          )}
          {vendor.facebookUrl && (
            <p className="facebook-link">
              Visit Us on Facebook: <a href={vendor.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a>
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default VendorPage;
