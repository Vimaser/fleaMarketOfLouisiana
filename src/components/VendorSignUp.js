import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const VendorSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [productCategories, setProductCategories] = useState('');
  const [images, setImages] = useState('');
  const [contactInformation, setContactInformation] = useState('');
  const [locationInMarket, setLocationInMarket] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [LotNum, setLotNum] = useState('');
  const [avatar, setAvatar] = useState('');



  const correctPassphrase = process.env.REACT_APP_VENDOR_PASSPHRASE;
  const db = getFirestore();


  const handlePassphraseSubmit = (e) => {
    e.preventDefault();
    if (passphrase === correctPassphrase) {
      setIsAuthorized(true);
    } else {
      setError("Incorrect passphrase");
    }
  };

  const vendorSignUp = (e) => {
    e.preventDefault(); // Prevent form submission

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Sign-up successful, create vendor profile
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
          locationInMarket
        };
        await setDoc(doc(db, "Vendors", user.uid), vendorProfile);

        alert("User and vendor profile created successfully");
        // Redirect or update UI as needed
      })
      .catch((error) => {
        // Handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(`Error signing up: ${errorCode} - ${errorMessage}`);
      });
  };

  return (
    <div>
      <h2>Vendor Sign-Up</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}

      {!isAuthorized ? (
        <form onSubmit={handlePassphraseSubmit}>
          <label>
            Enter Passphrase:
            <input
              type="text"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Submit Passphrase</button>
        </form>
      ) : (
        <form onSubmit={vendorSignUp}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <br />

          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <br />

          <label>
            Product Categories:
            <input
              type="text"
              value={productCategories}
              onChange={(e) => setProductCategories(e.target.value)}
              required
            />
          </label>
          <br />

          <div>
          <label>Avatar:</label>
          <input 
            type="text"
            value={avatar} 
            onChange={e => setAvatar(e.target.value)}
          />
        </div>

          <label>
            Images (URLs):
            <input
              type="text"
              value={images}
              onChange={(e) => setImages(e.target.value)}
            />
          </label>
          <br />

          <label>
            Contact Information:
            <input
              type="text"
              value={contactInformation}
              onChange={(e) => setContactInformation(e.target.value)}
              required
            />
          </label>
          <br />

          <label>
            Location in Market:
            <input
              type="text"
              value={locationInMarket}
              onChange={(e) => setLocationInMarket(e.target.value)}
              required
            />
          </label>
          <br />
          <div>
          <label>Lot Number:</label>
          <input 
            type="text"
            value={LotNum} 
            onChange={e => setLotNum(e.target.value)}
            required
          />
        </div>

          <button type="submit">Sign Up</button>
        </form>
      )}
    </div>
  );
};

export default VendorSignUp;