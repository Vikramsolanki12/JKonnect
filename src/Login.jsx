import React, { useState } from "react";
import "./App.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (!username.trim()) return;
    onLogin(username.trim());
  };
  const logout = () => {
    localStorage.removeItem("currentUser");
    window.location.reload(); // reload to reset the app to login screen
  };

  return (
    <div className="login-screen">
      <div className="login-glass">
        <h1 className="login-title">🚀 Welcome to JKonnect</h1>
        <p className="login-subtitle">
          Your future of productivity starts now.
        </p>

        <input
          type="text"
          placeholder="Enter your name"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <button className="login-button" onClick={handleLogin}>
          Enter Universe
        </button>
      </div>
    </div>
  );
}
