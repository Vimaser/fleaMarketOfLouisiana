import React, { useState, useEffect } from 'react';
import { getStorage, ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';
import {app} from "../firebaseConfig";
import "./css/Gallery.css";

const Gallery = ({ userRole }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const storage = getStorage(app);
                const galleryRef = ref(storage, "gallery/");
                const result = await listAll(galleryRef);

                const galleryImageUrls = await Promise.all(
                    result.items.map(async (itemRef) => {
                        try {
                            const url = await getDownloadURL(itemRef);
                            return { url, title: "" }; // Adjust to include actual title if available
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
    }, []);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const storage = getStorage(app);
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
        <div className="gallery-container l-box">
            <h2 className="gallery-header">Image Gallery</h2>
            {images.map((image, index) => (
                <div key={index} className="photo-box">
                    <img src={image.url} alt={image.title} />
                    <aside>
                        <span>{image.title}</span>
                    </aside>
                </div>
            ))}
            {userRole === "Admin" && (
                <div className="form-box">
                    <h3>Upload New Image</h3>
                    <input type="file" onChange={handleImageUpload} />
                    <button className="pure-button">Upload</button>
                </div>
            )}
        </div>
    );
};

export default Gallery;