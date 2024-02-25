import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./css/VendorLogin.css";

const VendorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleResetForm = () => {
    setShowReset(!showReset);
  };

  const handlePasswordReset = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert(
        "Password reset email sent! Please check your junk or spam folder!"
      );
    } catch (error) {
      console.error("Error sending password reset emaiL:", error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login successful
        alert("Logged in successfully");
        // Redirect to vendor dashboard or desired page
        navigate(`/vendor/${userCredential.user.uid}`); // Navigate to vendor's page
      })
      .catch((error) => {
        // Handle errors here
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(`Login failed: ${errorCode} - ${errorMessage}`);
      });
  };

  return (
    <div className="vendor-login">
      <h2 className="vl-h2">Vendor Login</h2>
      {error && (
        <p className="error-message" style={{ color: "red" }}>
          {error}
        </p>
      )}
      <form onSubmit={handleLogin} className="login-form">
        <label className="email-label">
          Email:
          <input
            type="email"
            className="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label className="password-label">
          Password:
          <input
            type="password"
            className="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit" className="login-btn">
          Login
        </button>

      {/* Reset Password Form */}
      <br />

      <button onClick={toggleResetForm}>
        {showReset ? "Cancel Reset" : "Reset Password"}
      </button>

      {showReset && (
        <div className="reset-password-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
          <button onClick={handlePasswordReset}>Send Reset Email</button>
        </div>
      )}      </form>
    </div>
  );
};

export default VendorLogin;
