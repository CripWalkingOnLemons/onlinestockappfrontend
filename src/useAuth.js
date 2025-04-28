import { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;

const useAuth = () => {
  const [authStatus, setAuthStatus] = useState(null); // null -> unauthenticated / authenticated
  const [authToken, setAuthToken] = useState(null);  // Store token here

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setAuthStatus("unauthenticated");
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/users/protected`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setAuthToken(token);  // Set the token if user is authenticated
          setAuthStatus("authenticated");
        }
      } catch (error) {
        setAuthStatus("unauthenticated");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
      }
    };

    fetchUserData();
  }, []);
  const logout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");

    // Update auth status and token state
    setAuthStatus("unauthenticated");
    setAuthToken(null);
  };

  return { authToken, authStatus, logout };
};

export default useAuth;
