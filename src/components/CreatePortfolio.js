import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const CreatePortfolio = () => {
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imgURL, setImgURL] = useState('');
    const [link, setLink] = useState('');
    const [projectName, setProjectName] = useState('');
    const [technologies, setTechnologies] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const db = getFirestore();
        const portfolioCollection = collection(db, 'portfolio');

        const newPortfolioItem = {
            description,
            imageUrl,
            imgURL,
            link,
            projectName,
            technologies
        };

        try {
            await addDoc(portfolioCollection, newPortfolioItem);
            alert('Portfolio item added successfully!');
            navigate('/portfolio');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('There was a problem adding your portfolio item. Please try again.');
        }
    };

    return (
        <div>
            <h2>Create Portfolio Item</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Project Name:</label>
                    <input 
                        type="text" 
                        value={projectName} 
                        onChange={e => setProjectName(e.target.value)} 
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
                    <label>Image URL (imageUrl):</label>
                    <input 
                        type="text" 
                        value={imageUrl} 
                        onChange={e => setImageUrl(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Image URL (imgURL):</label>
                    <input 
                        type="text" 
                        value={imgURL} 
                        onChange={e => setImgURL(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Link:</label>
                    <input 
                        type="text" 
                        value={link} 
                        onChange={e => setLink(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Technologies:</label>
                    <input 
                        type="text" 
                        value={technologies} 
                        onChange={e => setTechnologies(e.target.value)} 
                    />
                </div>
                <button type="submit">Add to Portfolio</button>
            </form>
        </div>
    );
}

export default CreatePortfolio;
