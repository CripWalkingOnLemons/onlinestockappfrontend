import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Signin.css";
const BASE_URL = process.env.REACT_APP_API_URL;

function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/users/login`, {
        identifier,
        password,
      });
  
      const { access_token, refresh_token } = res.data;
      localStorage.setItem("authToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Try again.");
    }
  };
  

  return (
    <div className="signin-wrapper">
      <div className="signin-box">
        <h2>Stock Visualizer - Login</h2>
        <form onSubmit={handleSubmit} className="signin-form">
          <input
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log in</button>
          {error && <p className="auth-error">{error}</p>}
        </form>

        <div className="signin-footer">
          <Link to="/forgot" className="left-link">Forgot password?</Link>
          <Link to="/register" className="right-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
