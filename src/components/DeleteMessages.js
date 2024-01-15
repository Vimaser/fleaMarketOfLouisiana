import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const DeleteMessages = () => {
    const [user, setUser] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        setUser(auth.currentUser);
    }, []);

    const handleDelete = async () => {
        if (!user) {
            alert("Please log in to delete a message.");
            return;
        }

        const db = getFirestore();
        await deleteDoc(doc(db, 'messages', id));
        alert('Message deleted successfully.');
        navigate('/messages');
    }

    return (
        <div>
            <h2>Are you sure you want to delete this message?</h2>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
}

export default DeleteMessages;
