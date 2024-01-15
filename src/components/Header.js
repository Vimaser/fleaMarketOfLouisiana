import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "./css/Header.css";
import "./css/darkMode.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      if (!prevMode) {
        document.body.setAttribute("data-dark", "true");
      } else {
        document.body.removeAttribute("data-dark");
      }
      return !prevMode;
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.setAttribute("data-dark", "true");
    } else {
      document.body.removeAttribute("data-dark");
    }

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
  }, [darkMode]);

  return (
    <nav className={mobileMenuOpen ? "open" : ""}>
      <div className="hamburger" onClick={toggleMobileMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="menu-items">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          Home
        </NavLink>
        <NavLink
          to="/FAQs"
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          FAQs
        </NavLink>
        <NavLink to="/blog" activeClassName="active">
          Blog
        </NavLink>
        <NavLink to="/contact" activeClassName="active">
          Contact
        </NavLink>
        {user ? (
          <NavLink to={`/vendor/${user.uid}`} activeClassName="active">
            Vendor
          </NavLink>
        ) : (
          <>
            <NavLink to="/VendorLogin" activeClassName="active">
              Vendor Login
            </NavLink>
            <NavLink to="/VendorSignUp" activeClassName="active">
              Vendor SignUp
            </NavLink>
          </>
        )}

        {userRole === "Admin" && (
          <>
            <NavLink to="/AdminPortal" activeClassName="active">
              Admin Portal
            </NavLink>
            <NavLink to="/messages" activeClassName="active">
              Messages
            </NavLink>
          </>
        )}

        {user ? (
          <>
            <NavLink to="/logout" activeClassName="active">
              Logout
            </NavLink>
          </>
        ) : (
          <NavLink to="/login" activeClassName="active"></NavLink>
        )}
        <button onClick={toggleDarkMode}>{darkMode ? "Light" : "Dark"}</button>
      </div>
    </nav>
  );
};

export default Header;
