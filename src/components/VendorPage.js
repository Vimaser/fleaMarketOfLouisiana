import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "../firebaseConfig";
import "./css/VendorPage.css";

const VendorPage = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
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

  const openModal = (imageUrl) => {
    setModalImage(imageUrl);
    setModalOpen(true);
  };

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
                  onClick={() => openModal(img)}
                  style={{ width: "150px", height: "auto", cursor: "pointer" }}
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

      {modalOpen && (
        <div className="modal" style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span className="close-modal" onClick={() => setModalOpen(false)} style={{
            position: 'absolute',
            top: '20px',
            right: '40px',
            fontSize: '30px',
            fontWeight: 'bold',
            color: 'white',
            cursor: 'pointer'
          }}>
            &times;
          </span>
          <img
            src={modalImage}
            alt="Expanded view"
            className="modal-content"
            style={{ maxWidth: '80%', maxHeight: '80%' }}
          />
        </div>
      )}
    </div>
  );
};

export default VendorPage;
