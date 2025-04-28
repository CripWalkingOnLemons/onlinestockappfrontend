import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import About from "./About";
import FAQ from "./FAQ"; 
import StockChart from "./StockChart";
import Signin from "./Signin";
import Register from "./Register";
import Watchlist from "./Watchlist";
import Account from "./Account";
import "./App.css";
import IdlePrompt from "./IdlePrompt";
import SidebarLayout from "./SidebarLayout";
import useAuth from "./useAuth"; 


function MainPage() {
  const [ticker, setTicker] = useState("");
  const [stockData, setStockData] = useState(null);
  const [chartType] = useState("Line");
  const [timeframe, setTimeframe] = useState("1d");
  const [error, setError] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]);
  const [extras, setExtras] = useState({ earnings: { Earnings: "None" }, dividends: [], ranges: {}, splits: [] });
  const { logout } = useAuth();  // Using useAuth hook to get logout function
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL;

  const handleLogout = () => {
    logout();  // Call logout function from useAuth hook
    navigate("/signin"); // Correct usage of navigate in the router context
  };

  const fetchStockData = useCallback(async () => {
    if (!ticker) return;
    try {
      const response = await axios.get(`${BASE_URL}/api/stock?ticker=${ticker}&chart_type=${chartType}&timeframe=${timeframe}`);
      setStockData(response.data);
      setShowChart(true);
      fetchNews(ticker);
      fetchExtras(ticker);
      setError("");
    } catch (err) {
      console.error("Error fetching stock data", err);
      setError("Error fetching data. Please try again.");
    }
  }, [ticker, chartType, timeframe]);

  const fetchNews = async (query = null) => {
    if (!query) return;
    try {
      const response = await axios.get(`${BASE_URL}/api/news?ticker=${query}`);
      setNewsArticles(response.data.news || []);
    } catch (e) {
      console.error("Error fetching news", e);
      setNewsArticles([]);
    }
  };

  const fetchExtras = async (symbol) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/extras?ticker=${symbol}`);
      setExtras(response.data);
    } catch (e) {
      console.error("Error fetching extras", e);
      setExtras({
        earnings: { Earnings: "None" },
        dividends: [],
        ranges: {},
        splits: [],
      });
    }
  };

  useEffect(() => {
    if (!ticker) fetchNews("technology");
  }, [ticker]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ticker && showChart) fetchStockData();
    }, 5000);
    return () => clearInterval(interval);
  }, [ticker, chartType, timeframe, fetchStockData, showChart]);

  useEffect(() => {
    const ad = document.querySelector(".adsbygoogle");
    if (!ad || ad.getAttribute("data-adsbygoogle-status") === "done") return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdsbyGoogle push error:", e);
    }
  }, [showChart]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticker.trim() !== "") fetchStockData();
  };

  const toggleView = () => {
    if (!ticker && !showChart) {
      alert("Please select a ticker symbol first.");
      return;
    }
    setShowChart((prev) => !prev);
  };

  const timeframes = ["1h", "1d", "1w", "1m", "3m", "6m", "1y"];
  const fq = extras.earnings?.latest || {};
  const fqEstimate = fq["EPS Estimate"];
  const fqReported = fq["Reported EPS"];
  const fqSurprise = fq["Surprise(%)"];

  return (
    <div className="app">
      <div className="header-bar">
        <h1>Stock Visualizer</h1>
        {stockData && <p className="timestamp">Last Updated: {new Date(stockData.timestamp).toLocaleTimeString()}</p>}
      </div>
      
      <form onSubmit={handleSubmit} className="form">
        {localStorage.getItem("authToken") && (
          <button
            onClick={() => {
              if (!ticker) {
                alert("Please search a ticker first.");
                return;
              }
              axios.post(`${BASE_URL}/api/watchlist/add`, {
                ticker: ticker,
              }, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
              }).then(res => {
                alert("Ticker added to watchlist!");
              }).catch(err => {
                console.error(err);
                alert("Failed to add to watchlist.");
              });
            }}
            style={{
              backgroundColor: "#5ecfff",
              color: "#000",
              padding: "0.5rem 1rem",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Add to Watchlist
          </button>
        )}
        <button type="button" onClick={toggleView}>{showChart ? "News Feed" : "Chart"}</button>
        <input
          type="text"
          placeholder="Enter ticker (e.g., NVDA)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
        />
        <button type="submit">Fetch</button>
        <div className="timeframe-buttons">
          {timeframes.map((tf) => (
            <button key={tf} onClick={() => setTimeframe(tf)} style={{ backgroundColor: tf === timeframe ? "#444" : "#666" }}>
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      {showChart && stockData ? (
        <div className="results">
          <h2>{stockData.ticker}</h2>
          <p>Current Price: ${parseFloat(stockData.current_price).toFixed(2)}</p>
          <p>Trend: {stockData.trend}</p>
          <p>EMA Fast: {parseFloat(stockData.indicators.ema_fast).toFixed(2)}</p>
          <p>RSI: {parseFloat(stockData.indicators.rsi).toFixed(2)}</p>
          <p>MACD Hist: {parseFloat(stockData.indicators.macd_hist).toFixed(2)}</p>
          <p>Resistance: {stockData.resistance ? "Yes" : "No"}</p>
          <p>Predicted Price (1 min): {stockData.predicted_price ? `$${stockData.predicted_price} (${stockData.prediction_direction})` : "N/A"}</p>
          <StockChart data={stockData.data} chartType={chartType} />
        </div>
      ) : (
        <div className="news-feed">
          <h2 style={{ textAlign: "center" }}>{ticker ? `${ticker} News Feed` : "Technology News"}</h2>
          {newsArticles.length === 0 ? (
            <p style={{ textAlign: "center" }}>No news articles available.</p>
          ) : (
            newsArticles.slice(0, 3).map((item, index) => (
              <div key={index} className="news-card">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <h3>{item.title}</h3>
                </a>
                <p>{item.summary}</p>
                <p className="news-meta">{item.publisher} — {item.time_published ? new Date(item.time_published).toLocaleString() : "Unknown date"}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Idle Prompt */}
      <IdlePrompt onLogout={handleLogout} />

      <div className="footer-ad">
        <ins className="adsbygoogle" style={{ display: "inline-block", width: "728px", height: "90px" }}
          data-ad-client="ca-pub-8596571992003407"
          data-ad-slot="1308229697"></ins>
      </div>

      {/*  Extras Section */}
      <div className="extra-sections">
        <div className="info-card">
          <h3>Earnings</h3>
          <p><strong>Latest:</strong></p>
          <p>EPS Estimate: {fqEstimate ?? "none"}</p>
          <p>Reported EPS: {fqReported ?? "none"}</p>
          <p>Surprise(%): {fqSurprise ?? "none"}</p>
          <p><strong>Next Earnings Date:</strong> {extras.earnings?.next_date ? new Date(extras.earnings.next_date).toLocaleDateString() : "none"}</p>
        </div>

        <div className="info-card">
          <h3>Dividends</h3>
          {extras.dividends.length > 0 ? extras.dividends.map((d, i) => (
            <p key={i}>Dividend: ${d.amount} on {new Date(d.date).toLocaleDateString()}</p>
          )) : <p>No recent dividend</p>}
        </div>

        <div className="info-card">
          <h3>Price Ranges</h3>
          <p>52W High: {extras.ranges["52WeekHigh"] ?? "none"}</p>
          <p>52W Low: {extras.ranges["52WeekLow"] ?? "none"}</p>
          <p>Day High: {extras.ranges.DayHigh ?? "none"}</p>
          <p>Day Low: {extras.ranges.DayLow ?? "none"}</p>
        </div>

        <div className="info-card">
          <h3>Splits</h3>
          {extras.splits.length > 0 ? extras.splits.map((s, i) => (
            <p key={i}>Split Ratio: {s.ratio} on {new Date(s.date).toLocaleDateString()}</p>
          )) : <p>No recent split</p>}
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const authStatus = useAuth();  // Get the authStatus (authenticated/unauthenticated)
  const navigate = useNavigate();

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      navigate("/signin");  // Navigate to signin if unauthenticated
    }
  }, [authStatus, navigate]);

  return (
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<SidebarLayout><MainPage /></SidebarLayout>} />
      <Route path="/account" element={<SidebarLayout><Account /></SidebarLayout>} />
      <Route path="/watchlist" element={<SidebarLayout><Watchlist /></SidebarLayout>} />
      <Route path="/about" element={<SidebarLayout><About /></SidebarLayout>} />
      <Route path="/faq" element={<SidebarLayout><FAQ /></SidebarLayout>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter basename="/onlinestockappfrontend">
      <AppContent />
    </BrowserRouter>
  );
}

export default App;




// Note: Ensure to handle the case where stockData might not have all fields.
// You can add more error handling and loading states as needed.
// You can also add more styling or use a CSS framework for better UI.
// This is a basic implementation. You can enhance it further by adding features like:
// - Historical data visualization
// - User authentication
// - Saving favorite stocks
// - Notifications for price changes
// - More detailed stock information
// - Error handling for network issues
// - Loading indicators while fetching data
// - Responsive design for mobile devices
// - Accessibility improvements
// - Unit tests for components
// - Integration tests for the entire application
// - Documentation for the codebase
// - Deployment scripts for production
// - CI/CD pipeline for automated testing and deployment
// - Code linting and formatting
// - Performance optimizations
// - Security best practices
// - Monitoring and logging for production
// - User feedback and ratings
// - Dark mode support