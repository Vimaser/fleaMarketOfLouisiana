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
  // const OAuth = process.env.REACT_APP_IMGUR_CLIENT_ID;

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

  const handleImageUpload = async () => {
    if (imageFile) {
      const storage = getStorage();
      const newImageRef = ref(
        storage,
        `vendor-images/${vendorID}/${imageFile.name}`
      );

      try {
        // Delete existing image if it exists
        if (vendor && vendor.images) {
          const oldImageRef = ref(storage, vendor.images);
          await deleteObject(oldImageRef).catch((error) =>
            console.error("Error deleting old image:", error)
          );
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
  };

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
          <h2>{vendor.name}</h2>
          <p>Avatar: {vendor.avatar}</p>
          <p>{vendor.description}</p>
          <p>Contact Info: {vendor.contactInformation}</p>
          <p>Location: {vendor.locationInMarket}</p>
          <p>Categories: {vendor.productCategories}</p>
          <p>ID: {vendor.vendorID}</p>
          <p>
            Images:{" "}
            {vendor.images && (
              <img
                src={vendor.images}
                alt={`${vendor.name}'s uploaded`}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
          </p>
          <p>Lot Number: {vendor.lotNum}</p>
          {(currentUser && currentUser.uid === vendorID) ||
          userRole === "Admin" ? (
            <button onClick={() => setEditMode(true)}>Edit</button>
          ) : null}
        </>
      ) : (
        <form onSubmit={updateVendor}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <br />
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <br />
          <label>
            Contact Information:
            <input
              type="text"
              value={contactInformation}
              onChange={(e) => setContactInformation(e.target.value)}
            />
          </label>
          <br />
          <label>
            Location in Market:
            <input
              type="text"
              value={locationInMarket}
              onChange={(e) => setLocationInMarket(e.target.value)}
            />
          </label>
          <br />
          <label>
            Product Categories:
            <input
              type="text"
              value={productCategories}
              onChange={(e) => setProductCategories(e.target.value)}
            />
          </label>
          <br />
          <label>
            Images (URL):
            <input
              type="text"
              value={images}
              onChange={(e) => setImages(e.target.value)}
            />
          </label>
          <br />
          <label>
            Image Upload:
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </label>
          <button type="button" onClick={handleImageUpload}>
            Upload Image to Firebase
          </button>
          <br />
          {images && (
            <img
              src={images}
              alt="Uploaded"
              style={{ width: "100px", height: "100px" }}
            />
          )}
          <br />
          <label>
            Avatar (URL):
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </label>
          <br />
          <label>
            Lot Number:
            <input
              type="text"
              value={lotNum}
              onChange={(e) => setLotNum(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Update</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default Vendor;
