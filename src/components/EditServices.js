import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import '../firebaseConfig';

const EditServices = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);

  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [tier, setTier] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const db = getFirestore();
        const serviceRef = doc(db, "services", serviceId);
        const serviceDoc = await getDoc(serviceRef);

        if (serviceDoc.exists()) {
          const data = serviceDoc.data();
          setService(data);
          setServiceName(data.serviceName || "");
          setDescription(data.description || "");
          setDuration(data.duration || "");
          setPrice(data.price || "");
          setTier(data.tier || "");
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const db = getFirestore();
      const serviceRef = doc(db, "services", serviceId);

      await updateDoc(serviceRef, {
        serviceName,
        description,
        duration,
        price,
        tier,
      });

      alert("Service updated successfully!");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  if (!service) {
    return <p>Loading...</p>;
  }

  return (
    <div className="edit-services">
      <h2>Edit Service</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Service Name:</label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Duration:</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label>Tier:</label>
          <input
            type="text"
            value={tier}
            onChange={(e) => setTier(e.target.value)}
          />
        </div>
        <button type="submit">Update Service</button>
      </form>
    </div>
  );
};

export default EditServices;