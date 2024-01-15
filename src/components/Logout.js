import React from "react";
import { getAuth, signOut } from "firebase/auth";
import '../firebaseConfig';

const Logout = () => {
  const handleLogout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      alert("You have successfully logged out.");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Error during logout.");
    }
  };

  return (
    <div className="logout">
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;