import React, { useState, useEffect } from "react";
import { getStorage, ref, listAll, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { app } from "../firebaseConfig";
import "./css/Gallery.css";
import useUserRole from "./useUserRole";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const userRole = useUserRole();

  const storage = getStorage(app);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const galleryRef = ref(storage, "gallery/");
        const result = await listAll(galleryRef);

        const galleryImageUrls = await Promise.all(
          result.items.map(async (itemRef) => {
            try {
              const url = await getDownloadURL(itemRef);
              return { url, title: "" };
            } catch (error) {
              console.error("Error fetching individual image URL:", error);
              return null;
            }
          })
        );

        setImages(galleryImageUrls.filter(Boolean));
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to fetch images.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [storage]);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleImageDelete = async (imageRef) => {
    try {
      setLoading(true);

      const storageRef = ref(storage, imageRef);
      await deleteObject(storageRef);

      setImages(images.filter((image) => image.url !== imageRef));
    } catch (error) {
      console.error("Error deleting file:", error);
      setError("Failed to delete image.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `gallery/${file.name}`);
    try {
      setLoading(true);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setImages([...images, { url, title: file.name }]);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="gallery-container">
      {images.map((image, index) => (
        <div key={index} className="photo-box" onClick={() => openModal(image.url)}>
          <img src={image.url} alt={`Gallery item ${index + 1}`} />
          {userRole === "Admin" && (
            <button onClick={() => handleImageDelete(image.url)}>
              Delete
            </button>
          )}
        </div>
      ))}
      {userRole === "Admin" && (
        <div className="form-box">
          <h3>Upload New Image</h3>
          <input type="file" onChange={handleImageUpload} />
          <button className="pure-button">Upload</button>
        </div>
      )}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Full size" />
          <span className="close-modal">&times;</span>
        </div>
      )}
    </div>
  );
};

export default Gallery;