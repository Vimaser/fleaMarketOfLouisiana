import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../firebaseConfig";
import "./css/Portfolio.css";
import "./css/darkMode.css";

const Portfolio = ({ darkMode }) => {
  const [items, setItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    const fetchPortfolioItems = async () => {
      const db = getFirestore();
      const portfolioCollection = collection(db, "portfolio");
      const portfolioSnapshot = await getDocs(portfolioCollection);
      const portfolioList = portfolioSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(portfolioList);
    };

    fetchPortfolioItems();

    return () => unsubscribe();
  }, []);

  return (
    <div className={`portfolio-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="portfolio-header">
        <h2>Portfolio</h2>
        {isLoggedIn && (
          <Link className="create-link" to="/CreatePortfolio">
            Create New Portfolio Item
          </Link>
        )}
      </div>
      {items.length === 0 ? (
        <p>No portfolio items to display</p>
      ) : (
        <div className="portfolio-grid">
          {items.map((item) => (
            <div key={item.id} className="portfolio-card">
              <img
                src={item.imageUrl}
                alt={item.projectName}
                className="portfolio-image"
              />
              <h3>{item.projectName}</h3>
              <p>{item.description}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                View Project
              </a>
              <p>
                <strong>Technologies:</strong> {item.technologies}
              </p>
              <div className="portfolio-actions">
                {isLoggedIn && (
                  <Link to={`/editportfolio/${item.id}`} className="edit-link">
                    Edit
                  </Link>
                )}
                {isLoggedIn && (
                  <Link
                    to={`/deleteportfolio/${item.id}`}
                    className="delete-link"
                  >
                    Delete
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
