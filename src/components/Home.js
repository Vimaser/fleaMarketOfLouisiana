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
import img from "../img/fleabro-4.gif";
import GoogleMap from "./GoogleMap";
import Gallery from "./Gallery";
import FacebookPageEmbed from "./FacebookPageEmbed";
import "./css/Home.css";
import "./css/Events.css";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [featuredVendors, setFeaturedVendors] = useState([]);
  // const [ourVendors, setOurVendors] = useState([]);
  // const [currentVendorIndex, setCurrentVendorIndex] = useState(0);
  const [allVendors, setAllVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [selectedFeaturedVendor, setSelectedFeaturedVendor] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const openModal = (imageUrl) => {
    setModalImage(imageUrl);
    setModalOpen(true);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Look, CSS is being annoying. Don't judge me!

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
      // setOurVendors(allVendors);
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

  /*   useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVendorIndex((prevIndex) => (prevIndex + 1) % ourVendors.length);
    }, 5000); // Change 3000 to the duration you want for each vendor display (in milliseconds)

    return () => clearInterval(interval);
  }, [ourVendors.length]); */

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const clearFeaturedVendor = async (vendorId) => {
    if (userRole === "Admin" && vendorId) {
      try {
        const vendorRef = doc(db, "Vendors", vendorId);
        await updateDoc(vendorRef, { featured: false });

        // Update local state to reflect changes
        const updatedVendors = featuredVendors.map((vendor) =>
          vendor.id === vendorId ? { ...vendor, featured: false } : vendor
        );
        setFeaturedVendors(updatedVendors.filter((vendor) => vendor.featured));
      } catch (error) {
        console.error("Error clearing featured status: ", error);
      }
    }
  };

  const convertTo12HourFormat = (time24) => {
    if (!time24) {
      return 'Time not set';
    }
  
    const [hours, minutes] = time24.split(":");
    const hours12 = (hours % 12 || 12).toString().padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";
    return `${hours12}:${minutes} ${amPm}`;
  };
  

  return (
    <div className="home-container">
      <section className="image-section">
        <img src={img} alt="FleaBro" />
      </section>
      <div class="content-wrapper">
        {/* Highlights Section */}
        <section className="highlights">
          <h2>
            <span>Market</span> {isMobile && <br />} Highlights
          </h2>
          <br />
          <p>Explore the best of our flea market!</p>

          <ul>
            <li>
              Welcome to our vibrant flea market, a treasure trove located just
              south of Baton Rouge, accessible directly off a major highway.
              We're thrilled to offer an experience that combines modern
              convenience with the charm of old-fashioned market shopping. Our
              market features 400 unique spaces, all under one roof, ensuring a
              delightful exploration rain or shine, every Saturday and Sunday.
              One of the best parts? Enjoy completely free parking and
              admission! We pride ourselves on maintaining clean restrooms,
              providing a range of delicious food and beverages, and fostering a
              family-friendly atmosphere. It's more than just a shopping
              destination; it's a place where community and culture come alive.
              Don't miss out on the chance to discover something special at our
              modern, yet old-fashioned flea market!
            </li>
          </ul>
        </section>

        <section className="highlights">
          <h2>OFFICE HOURS:</h2>
          <ul>
            <li>MONDAY: 9:00 AM TO 4:30 PM</li>
            <li>THURSDAY: 9:00 AM TO 4:30 PM</li>
            <li>FRIDAY: 9:00 AM TO 4:30 PM</li>
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
                    <span className="event-time">
                      <br/>
                      <p>Starting: {convertTo12HourFormat(event.time)}</p>
                    </span>
                    <span className="event-time">
                    <p>Ending: {convertTo12HourFormat(event.endTime)}</p>
                      
                    </span>
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
      </div>

      <br />
      {/* Location */}
      <div className="social-media-maps-container">
        <div className="map-container">
          <GoogleMap />
        </div>

        <div className="facebook-container">
          <FacebookPageEmbed />
        </div>
      </div>

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
          {featuredVendors.map((vendor) => (
            <li key={vendor.id}>
              <strong>{vendor.name}</strong>
              {/* ... other vendor details ... */}
              {userRole === "Admin" && (
                <button onClick={() => clearFeaturedVendor(vendor.id)}>
                  Clear Featured
                </button>
              )}
            </li>
          ))}
        </section>
      )}

      {/* Featured Vendors Section */}
      {/*       <section className="featured-vendors">
        <h2>Featured Vendors</h2>
        {featuredVendors.length === 0 ? (
          <p>No featured vendors at the moment.</p>
        ) : (
          <ul>
            {featuredVendors.map((vendor) => (
              <li key={vendor.id}>
                <strong>{vendor.name}</strong>
                {vendor.avatar && <p>{vendor.avatar}</p>}
                {vendor.images && (
                  <div>
                    <img
                      src={vendor.images}
                      alt={`${vendor.name || "Vendor"} representation`}
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                )}
                <p>{vendor.productCategories}</p>
                <p>{vendor.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section> */}

      <>
        <section className="featured-vendors-container">
          <h2 className="featured-vendors-title">Featured Vendors</h2>
          {featuredVendors.length === 0 ? (
            <p>No featured vendors at the moment.</p>
          ) : (
            <ul className="vendor-list">
              {featuredVendors.map((vendor) => (
                <li key={vendor.id} className="vendor-item">
                  <strong>{vendor.name}</strong>
                  {vendor.avatar && <p>{vendor.avatar}</p>}
                  {vendor.images && (
                    <div className="vendor-image-container">
                      <img
                        src={vendor.images}
                        alt={`${vendor.name || "Vendor"} representation`}
                        onClick={() => openModal(vendor.images)}
                        className="vendor-image"
                      />
                    </div>
                  )}
                  <p>{vendor.productCategories}</p>
                  <p>{vendor.description}</p>
                  {/* Add more vendor details here */}
                </li>
              ))}
            </ul>
          )}
        </section>
        {modalOpen && (
          <div className="modal">
            <span className="close-modal" onClick={() => setModalOpen(false)}>
              &times;
            </span>
            <img
              src={modalImage}
              alt="Expanded view"
              className="modal-content"
            />
          </div>
        )}
      </>

      <div className="gallery-container">
        <Gallery />
      </div>

      {/* Our Vendors Section */}
      {/*       <section className="our-vendors">
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
                alt={`${
                  ourVendors[currentVendorIndex].name || "Vendor"
                } representation`}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}

            <p>{ourVendors[currentVendorIndex].productCategories}</p>
            <p>{ourVendors[currentVendorIndex].description}</p>
            <p>Location: {ourVendors[currentVendorIndex].locationInMarket}</p>
            <p>Lot Number: {ourVendors[currentVendorIndex].lotNum}</p>
          </div>
        )}
      </section> */}

      {/* Additional Sections as needed */}
    </div>
  );
};

export default Home;
