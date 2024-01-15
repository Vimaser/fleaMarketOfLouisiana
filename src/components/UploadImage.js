import React, { useState } from 'react';
import { createFlickr } from "flickr-sdk";

const UploadImage = ({ onImageUpload }) => {
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (imageFile) {
      const flickr = createFlickr({
        consumerKey: process.env.FLICKR_CONSUMER_KEY,
        consumerSecret: process.env.FLICKR_CONSUMER_SECRET,
        oauthToken: process.env.FLICKR_OAUTH_TOKEN,
        oauthTokenSecret: process.env.FLICKR_OAUTH_TOKEN_SECRET,
      });

      try {
        const formData = new FormData();
        formData.append("photo", imageFile);

        // Use the Flickr SDK upload method
        const response = await flickr.upload(formData, { title: imageFile.name });

        // Check for successful response and get the photo ID
        if (response.stat === "ok") {
          const photoId = response.id;

          // You may need an additional API call here to get the photo URL
          // For example, flickr.photos.getSizes or flickr.photos.getInfo

          // Placeholder for the image URL retrieval
          const imageUrl = `URL_FOR_PHOTO_ID_${photoId}`; // Replace with actual image URL logic
          onImageUpload(imageUrl); // Callback with the image URL
        }
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={uploadImage}>Upload Image</button>
    </div>
  );
};

export default UploadImage;
