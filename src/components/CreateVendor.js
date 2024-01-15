import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import '../firebaseConfig';
// import './css/CreateVendor.css';

const CreateVendor = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [productCategories, setProductCategories] = useState('');
  const [images, setImages] = useState(''); // For simplicity, using comma-separated URLs
  const [avatar, setAvatar] = useState('');
  const [contactInformation, setContactInformation] = useState('');
  const [LotNum, setLotNum] = useState('');
  const [locationInMarket, setLocationInMarket] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const db = getFirestore();
    const newVendor = {
      name,
      description,
      productCategories: productCategories.split(',').map(item => item.trim()),
      images: images.split(',').map(img => img.trim()),
      contactInformation,
      locationInMarket
    };
    try {
      await addDoc(collection(db, 'Vendors'), newVendor);
      alert('Vendor created successfully!');
      // Reset form
      setName('');
      setDescription('');
      setProductCategories('');
      setAvatar('');
      setImages('');
      setContactInformation('');
      setLocationInMarket('');
      setLotNum('');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to create vendor.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Create New Vendor</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            type="text"
            value={name} 
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Product Categories (comma-separated):</label>
          <input 
            type="text"
            value={productCategories} 
            onChange={e => setProductCategories(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Avatar:</label>
          <input 
            type="text"
            value={avatar} 
            onChange={e => setAvatar(e.target.value)}
          />
        </div>
        <div>
          <label>Images (comma-separated URLs):</label>
          <input 
            type="text"
            value={images} 
            onChange={e => setImages(e.target.value)}
          />
        </div>
        <div>
          <label>Contact Information:</label>
          <input 
            type="text"
            value={contactInformation} 
            onChange={e => setContactInformation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location in Market:</label>
          <input 
            type="text"
            value={locationInMarket} 
            onChange={e => setLocationInMarket(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Lot Number:</label>
          <input 
            type="text"
            value={LotNum} 
            onChange={e => setLotNum(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Vendor'}
        </button>
      </form>
    </div>
  );
}

export default CreateVendor;