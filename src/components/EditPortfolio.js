import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import "../firebaseConfig";

const EditPortfolio = () => {
  const { itemId } = useParams();
/*   const [item, setItem] = useState(null); */
  const [loading, setLoading] = useState(true);

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!itemId) {
      console.error("itemId is not defined");
      return;
    }

    const fetchItem = async () => {
      try {
        const db = getFirestore();
        const itemRef = doc(db, "portfolio", itemId);
        const itemDoc = await getDoc(itemRef);

        if (itemDoc.exists()) {
          const data = itemDoc.data();
          /* setItem(data); */
          setProjectName(data.projectName || "");
          setDescription(data.description || "");
          setLink(data.link || "");
          setTechnologies(data.technologies || "");
          setImageUrl(data.imageUrl || "");
          setLoading(false);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const db = getFirestore();
      const itemRef = doc(db, "portfolio", itemId);

      await updateDoc(itemRef, {
        projectName,
        description,
        link,
        technologies,
        imageUrl,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error updating document:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="edit-portfolio">
      <h2>Edit Portfolio Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Name:</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
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
          <label>Link:</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <div>
          <label>Technologies:</label>
          <input
            type="text"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditPortfolio;
