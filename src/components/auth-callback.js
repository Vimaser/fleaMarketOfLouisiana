import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get("access_token");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      // Use navigate to redirect
      navigate("/dashboard"); // Replace "/dashboard" with your desired route
    } else {
      navigate("/login"); // Replace "/login" with your login route
    }
  }, [navigate]);

  return <div>Authenticating...</div>;
}

export default AuthCallback;
