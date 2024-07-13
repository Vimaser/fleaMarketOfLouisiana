import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
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
  const [allVendors, setAllVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [selectedFeaturedVendor, setSelectedFeaturedVendor] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const userRole = useUserRole();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const eventsCollection = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsCollection);
      setEvents(eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const vendorsCollection = collection(db, "Vendors");
      const vendorsSnapshot = await getDocs(vendorsCollection);
      const allVendors = vendorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const featuredVendors = allVendors.filter((vendor) => vendor.featured);

      // Fetch image URLs for featured vendors
      const featuredVendorsWithImages = await Promise.all(
        featuredVendors.map(async (vendor) => {
          const vendorImageRef = ref(storage, `vendor-images/${vendor.id}`);
          const vendorImages = await listAll(vendorImageRef);
          const imageUrls = await Promise.all(vendorImages.items.map(itemRef => getDownloadURL(itemRef)));
          return { ...vendor, imageUrls };
        })
      );

      setFeaturedVendors(featuredVendorsWithImages);
    };

    const fetchAllVendors = async () => {
      const vendorsCollection = collection(db, "Vendors");
      const vendorsSnapshot = await getDocs(vendorsCollection);
      setAllVendors(vendorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
    if (userRole === "Admin") {
      fetchAllVendors();
    }
  }, [userRole, db, storage]);

  useEffect(() => {
    const filteredVendors = allVendors.filter((vendor) => {
      const name = vendor.name || "";
      const lotNum = vendor.lotNum || "";
      const query = searchQuery.toLowerCase();
      return name.toLowerCase().includes(query) || lotNum.toLowerCase().includes(query);
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

        const updatedAllVendors = allVendors.map((vendor) =>
          vendor.id === vendorId ? { ...vendor, featured: isFeatured } : vendor
        );
        setAllVendors(updatedAllVendors);

        let updatedFeaturedVendors = updatedAllVendors.filter((vendor) => vendor.featured);
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
      return "Time not set";
    }
    const [hours, minutes] = time24.split(":");
    const hours12 = (hours % 12 || 12).toString().padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";
    return `${hours12}:${minutes} ${amPm}`;
  };

  const openModal = (imageUrl) => {
    setModalImage(imageUrl);
    setModalOpen(true);
  };

  return (
    <div className="home-container">
      <section className="image-section">
        <img src={img} alt="FleaBro" />
      </section>
      <div className="content-wrapper">
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
            <li>TUESDAY: 10:00 AM TO 3:00 PM</li>
            <li>WEDNESDAY: 10:00 AM TO 3:00 PM</li>
            <li>THURSDAY: 9:00 AM TO 4:30 PM</li>
            <li>FRIDAY: 9:00 AM TO 4:30 PM</li>
          </ul>
        </section>

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
                      <br />
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
      <div className="social-media-maps-container">
        <div className="map-container">
          <GoogleMap />
        </div>

        <div className="facebook-container">
          <FacebookPageEmbed />
        </div>
      </div>

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
              {userRole === "Admin" && (
                <button onClick={() => clearFeaturedVendor(vendor.id)}>
                  Clear Featured
                </button>
              )}
            </li>
          ))}
        </section>
      )}

      <section className="featured-vendors">
        <h2>Featured Vendors</h2>
        {featuredVendors.length === 0 ? (
          <p>No featured vendors at the moment.</p>
        ) : (
          <Carousel
            autoPlay
            interval={5000}
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            onClickItem={(index) => navigate(`/vendor/${featuredVendors[index].id}`)}
          >
            {featuredVendors.map((vendor) => (
              <div key={vendor.id} className="vendor-item">
                <strong>{vendor.name}</strong>
                {vendor.avatar && <p>{vendor.avatar}</p>}
                {vendor.imageUrls && vendor.imageUrls.length > 0 && (
                  <div className="vendor-image-container">
                    <img
                      src={vendor.imageUrls[0]}
                      alt={`${vendor.name || "Vendor"} representation`}
                      onClick={() => openModal(vendor.imageUrls[0])}
                      style={{ width: "150px", height: "auto", cursor: "pointer" }}
                    />
                  </div>
                )}
                <p>{vendor.productCategories}</p>
                <p>{vendor.description}</p>
                <p>{vendor.locationInMarket}</p>
                <p>{vendor.lotNum}</p>
              </div>
            ))}
          </Carousel>
        )}
      </section>

      <div className="gallery-container">
        <Gallery />
      </div>

      {modalOpen && (
        <div className="modal" style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span className="close-modal" onClick={() => setModalOpen(false)} style={{
            position: 'absolute',
            top: '20px',
            right: '40px',
            fontSize: '30px',
            fontWeight: 'bold',
            color: 'white',
            cursor: 'pointer'
          }}>
            &times;
          </span>
          <img
            src={modalImage}
            alt="Expanded view"
            className="modal-content"
            style={{ maxWidth: '80%', maxHeight: '80%' }}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
