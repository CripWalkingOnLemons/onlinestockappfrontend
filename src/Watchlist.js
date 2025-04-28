// Watchlist.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Watchlist.css";
import { BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom";
import IdlePrompt from "./IdlePrompt";
import useAuth from "./useAuth"; 
const BASE_URL = process.env.REACT_APP_API_URL;

function Watchlist() {
  const [stocks, setStocks] = useState([]);
  const { logout } = useAuth();  // Using useAuth hook to get logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();  // Call logout function from useAuth hook
    navigate("/signin"); // Correct usage of navigate in the router context
  };

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/watchlist/get`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setStocks(res.data || []);
    } catch (err) {
      console.error("Error fetching watchlist:", err);
    }
  };

  const handleDelete = async (ticker) => {
    try {
      await axios.delete(`${BASE_URL}/api/watchlist/delete?ticker=${ticker}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      fetchWatchlist(); // Refresh after delete
    } catch (err) {
      console.error("Error deleting ticker:", err);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <div className="watchlist-container">
      <h1 className="watchlist-header">Your Watchlist</h1>
      <div className="watchlist-grid">
        {stocks.length === 0 ? (
          <>
            <div className="watchlist-placeholder">+</div>
            <div className="watchlist-placeholder">+</div>
            <div className="watchlist-placeholder">+</div>
          </>
        ) : (
          stocks.map((item, idx) => (
            <div className="watchlist-card" key={idx}>
              <h3>{item.watchlist_stock}</h3>
              <p>
                {item.latest_price !== undefined && !isNaN(item.latest_price)
                  ? `$${parseFloat(item.latest_price).toFixed(2)}`
                  : "Loading price..."}
              </p>
              <button
                className="delete-btn"
                onClick={() => handleDelete(item.watchlist_stock)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
      {/* Idle Prompt */}
      <IdlePrompt onLogout={handleLogout} />
    </div>
  );
}

export default Watchlist;
