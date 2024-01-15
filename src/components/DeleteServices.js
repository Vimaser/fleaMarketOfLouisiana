import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const DeleteServices = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        setUser(auth.currentUser);
        setLoading(false);
    }, []);

    const handleDelete = async () => {
        if (!user) {
            alert("Please log in to delete a service.");
            return;
        }

        const db = getFirestore();
        await deleteDoc(doc(db, 'services', id));
        alert('Service deleted successfully.');
        navigate('/services');
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Are you sure you want to delete this service?</h2>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
}

export default DeleteServices;