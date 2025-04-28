// src/About.js
import React from "react";
import "./About.css";
import { BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom";
import IdlePrompt from "./IdlePrompt";
import useAuth from "./useAuth"; 

function About() {
  const { logout } = useAuth();  // Using useAuth hook to get logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();  // Call logout function from useAuth hook
    navigate("/signin"); // Correct usage of navigate in the router context
  };
  return (
    <div className="abt-page" style={{ padding: "2rem", color: "#f0f0f0", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ color: "#00ccff", textAlign: "center" }}>About Stock Visualizer</h1>
      <p>
        Stock Visualizer is a simple and powerful tool for exploring real-time stock data, trends,
        and insights. It offers dynamic charting, earnings predictions, and the latest financial
        news in one clean interface.
      </p>
      <p>
        Features include:
        <ul>
          <li><strong>Live stock price updates and trend indicators</strong></li>
          <li><strong>Watchlist for better price prediction</strong></li>
          <li><strong>Recent earnings, dividends, and splits</strong></li>
          <li><strong>Latest financial news feed for any ticker</strong></li>
          <li><strong>Fast switching between timeframes</strong></li>
        </ul>
      </p>
      {/* Idle Prompt */}
      <IdlePrompt onLogout={handleLogout} />
    </div>
  );
}
// add title to the About page
// add a back button
//* Add some style to the About page
// * Add some padding to the About page
// * Add some color to the About page
// * Add some margin to the About page
// * Add some interactivity to the About page
// * Add some animation to the About page
// * Add some hover effects to the About page
export default About;
