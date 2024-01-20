import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../firebaseConfig";
import "./css/Logout.css";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      alert("Later gater ;)");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Error during logout.");
    }
  };

  return (
    <div className="logout-container">
      <button className="logout-button" onClick={handleLogout}>
        Logout?
      </button>
    </div>
  );
};

export default Logout;
