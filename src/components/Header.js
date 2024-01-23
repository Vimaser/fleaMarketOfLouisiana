import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import {
  FaFacebookSquare,
  FaTwitterSquare,
  FaYoutubeSquare,
  FaEnvelope,
} from "react-icons/fa";
import "./css/Header.css";
// import "./css/darkMode.css";
import logoImageUrl from "../img/logo.png";

const Header = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  // const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopHeader, setShowTopHeader] = useState(true);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setShowTopHeader(currentScrollPos < 50); // Adjust 50 to the threshold you prefer
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*   const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      if (!prevMode) {
        document.body.setAttribute("data-dark", "true");
      } else {
        document.body.removeAttribute("data-dark");
      }
      return !prevMode;
    });
  }; */

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch the user's role from Firestore
        try {
          const userDocRef = doc(db, "Vendors", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
          } else {
            setUserRole("");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserRole("");
        }
      } else {
        setUserRole("");
      }
    });

    return () => unsubscribe();
  }, []); // Removed darkMode from dependency array

  return (
    <div
      className={
        showTopHeader
          ? "header-container"
          : "header-container top-header-not-active"
      }
    >
      {/* Logo and Social Media Links with Animation */}
      <div
        className={
          showTopHeader ? "top-header top-header-active" : "top-header"
        }
      >
        <div className="logo-container">
          <img src={logoImageUrl} alt="Logo" />
        </div>
        <div className="times">
          {/* If the times are not meant to be a link, use a button */}
        </div>
        <div className="social-media-links">
          {" "}
          <p className="time">Sat. 9am - 5pm | Sun. 9am - 5pm</p>
          <p1> </p1>
          <a href="https://www.facebook.com/FLEALA/">
            <FaFacebookSquare />
          </a>
          <p1> &#160; </p1>
          <a href="your_twitter_link">
            <FaTwitterSquare />
          </a>
          <p1> &#160; </p1>
          <a href="your_youtube_link">
            <FaYoutubeSquare />
          </a>
          <p1> &#160; </p1>
          <a href="mailto:fleamarket@eatel.net">
            <FaEnvelope />
          </a>
          <p1> &#160; </p1>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={`nav-bar ${mobileMenuOpen ? "open" : ""}`}>
        {/* Hamburger Menu for Mobile */}
        <div className="hamburger" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`pure-menu-list ${mobileMenuOpen ? "active" : ""}`}>
          <li className="pure-menu-item">
            <NavLink
              to="/"
              className={`pure-menu-link nav-button ${
                location.pathname === "/" ? "active-link" : ""
              }`}
              onClick={closeMobileMenu}
            >
              Home
            </NavLink>
          </li>
          <li className="pure-menu-item">
            <NavLink
              to="/FAQs"
              className={`pure-menu-link nav-button ${
                location.pathname === "/FAQs" ? "active-link" : ""
              }`}
              onClick={closeMobileMenu}
            >
              FAQs
            </NavLink>
          </li>
          <li className="pure-menu-item">
            <NavLink
              to="/blog"
              className={`pure-menu-link nav-button ${
                location.pathname === "/blog" ? "active-link" : ""
              }`}
              onClick={closeMobileMenu}
            >
              Blog
            </NavLink>
          </li>
          <li className="pure-menu-item">
            <NavLink
              to="/contact"
              className={`pure-menu-link nav-button ${
                location.pathname === "/contact" ? "active-link" : ""
              }`}
              onClick={closeMobileMenu}
            >
              Contact
            </NavLink>
          </li>
          <li className="pure-menu-item">
            <NavLink
              to="/map"
              className={`pure-menu-link nav-button ${
                location.pathname === "/map" ? "active-link" : ""
              }`}
              onClick={closeMobileMenu}
            >
              Map
            </NavLink>
          </li>
          <li className="pure-menu-item">
            <NavLink
              to="/search"
              className={`pure-menu-link nav-button ${
                location.pathname === "/search" ? "active-link" : ""
              }`}
              onClick={closeMobileMenu}
            >
              Search
            </NavLink>
          </li>
          <li className="pure-menu-item">
            <NavLink
              to="/Gallery"
              className={`pure-menu-link nav-button ${
                location.pathname === "/Gallery" ? "active-link" : ""
              }`}
              onClick={closeMobileMenu}
            >
              Gallery
            </NavLink>
          </li>

          {user ? (
            <li className="pure-menu-item">
              <NavLink
                to={`/vendor/${user.uid}`}
                className={`pure-menu-link nav-button ${
                  location.pathname === `/vendor/${user.uid}`
                    ? "active-link"
                    : ""
                }`}
                onClick={closeMobileMenu}
              >
                Vendor
              </NavLink>
            </li>
          ) : (
            <>
              <li className="pure-menu-item">
                <NavLink
                  to="/VendorLogin"
                  className={`pure-menu-link nav-button ${
                    location.pathname === "/VendorLogin" ? "active-link" : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  Login
                </NavLink>
              </li>
              <li className="pure-menu-item">
                <NavLink
                  to="/VendorSignUp"
                  className={`pure-menu-link nav-button ${
                    location.pathname === "/VendorSignUp" ? "active-link" : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  Sign-Up
                </NavLink>
              </li>
            </>
          )}
          {userRole === "Admin" && (
            <>
              <li className="pure-menu-item">
                <NavLink
                  to="/AdminPortal"
                  className={`pure-menu-link nav-button ${
                    location.pathname === "/AdminPortal" ? "active-link" : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  Admin
                </NavLink>
              </li>
              <li className="pure-menu-item">
                <NavLink
                  to="/messages"
                  className={`pure-menu-link nav-button ${
                    location.pathname === "/messages" ? "active-link" : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  Messages
                </NavLink>
              </li>
            </>
          )}
          {user ? (
            <li className="pure-menu-item">
              <NavLink
                to="/logout"
                className={`pure-menu-link nav-button ${
                  location.pathname === "/logout" ? "active-link" : ""
                }`}
                onClick={closeMobileMenu}
              >
                Logout
              </NavLink>
            </li>
          ) : (
            <li className="pure-menu-item">
              {/*               <NavLink
                to="/VendorLogin"
                className={`pure-menu-link nav-button ${
                  location.pathname === "/VendorLogin" ? "active-link" : ""
                }`}
                onClick={closeMobileMenu}
              >
                Login
              </NavLink> */}
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
