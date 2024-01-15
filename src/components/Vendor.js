import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useUserRole from './useUserRole'; // Assuming you have this hook
import '../firebaseConfig';

const Vendor = () => {
  const [vendor, setVendor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // State for current user
  const { vendorID } = useParams();
  const db = getFirestore();
  const userRole = useUserRole(); // Get the current user's role
  const auth = getAuth();

  // State hooks for editable fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contactInformation, setContactInformation] = useState('');
  const [locationInMarket, setLocationInMarket] = useState('');
  const [productCategories, setProductCategories] = useState('');
  const [images, setImages] = useState('');
  const [avatar, setAvatar] = useState('');
  const [lotNum, setLotNum] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const vendorRef = doc(db, 'Vendors', vendorID);
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
        setAvatar(vendorData.avatar || '');
        setLotNum(vendorData.lotNum || '');
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

  const updateVendor = async (e) => {
    e.preventDefault();
    if (currentUser && (currentUser.uid === vendorID || userRole === 'Admin')) {
      const vendorRef = doc(db, 'Vendors', vendorID);
      const updatedData = { name, description, contactInformation, locationInMarket, productCategories, images, avatar, lotNum };
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
          <p>Images: {vendor.images}</p>
          <p>Lot Number: {vendor.lotNum}</p>
          {(currentUser && currentUser.uid === vendorID) || userRole === 'Admin' ? (
            <button onClick={() => setEditMode(true)}>Edit</button>
          ) : null}
        </>
      ) : (
        <form onSubmit={updateVendor}>
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <br />
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <br />
          <label>
            Contact Information:
            <input type="text" value={contactInformation} onChange={(e) => setContactInformation(e.target.value)} />
          </label>
          <br />
          <label>
            Location in Market:
            <input type="text" value={locationInMarket} onChange={(e) => setLocationInMarket(e.target.value)} />
          </label>
          <br />
          <label>
            Product Categories:
            <input type="text" value={productCategories} onChange={(e) => setProductCategories(e.target.value)} />
          </label>
          <br />
          <label>
            Images:
            <input type="text" value={images} onChange={(e) => setImages(e.target.value)} />
          </label>
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
}

export default Vendor;
