// FAQ.js
import React from "react";
import "./FAQ.css";
import { BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom";
import IdlePrompt from "./IdlePrompt";
import useAuth from "./useAuth"; 

function FAQ() {
  const { logout } = useAuth();  // Using useAuth hook to get logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();  // Call logout function from useAuth hook
    navigate("/signin"); // Correct usage of navigate in the router context
  };
  return (
    <div className="faq-page" style={{ padding: "2rem", color: "#f0f0f0", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ color: "#00ccff", textAlign: "center" }}>Frequently Asked Questions</h2>
      <ul>
        <li><strong>What is a stock?</strong> A stock is a share in the ownership of a company.</li>
        <li><strong>How often does data update?</strong> Every 5 seconds in real-time mode.</li>
        <li><strong>Where does the data come from?</strong> It uses Yahoo Finance via yFinance API.</li>
        <li><strong>Can I save my watchlist?</strong> You can save up to 3 stocks on Free Plan</li>
        <li><strong>How is the data Predicted</strong> Data is predicted whilst you watch the stock it gathers the past values makes precise calculations and generates a percentage of how it thinks it will move any guess under 75% is discarded</li>
      </ul>
      {/* Idle Prompt */}
      <IdlePrompt onLogout={handleLogout} />
    </div>
  );
}
//add title to the FAQ page
// add back button
// add some style to the FAQ page
// add some padding to the FAQ page
// add some color to the FAQ page
// add some margin to the FAQ page
// add some interactivity to the FAQ page
// add some animation to the FAQ page
// add some hover effects to the FAQ page
export default FAQ;
