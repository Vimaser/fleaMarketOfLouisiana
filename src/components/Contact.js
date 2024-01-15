import React, { useState } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import ReCAPTCHA from "react-google-recaptcha";
import '../firebaseConfig';
import "./css/Contact.css";

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      dateReceived: serverTimestamp()
    };
    try {
      await addDoc(collection(db, 'contacts'), newMessage);
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to send message.');
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
          {/* ...other form fields... */}
          <ReCAPTCHA
            sitekey="YOUR_RECAPTCHA_SITE_KEY" // Replace with your reCAPTCHA site key
            onChange={onCaptchaChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}

export default Contact;
