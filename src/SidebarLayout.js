// SidebarLayout.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SidebarLayout.css";

function SidebarLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  };

  // Don't show sidebar for signin/signup routes
  const hideSidebarRoutes = ["/signin", "/register"];
  if (hideSidebarRoutes.includes(location.pathname)) {
    return (
      <div className="signin-layout">
        <Link to="/" style={{ color: "#5ecfff", padding: "10px", display: "block", fontWeight: "bold" }}>
          &lt;---- Home
        </Link>
        {children}
      </div>
    );
  }

  return (
    <>
      <div className={`hamburger ${isSidebarOpen ? "move-right" : ""}`} onClick={toggleSidebar}>
        &#9776;
      </div>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <Link to="/" style={{ textDecoration: "none", color: "white" }}>
        <h2>StockVisualizer</h2>
      </Link>

        <hr />
        <ul>
          {localStorage.getItem("authToken") ? (
            <>
              <li><Link to="/" onClick={toggleSidebar}>Home</Link></li>
              <li><Link to="/account" onClick={toggleSidebar}>Account</Link></li>
              <li><Link to="/watchlist" onClick={toggleSidebar}>Watchlist</Link></li>
              <li><Link to="/about" onClick={toggleSidebar}>About</Link></li>
              <li><Link to="/faq" onClick={toggleSidebar}>FAQ</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/" onClick={toggleSidebar}>Home</Link></li>
              <li><Link to="/signin" onClick={toggleSidebar}>Signin / Signup</Link></li>
              <li><Link to="/watchlist" onClick={toggleSidebar}>Watchlist</Link></li>
              <li><Link to="/about" onClick={toggleSidebar}>About</Link></li>
              <li><Link to="/faq" onClick={toggleSidebar}>FAQ</Link></li>
            </>
          )}
        </ul>
        {localStorage.getItem("authToken") && (
          <div className="logout-container">
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
      <div>{children}</div>
    </>
  );
}

export default SidebarLayout;
