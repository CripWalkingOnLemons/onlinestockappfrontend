//IdlePrompt.js

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

// Throttle function to prevent multiple refresh requests in quick succession
const throttle = (func, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

const IdlePrompt = ({ onStay, onLogout }) => {
  const [countdown, setCountdown] = useState(1800);
  const [isVisible, setIsVisible] = useState(false);
  const [inactivityTime, setInactivityTime] = useState(1740);

  const refreshToken = async () => {
    console.log("Refreshing token...");
    try {
      const refresh = localStorage.getItem("refreshToken");
  
      if (!refresh || !refresh.includes('.')) { // Check for token format
        console.log("Invalid refresh token format");
        onLogout(); // Log the user out if the refresh token is not valid
        return;
      }
  
      const res = await axios.post(`${BASE_URL}/api/users/refresh`, {}, {
        headers: {
          Authorization: `Bearer ${refresh}`,
        },
      });
  
      if (res.status === 200) {
        localStorage.setItem("authToken", res.data.access_token);
        console.log("Token refreshed successfully");
      } else {
        console.error("Failed to refresh token", res);
        onLogout(); // Log out only if the refresh fails
      }
    } catch (err) {
      console.error("Error refreshing token:", err);
      onLogout(); // Log out on error
    }
  };

  // Throttled version of the refreshToken function
  const throttledRefreshToken = useCallback(throttle(refreshToken, 600), []);
  

  const handleActivity = useCallback(() => {
    console.log("User activity detected, resetting countdown...");
    setInactivityTime(1800);
    setCountdown(1740);
    throttledRefreshToken();
  }, [throttledRefreshToken]);

  const handleCountdown = useCallback(() => {
    if (countdown > 0) {
      setCountdown(countdown - 1);
    } else {
      console.log("No activity detected, logging out...");
      onLogout(); // Call logout after the countdown ends
    }
  }, [countdown, onLogout]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    const inactivityTimer = setInterval(() => {
      if (inactivityTime > 0) {
        console.log("Decreasing inactivity time:", inactivityTime);
        setInactivityTime(inactivityTime - 1);
        setIsVisible(false);
      } else {
        if (inactivityTime === 0 && countdown === 60) {
          console.log("Starting 60-second countdown after 1 minute of inactivity...");
          setIsVisible(true);
        }
      }
    }, 1000);

    const countdownTimer = setInterval(handleCountdown, 1000);

    return () => {
      clearInterval(inactivityTimer);
      clearInterval(countdownTimer);
      events.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [inactivityTime, countdown, handleActivity, handleCountdown, onLogout]);

  return isVisible ? (
    <div className="idle-popup">
      <div className="popup-box">
        <p>Signing out due to inactivity: {countdown} sec</p>
        <div className="popup-actions">
          <button className="stay-btn" onClick={onStay}>Stay Logged In</button>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default IdlePrompt;
