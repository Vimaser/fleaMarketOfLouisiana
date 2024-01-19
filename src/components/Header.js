import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "./css/Header.css";
// import "./css/darkMode.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  // const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="header-container">
      <nav
        className={`pure-menu pure-menu-horizontal ${
          mobileMenuOpen ? "open" : ""
        }`}
      >
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
            >
              Search Vendors
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
                >
                  Vendor Login
                </NavLink>
              </li>
              <li className="pure-menu-item">
                <NavLink
                  to="/VendorSignUp"
                  className={`pure-menu-link nav-button ${
                    location.pathname === "/VendorSignUp" ? "active-link" : ""
                  }`}
                >
                  Vendor SignUp
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
                >
                  Admin Portal
                </NavLink>
              </li>
              <li className="pure-menu-item">
                <NavLink
                  to="/messages"
                  className={`pure-menu-link nav-button ${
                    location.pathname === "/messages" ? "active-link" : ""
                  }`}
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
              >
                Logout
              </NavLink>
            </li>
          ) : (
            <li className="pure-menu-item">
              <NavLink
                to="/login"
                className={`pure-menu-link nav-button ${
                  location.pathname === "/login" ? "active-link" : ""
                }`}
              >
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};
export default Header;
