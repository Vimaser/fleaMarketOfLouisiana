import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import useUserRole from "./useUserRole";
import "../firebaseConfig";
import "./css/Vendor.css";

const Vendor = () => {
  const [vendor, setVendor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
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
  //const [imageDeleted, setImageDeleted] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  // const OAuth = process.env.REACT_APP_IMGUR_CLIENT_ID;

  /*   const resetUploadState = () => {
    setImageUploaded(false);
    setImageDeleted(false);
  }; */

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

  useEffect(() => {
    if (images) {
      setImageUploaded(true);
    } else {
      setImageUploaded(false);
    }
  }, [images]);

  /*   const redirectToImgurOAuth = () => {
    const clientId = process.env.REACT_APP_IMGUR_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      "https://thefleamarketoflouisiana.com/auth-callback"
    );
    localStorage.setItem("vendorID", vendorID);
    window.location.href = `https://api.imgur.com/oauth2/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}`;
  }; */

  /*   const uploadImageToImgur = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    // Retrieve the access token from local storage
    const accessToken = localStorage.getItem("access_token");
    console.log("Access Token:", accessToken); // Log the access token to console

    try {
      const response = await fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
          Authorization: `Client-ID ${OAuth}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        return data.data.link;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  }; */

  /*   const uploadImageToFirebase = async (imageFile) => {
    if (imageFile) {
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `vendor-images/${vendorID}/${imageFile.name}`
      );

      try {
        // Upload the file and metadata to Firebase Storage
        const snapshot = await uploadBytes(storageRef, imageFile);

        // Get the download URL of the uploaded file
        const downloadURL = await getDownloadURL(snapshot.ref);
        setImages(downloadURL); // Sets the state to the URL of the uploaded image
      } catch (error) {
        console.error("Error uploading image to Firebase:", error);
      }
    }
  }; */

  const handleDeleteImage = async () => {
    if (vendor && vendor.images) {
      const storage = getStorage();
      // Extract the path from the existing image URL
      const imageUrl = vendor.images;
      const imagePath = imageUrl
        .replace(
          `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/`,
          ""
        )
        .split("?")[0];

      // Decode the URI and create a reference to the image
      const imageRef = ref(storage, decodeURIComponent(imagePath));

      try {
        await deleteObject(imageRef);
        // Reset the image state
        setImages("");

        // Update Firestore to remove the image URL
        const vendorRef = doc(getFirestore(), "Vendors", vendorID);
        await updateDoc(vendorRef, { images: "" });

        // Display an alert, update the state, and trigger a re-render
        alert("Image deleted successfully!");

        // Update the local vendor state to reflect the deletion
        setVendor({ ...vendor, images: "" });
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Failed to delete image.");
      }
    }
  };

  const handleImageUpload = async () => {
    if (imageFile) {
      if (vendor && vendor.images) {
        alert("Please delete the existing image before uploading a new one.");
        return;
      }

      const storage = getStorage();
      const newImageRef = ref(
        storage,
        `vendor-images/${vendorID}/${imageFile.name}`
      );

      try {
        const snapshot = await uploadBytes(newImageRef, imageFile);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update state with new image URL
        setImages(downloadURL);

        // Update the vendor object in state
        const updatedVendor = { ...vendor, images: downloadURL };
        setVendor(updatedVendor);

        // Update Firestore with new image URL
        const vendorRef = doc(getFirestore(), "Vendors", vendorID);
        await updateDoc(vendorRef, { images: downloadURL });

        // Display an alert and update the state
        alert("Image uploaded successfully!");
        setImageUploaded(true);
      } catch (error) {
        console.error("Error uploading new image:", error);
        alert("Failed to upload image.");
      }
    }
  };

  /*   const handleImageUpload = async () => {
    if (imageFile) {
      const storage = getStorage();
      const newImageRef = ref(
        storage,
        `vendor-images/${vendorID}/${imageFile.name}`
      );

      try {
        if (vendor && vendor.images) {
          const imageUrl = vendor.images;
          const imagePath = imageUrl
            .replace(
              "https://firebasestorage.googleapis.com/v0/b/" +
                storage.bucket +
                "/o/",
              ""
            )
            .split("?")[0]; // Extract the path from the URL

          const oldImageRef = ref(storage, decodeURIComponent(imagePath));
          try {
            await deleteObject(oldImageRef);
          } catch (error) {
            console.error("Error deleting old image:", error);
          }
        }

        // Upload the new image
        const snapshot = await uploadBytes(newImageRef, imageFile);
        const downloadURL = await getDownloadURL(snapshot.ref);

        setImages(downloadURL); // Update state with new image URL

        // Update Firestore with new image URL
        const vendorRef = doc(getFirestore(), "Vendors", vendorID);
        await updateDoc(vendorRef, { images: downloadURL });
      } catch (error) {
        console.error("Error uploading new image:", error);
      }
    }
  }; */

  /*   const handleImageUpload = async () => {
    if (imageFile) {
      const uploadedImageUrl = await uploadImageToImgur(imageFile);
      if (uploadedImageUrl) {
        setImages(uploadedImageUrl);
      }
    }
  }; */

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
            <p className="vendor-avatar">External Hosting: {vendor.avatar}</p>
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
            <p className="vendor-id">ID: {vendor.vendorID}</p>
            {vendor.images && (
              <div className="vendor-images">
                <img
                  src={vendor.images}
                  alt={`${vendor.name}'s upload`}
                  className="vendor-image"
                />
              </div>
            )}
            <p className="vendor-lot-number">Lot Number: {vendor.lotNum}</p>
          </div>
          {(currentUser && currentUser.uid === vendorID) ||
          userRole === "Admin" ? (
            <button
              onClick={() => setEditMode(true)}
              className="edit-vendor-button"
            >
              Edit
            </button>
          ) : null}
        </>
      ) : (
        <form onSubmit={updateVendor} className="edit-vendor-form">
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
          {/* Additional form fields and logic for Admin to handle images */}
          {userRole === "Admin" || "vendor" &&
            (vendor.images ? (
              <>
                <p>Current Image:</p>
                <img
                  src={vendor.images}
                  alt="Current upload"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <button type="button" onClick={handleDeleteImage}>
                  Delete Image
                </button>
                <p>
                  Please delete the existing image before uploading a new one.
                </p>
              </>
            ) : (
              <>
                <p>
                  You can upload one image. For more images, use External
                  Hosting.
                </p>
                <label>
                  Image Upload:
                  <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </label>
                {imageUploaded ? (
                  <p>Image uploaded successfully!</p>
                ) : (
                  <button type="button" onClick={handleImageUpload}>
                    Upload Image to Firebase
                  </button>
                )}
              </>
            ))}

          <label className="vendor-label">
            Lot Number:
            <input
              type="text"
              value={lotNum}
              onChange={(e) => setLotNum(e.target.value)}
              className="vendor-input"
            />
          </label>
          <div className="vendor-form-actions">
            <button type="submit" className="vendor-update-button">
              Update
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
