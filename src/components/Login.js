import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../firebaseConfig";
import {
  getFirestore,
  getDoc,
  doc
} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import "./css/darkMode.css";
import "./css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const db = getFirestore();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        // Check if the user exists in Firestore and get their role
        const userDoc = await getDoc(doc(db, "Vendors", userCredential.user.uid));
        if (!userDoc.exists()) {
          throw new Error("User does not exist in the system.");
        }

        const userData = userDoc.data();
        if (userData.role !== "Admin") {
          throw new Error("Access denied. Only admins can log in.");
        }

        // Login was successful
        setLoginStatus("success");
        setError(null);
        navigate("/");
      }
    } catch (err) {
      // Handle error
      setError(err.message);
      setLoginStatus("failure");
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <p>Administration Only</p>
      <br/>
      {error && <p className="error">{error}</p>}
      {loginStatus === "success" && (
        <p className="success">Login was successful!</p>
      )}
      {loginStatus === "failure" && (
        <p className="error">Login failed. Please try again.</p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
