import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useUserRole from "./useUserRole";
import "../firebaseConfig";
import "./css/Vendor.css";

const Vendor = () => {
  const [vendor, setVendor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const { vendorID } = useParams();
  const db = getFirestore();
  const userRole = useUserRole();
  const auth = getAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contactInformation, setContactInformation] = useState("");
  const [locationInMarket, setLocationInMarket] = useState("");
  const [productCategories, setProductCategories] = useState("");
  const [images, setImages] = useState("");
  const [avatar, setAvatar] = useState("");
  const [lotNum, setLotNum] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const vendorRef = doc(db, "Vendors", vendorID);
      const vendorSnap = await getDoc(vendorRef);

      if (vendorSnap.exists()) {
        const vendorData = vendorSnap.data();
        setVendor(vendorData);
        setName(vendorData.name);
        setDescription(vendorData.description);
        setContactInformation(vendorData.contactInformation);
        setLocationInMarket(vendorData.locationInMarket);
        setProductCategories(vendorData.productCategories);
        setImages(vendorData.images);
        setAvatar(vendorData.avatar || "");
        setLotNum(vendorData.lotNum || "");
        setFacebookUrl(vendorData.facebookUrl || "");
      } else {
        console.log("No such vendor!");
      }
      setLoading(false);
    };

    fetchData();
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, [vendorID, db, auth]);

  const handleImageUpload = async () => {
    if (imageFiles.length === 0) {
      alert("Please select images to upload.");
      return;
    }

    if (imageFiles.length > 6) {
      alert("You can only upload up to 6 images.");
      return;
    }

    const storage = getStorage();
    const imageUrls = [];

    for (const file of imageFiles) {
      const imageRef = ref(storage, `vendor-images/${vendorID}/${file.name}`);
      try {
        const uploadTaskSnapshot = await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
        imageUrls.push(downloadURL);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert(`Failed to upload image: ${file.name}`);
      }
    }

    // Update Firestore with new image URLs
    const vendorRef = doc(getFirestore(), "Vendors", vendorID);
    await updateDoc(vendorRef, { images: imageUrls.join(", ") });

    alert("Images uploaded successfully!");
    setImages(imageUrls.join(", "));
    setImageFiles([]); // Clear the selected files
  };

  const handleFileChange = (event) => {
    setImageFiles(Array.from(event.target.files).slice(0, 6));
  };

  const updateVendor = async (e) => {
    e.preventDefault();
    if (currentUser && (currentUser.uid === vendorID || userRole === "Admin")) {
      const vendorRef = doc(db, "Vendors", vendorID);
      const updatedData = {
        name,
        description,
        contactInformation,
        locationInMarket,
        productCategories,
        images,
        avatar,
        lotNum,
        facebookUrl,
      };
      await updateDoc(vendorRef, updatedData);
      setVendor(updatedData);
      setEditMode(false);
    } else {
      console.log("Unauthorized edit attempt");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="vendor-container">
      {vendor && !editMode ? (
        <>
          <div className="vendor-profile">
            <h2 className="vendor-name">{vendor.name}</h2>
            {vendor.avatar && (
              <p className="vendor-avatar">
                <img src={vendor.avatar} alt="Avatar" />
              </p>
            )}
            <p className="vendor-description">{vendor.description}</p>
            <p className="vendor-contact">
              Contact Info: {vendor.contactInformation}
            </p>
            <p className="vendor-location">
              Location: {vendor.locationInMarket}
            </p>
            <p className="vendor-categories">
              Categories: {vendor.productCategories}
            </p>
            {vendor.images && (
              <div className="vendor-images">
                {vendor.images.split(", ").map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Vendor content ${index + 1}`}
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      marginRight: "10px",
                    }}
                  />
                ))}
              </div>
            )}
            <p className="vendor-lot-number">Lot Number: {vendor.lotNum}</p>
            {vendor.facebookUrl && (
              <p className="vendor-facebook-url">
                <a
                  href={vendor.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {vendor.facebookUrl}
                </a>
              </p>
            )}
            <p className="vendor-page-link">
              <Link to={`/vendorpage/${vendorID}`}>View My Vendor Page</Link>
            </p>
            {(currentUser?.uid === vendorID || userRole === "Admin") && (
              <button
                onClick={() => setEditMode(true)}
                className="edit-vendor-button"
              >
                Edit Profile
              </button>
            )}
          </div>
        </>
      ) : (
        <form onSubmit={updateVendor} className="edit-vendor-form">
          {/* Form fields for editing vendor information */}
          <label className="vendor-label">
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="vendor-input"
            />
          </label>
          <label className="vendor-label">
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="vendor-textarea"
            />
          </label>
          <label className="vendor-label">
            Contact Information:
            <input
              type="text"
              value={contactInformation}
              onChange={(e) => setContactInformation(e.target.value)}
              className="vendor-input"
            />
          </label>
          <label className="vendor-label">
            Location in Market:
            <input
              type="text"
              value={locationInMarket}
              onChange={(e) => setLocationInMarket(e.target.value)}
              className="vendor-input"
            />
          </label>
          <label className="vendor-label">
            Product Categories:
            <input
              type="text"
              value={productCategories}
              onChange={(e) => setProductCategories(e.target.value)}
              className="vendor-input"
            />
          </label>
          {(userRole === "Admin" || currentUser?.uid === vendorID) && (
            <>
              <label className="vendor-label">
                Images (max 6):
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="vendor-file-input"
                />
              </label>
              <button
                type="button"
                onClick={handleImageUpload}
                className="vendor-upload-button"
              >
                Upload Images
              </button>
              <div className="image-preview-container">
                {imageFiles.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="image-preview"
                  />
                ))}
              </div>
            </>
          )}
          <label className="vendor-label">
            Lot Number:
            <input
              type="text"
              value={lotNum}
              onChange={(e) => setLotNum(e.target.value)}
              className="vendor-input"
            />
          </label>
          <label className="vendor-label">
            Facebook URL:
            <input
              type="text"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="vendor-input"
            />
          </label>
          <div className="vendor-form-actions">
            <button type="submit" className="vendor-save-button">
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="vendor-cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Vendor;
