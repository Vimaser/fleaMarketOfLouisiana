import React, { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import "./css/VendorSignUp.css";

const VendorSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [productCategories, setProductCategories] = useState("");
  const [images, setImages] = useState("");
  const [contactInformation, setContactInformation] = useState("");
  const [locationInMarket, setLocationInMarket] = useState("");
  const [enteredPassphrase, setEnteredPassphrase] = useState(""); // State for user-entered passphrase
  const [passphrase, setPassphrase] = useState(""); // State for fetched passphrase
  const [error, setError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [LotNum, setLotNum] = useState("");
  const [avatar, setAvatar] = useState("");

  const db = getFirestore();

  useEffect(() => {
    const fetchPassphrase = async () => {
      const docRef = doc(db, "settings", "Ihn3alqYKbej8hayeRfW");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPassphrase(docSnap.data().passphrase);
      } else {
        console.log("No passphrase found!");
      }
    };

    fetchPassphrase();
  }, [db]);

  const handlePassphraseSubmit = (e) => {
    e.preventDefault();
    if (enteredPassphrase === passphrase) {
      setIsAuthorized(true);
    } else {
      setError("Incorrect passphrase");
    }
  };

  const vendorSignUp = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const vendorProfile = {
          vendorID: user.uid,
          role: "vendor",
          name,
          description,
          productCategories,
          images,
          avatar,
          LotNum,
          contactInformation,
          locationInMarket,
        };
        await setDoc(doc(db, "Vendors", user.uid), vendorProfile);

        alert("User and vendor profile created successfully");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(`Error signing up: ${errorCode} - ${errorMessage}`);
      });
  };

  return (
    <div className="vendor-signup">
      <h2 className="vs-h2">Vendor Sign-Up</h2>
      {error && (
        <p className="error-message" style={{ color: "red" }}>
          {error}
        </p>
      )}
  
      {!isAuthorized ? (
        <form onSubmit={handlePassphraseSubmit} className="passphrase-form">
          <label>
            Enter Passphrase:
            <input
              type="text"
              value={enteredPassphrase}
              onChange={(e) => setEnteredPassphrase(e.target.value)}
              required
              className="passphrase-input"
            />
          </label>
          <button type="submit" className="submit-passphrase-btn">
            Submit Passphrase
          </button>
        </form>
      ) : (
        <form onSubmit={vendorSignUp} className="signup-form">
          <label className="email-label">
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="email-input"
            />
          </label>
          <br />
          <label className="password-label">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="password-input"
            />
          </label>
          <label className="name-label">
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="name-input"
            />
          </label>
          <br />
  
          <label className="description-label">
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="description-textarea"
            />
          </label>
          <br />
  
          <label className="product-categories-label">
            Product Categories:
            <input
              type="text"
              value={productCategories}
              onChange={(e) => setProductCategories(e.target.value)}
              required
              className="product-categories-input"
            />
          </label>
          <br />
  
          <div className="avatar-section">
            <label className="avatar-label">Avatar:</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="avatar-input"
            />
          </div>
  
          <label className="images-label">
            Images (URLs):
            <input
              type="text"
              value={images}
              onChange={(e) => setImages(e.target.value)}
              className="images-input"
            />
          </label>
          <br />
  
          <label className="contact-info-label">
            Contact Information:
            <input
              type="text"
              value={contactInformation}
              onChange={(e) => setContactInformation(e.target.value)}
              required
              className="contact-info-input"
            />
          </label>
          <br />
  
          <label className="location-label">
            Location in Market:
            <input
              type="text"
              value={locationInMarket}
              onChange={(e) => setLocationInMarket(e.target.value)}
              required
              className="location-input"
            />
          </label>
          <br />
          <div className="lot-number-section">
            <label className="lot-number-label">Lot Number:</label>
            <input
              type="text"
              value={LotNum}
              onChange={(e) => setLotNum(e.target.value)}
              required
              className="lot-number-input"
            />
          </div>
  
          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
      )}
    </div>
  );
  
};

export default VendorSignUp;
