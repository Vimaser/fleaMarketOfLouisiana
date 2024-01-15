import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import "../firebaseConfig";
import "./css/Services.css"
import "./css/darkMode.css";

const Services = ({ darkMode }) => {
  const [services, setServices] = useState([]);
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

    const fetchServices = async () => {
      const db = getFirestore();
      const servicesCollection = collection(db, "services");
      const servicesSnapshot = await getDocs(servicesCollection);
      const servicesList = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(servicesList);
    };

    fetchServices();

    return () => unsubscribe();
  }, []);

  return (
    <div className={`services-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="services-header">
        <h2>Our Services</h2>
        {isLoggedIn && (
          <Link className="create-link" to="/CreateServices">
            Create Service
          </Link>
        )}
      </div>
      {services.length === 0 ? (
        <p>No services available at the moment</p>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <h3>{service.serviceName}</h3>
              <p>{service.description}</p>
              <p>
                <strong>Duration:</strong> {service.duration}
              </p>
              {/* <p>
                <strong>Price:</strong> ${service.price}
              </p> */}
              <p>
                <strong>Service:</strong> {service.tier}
              </p>
              {isLoggedIn && (
                <div className="service-actions">
                  <Link to={`/EditService/${service.id}`} className="edit-link">
                    Edit
                  </Link>
                  <Link
                    to={`/DeleteService/${service.id}`}
                    className="delete-link"
                  >
                    Delete
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
