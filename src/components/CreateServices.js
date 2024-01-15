import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
/* import { getAuth } from "firebase/auth"; */
import { useNavigate } from "react-router-dom";
import '../firebaseConfig';

const CreateServices = () => {
    const [serviceName, setServiceName] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [price, setPrice] = useState("");
    const [tier, setTier] = useState("");
    const navigate = useNavigate();

    const handleCreateService = async (e) => {
        e.preventDefault();

        const db = getFirestore();
        const serviceData = {
            serviceName,
            description,
            duration,
            price,
            tier
        };

        try {
            await addDoc(collection(db, "services"), serviceData);
            alert("Service added successfully!");
            navigate("/services");
        } catch (error) {
            console.error("Error adding service: ", error);
            alert("There was an error adding the service. Please try again.");
        }
    };

    return (
        <div className="create-service">
            <h2>Add a New Service</h2>
            <form onSubmit={handleCreateService}>
                <label>
                    Name:
                    <input type="text" value={serviceName} onChange={e => setServiceName(e.target.value)} required />
                </label>
                <br />
                <label>
                    Description:
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} required />
                </label>
                <br />
                <label>
                    Duration:
                    <input type="text" value={duration} onChange={e => setDuration(e.target.value)} required />
                </label>
                <br />
                <label>
                    Price:
                    <input type="text" value={price} onChange={e => setPrice(e.target.value)} required />
                </label>
                <br />
                <br />
                <label>
                    Tier:
                    <input type="text" value={price} onChange={e => setTier(e.target.value)} required />
                </label>
                <br />
                <button type="submit">Add Service</button>
            </form>
        </div>
    );
};

export default CreateServices;
