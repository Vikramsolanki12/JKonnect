import React, { useState, useEffect } from "react";
import Login from "./Login";
import TaskManager from "./TaskManager";

export default function App() {
  const [user, setUser] = useState(() => {
    return localStorage.getItem("currentUser") || null;
  });
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.classList.add(`${savedTheme}-mode`);

  const handleLogin = (username) => {
    localStorage.setItem("currentUser", username);
    setUser(username);
  };

  return user ? <TaskManager user={user} /> : <Login onLogin={handleLogin} />;
}
