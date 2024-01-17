import React, { useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import ReCAPTCHA from "react-google-recaptcha";
import "../firebaseConfig";
import "./css/Contact.css";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  //const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
  //console.log("ReCAPTCHA Site Key:", siteKey);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      alert("Please verify you're not a robot.");
      return;
    }
    setLoading(true);
    const db = getFirestore();
    const newMessage = {
      name,
      email,
      message,
      dateReceived: serverTimestamp(),
    };
    try {
      await addDoc(collection(db, "contacts"), newMessage);
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to send message.");
    }
    setLoading(false);
  };

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      {submitted ? (
        <p>Thank you for your message. We will get back to you soon.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Message:
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          <ReCAPTCHA
            sitekey="6LcSR1QpAAAAAGO2lOxWTX3UfHeBclWGRg7Ps4vd"
            onChange={onCaptchaChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;
