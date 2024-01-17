import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import "../firebaseConfig";
import useUserRole from "./useUserRole";
import img from "../img/fleabro1.gif";
import "./css/Home.css";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [featuredVendors, setFeaturedVendors] = useState([]);
  const [ourVendors, setOurVendors] = useState([]);
  const [currentVendorIndex, setCurrentVendorIndex] = useState(0);
  const [allVendors, setAllVendors] = useState([]); // new state for all vendors (for admin)
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [filteredVendors, setFilteredVendors] = useState([]); // State for filtered vendor list
  const [selectedFeaturedVendor, setSelectedFeaturedVendor] = useState("");

  const userRole = useUserRole();
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch upcoming events
      const eventsCollection = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsCollection);
      setEvents(
        eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      // Fetch featured vendors
      const vendorsCollection = collection(db, "Vendors");
      const vendorsSnapshot = await getDocs(vendorsCollection);
      const allVendors = vendorsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOurVendors(allVendors);
      setFeaturedVendors(allVendors.filter((vendor) => vendor.featured));
    };

    const fetchAllVendors = async () => {
      const vendorsCollection = collection(db, "Vendors");
      const vendorsSnapshot = await getDocs(vendorsCollection);
      setAllVendors(
        vendorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchData();
    if (userRole === "Admin") {
      fetchAllVendors();
    }
  }, [userRole, db]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVendorIndex((prevIndex) => (prevIndex + 1) % ourVendors.length);
    }, 5000); // Change 3000 to the duration you want for each vendor display (in milliseconds)

    return () => clearInterval(interval);
  }, [ourVendors.length]);

  useEffect(() => {
    // Filter vendors based on search query
    const filteredVendors = allVendors.filter((vendor) => {
      const name = vendor.name || ""; // Default to empty string if undefined
      const lotNum = vendor.lotNum || ""; // Default to empty string if undefined
      const query = searchQuery.toLowerCase();
      return (
        name.toLowerCase().includes(query) ||
        lotNum.toLowerCase().includes(query)
      );
    });

    setFilteredVendors(filteredVendors);
  }, [searchQuery, allVendors]);

  const deleteEvent = async (eventId) => {
    if (userRole === "Admin") {
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, "events", eventId));
        setEvents(events.filter((event) => event.id !== eventId));
      } catch (error) {
        console.error("Error deleting event: ", error);
        alert("Failed to delete event.");
      }
    } else {
      alert("You are not authorized to delete events.");
    }
  };

  const updateVendorFeaturedStatus = async (vendorId, isFeatured) => {
    if (userRole === "Admin" && vendorId) {
      try {
        const db = getFirestore();
        const vendorRef = doc(db, "Vendors", vendorId);
        await updateDoc(vendorRef, { featured: isFeatured });

        // Update the local allVendors state to reflect the change
        const updatedAllVendors = allVendors.map((vendor) =>
          vendor.id === vendorId ? { ...vendor, featured: isFeatured } : vendor
        );
        setAllVendors(updatedAllVendors);

        // Correctly update the featuredVendors state
        let updatedFeaturedVendors = updatedAllVendors.filter(
          (vendor) => vendor.featured
        );
        setFeaturedVendors(updatedFeaturedVendors);
      } catch (error) {
        console.error("Error updating vendor status: ", error);
      }
    }
  };

  return (
    <div className="home-container">
      <section className="image-section">
        <img src={img} alt="FleaBro" />
      </section>

      {/* Highlights Section */}
      <section className="highlights">
        <h2>Market Highlights</h2>
        <p>Explore the best of our flea market!</p>
        <ul>
          <li>Major Highway location just south of BATON ROUGE</li>
          <li>FREE Parking - FREE Admission</li>
          <li>Clean Restrooms</li>
          <li>Great Food & Beverages</li>
          <li>Family Atmosphere</li>
          <li>400 Spaces under one roof!</li>
          <li>Open Every Saturday & Sunday - Rain or Shine</li>
          <li>A Modern old-fashioned Flea Market!</li>
        </ul>
      </section>

      {/* Upcoming Events Section */}
      <section className="upcoming-events">
        <h2>Upcoming Events</h2>
        {events.length === 0 ? (
          <p>No upcoming events.</p>
        ) : (
          <ul>
            {events.map((event) => (
              <li key={event.id} className="event-item">
                <div className="event-details">
                  <h3 className="event-title">{event.title}</h3>
                  <span className="event-date">{event.date}</span>
                  <span className="event-time">{event.time}</span>
                  <p className="event-description">{event.description}</p>
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="event-image"
                    />
                  )}
                  <p className="event-location">{event.location}</p>
                  {event.link && (
                    <a
                      href={event.link}
                      className="event-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      More Info
                    </a>
                  )}
                </div>
                {userRole === "Admin" && (
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="delete-event-button"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        {userRole === "Admin" && (
          <Link className="create-link" to="/CreateEvents">
            Create Event
          </Link>
        )}
      </section>

      <br />

      {/* Admin Interface to Select Featured Vendors */}
      {userRole === "Admin" && (
        <section className="admin-vendor-selection">
          <h2>Select Featured Vendors</h2>
          <input
            type="text"
            placeholder="Search by Name or Lot Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={selectedFeaturedVendor}
            onChange={(e) => setSelectedFeaturedVendor(e.target.value)}
          >
            <option value="">Select a Vendor</option>
            {filteredVendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name} - Lot {vendor.lotNum}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              const isAlreadyFeatured = featuredVendors.some(
                (vendor) => vendor.id === selectedFeaturedVendor
              );
              updateVendorFeaturedStatus(
                selectedFeaturedVendor,
                !isAlreadyFeatured
              );
            }}
          >
            Choose Vendor
          </button>
        </section>
      )}

      {/* Featured Vendors Section */}
      <section className="featured-vendors">
        <h2>Featured Vendors</h2>
        {featuredVendors.length === 0 ? (
          <p>No featured vendors at the moment.</p>
        ) : (
          <ul>
            {featuredVendors.map((vendor) => (
              <li key={vendor.id}>
                <strong>{vendor.name}</strong>
                <p>{ourVendors[currentVendorIndex].avatar}</p>
                <p>Image:</p>
                {ourVendors[currentVendorIndex].images && (
                  <img
                    src={ourVendors[currentVendorIndex].images}
                    alt={`Image for ${
                      ourVendors[currentVendorIndex].name || "vendor"
                    }`}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                )}
                <p>{ourVendors[currentVendorIndex].productCategories}</p>
                <p>{ourVendors[currentVendorIndex].description}</p>
                {/* Add more vendor details here */}
                {/* Example: You can display an image or other details if available */}
                {vendor.image && <img src={vendor.image} alt={vendor.name} />}
                {/* Add any other vendor details you wish to display */}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Our Vendors Section */}
      <section className="our-vendors">
        <h2>Our Vendors</h2>
        {ourVendors.length === 0 ? (
          <p>Check out our amazing vendors!</p>
        ) : (
          <div>
            <strong>{ourVendors[currentVendorIndex].name}</strong>
            <p>{ourVendors[currentVendorIndex].avatar}</p>
            <p>Image:</p>
            {ourVendors[currentVendorIndex].images && (
              <img
                src={ourVendors[currentVendorIndex].images}
                alt={`Image for ${
                  ourVendors[currentVendorIndex].name || "vendor"
                }`}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
            <p>{ourVendors[currentVendorIndex].productCategories}</p>
            <p>{ourVendors[currentVendorIndex].description}</p>
            <p>Location: {ourVendors[currentVendorIndex].locationInMarket}</p>
            <p>Lot Number: {ourVendors[currentVendorIndex].lotNum}</p>
          </div>
        )}
      </section>

      {/* Additional Sections as needed */}
    </div>
  );
};

export default Home;
