// Account.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route,useNavigate} from "react-router-dom";
import axios from "axios";
import "./Account.css";
import IdlePrompt from "./IdlePrompt";
import useAuth from "./useAuth"; 

const BASE_URL = process.env.REACT_APP_API_URL;

function Account() {
  const [user, setUser] = useState(null);
  const { logout } = useAuth();  // Using useAuth hook to get logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();  // Call logout function from useAuth hook
    navigate("/signin"); // Correct usage of navigate in the router context
  };

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users/protected`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load account info", err);
      }
    };

    fetchAccount();
  }, []);

  return (
    <div className="account-container">
      <h1 className="account-title">Account Overview</h1>

      <div className="account-box">
        <div className="account-field">
          <label>Username</label>
          <p>{user?.username || "Loading..."}</p>
        </div>

        <div className="account-field">
          <label>Email</label>
          <p>{user?.email || "Loading..."}</p>
        </div>

        <div className="account-field">
          <label>Premium Status</label>
          <p>{user?.premium ? "Premium User ✅" : "Premium User ❌"}</p>
        </div>

        <div className="account-actions">
          <button className="account-btn">Change Password</button>
          <button className="account-btn danger">Delete Account</button>
        </div>
        {/* Idle Prompt */}
        <IdlePrompt onLogout={handleLogout} />
      </div>
    </div>
  );
}

export default Account;
