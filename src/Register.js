// Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";
const BASE_URL = process.env.REACT_APP_API_URL;

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/users/register`, {
        username,
        email,
        password
      });
      navigate("/signin");
    } catch (err) {
        const errorMsg = err.response?.data?.error || "Registration failed.";
        setError(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <h2>Stock Visualizer - Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        {error && <p className="auth-error">{error}</p>}
      </form>
      <p className="auth-footer">
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </div>
  );
}

export default Register;
