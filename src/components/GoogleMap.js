import React from "react";
import "./css/GoogleMap.css";

const GoogleMap = () => {
  return (
    <>
      <div className="google-map-container">
        <h2>Directions to the Flea Market</h2>
        <iframe
          title="Flea Market Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.9775063922034!2d-90.96877102443662!3d30.294701974798553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8626b6e05f5a8a4d%3A0xb7ab0c7f56eb8588!2sThe%20Flea%20Market%20of%20Louisiana!5e0!3m2!1sen!2sus!4v1705522833739!5m2!1sen!2sus"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </>
  );
};

export default GoogleMap;
