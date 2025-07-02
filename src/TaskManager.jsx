import React, { useState, useEffect } from "react";
import "./App.css";

export default function TaskManager({ user }) {
  const storageKey = (key) => `${user}_${key}`;

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(storageKey("tasks"));
    return saved ? JSON.parse(saved) : [];
  });

  const [task, setTask] = useState("");
  const [category, setCategory] = useState("");
  const [stars, setStars] = useState(() => {
    const saved = localStorage.getItem(storageKey("stars"));
    return saved ? parseInt(saved) : 0;
  });

  const [categoryColors, setCategoryColors] = useState(() => {
    const saved = localStorage.getItem(storageKey("categoryColors"));
    return saved ? JSON.parse(saved) : {};
  });

  const [tab, setTab] = useState("running");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(`${theme}-mode`);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    window.location.reload();
  };

  useEffect(() => {
    localStorage.setItem(storageKey("tasks"), JSON.stringify(tasks));
    localStorage.setItem(storageKey("stars"), stars.toString());
    localStorage.setItem(storageKey("categoryColors"), JSON.stringify(categoryColors));
  }, [tasks, stars, categoryColors]);

  const generateColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 75%)`;
  };

  const addTask = () => {
    if (!task.trim()) return;
    const trimmedCategory = category.trim() || "General";

    if (!categoryColors[trimmedCategory]) {
      setCategoryColors((prev) => ({
        ...prev,
        [trimmedCategory]: generateColor(),
      }));
    }

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: task,
        completed: false,
        category: trimmedCategory,
      },
    ]);
    setTask("");
    setCategory("");
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    const justCompleted = tasks.find((t) => t.id === id && !t.completed);
    if (justCompleted) setStars((s) => s + 1);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="container">
      <div className="card glass">
        <div className="header">
          <div className="user-info">
            <div className="avatar">{user[0].toUpperCase()}</div>
            <div>
              <div className="username">{user}</div>
              <div className="stars-small">⭐ {stars} stars</div>
            </div>
          </div>

          <div className="header-right">
            <div className="tabs">
              <button onClick={() => setTab("running")} className={tab === "running" ? "active-tab" : ""}>Running</button>
              <button onClick={() => setTab("completed")} className={tab === "completed" ? "active-tab" : ""}>Completed</button>
            </div>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark" : "🌞 Light"}
            </button>
            <button className="logout-button" onClick={logout}>Logout</button>
          </div>
        </div>


        <div className="input-group responsive-input">
          <input type="text" className="input" placeholder="New task" value={task} onChange={(e) => setTask(e.target.value)} />
          <input type="text" className="input" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <button className="add-button" onClick={addTask}>➕</button>
        </div>

        {/* TASK LIST */}
        <ul className="task-list">
          {(tab === "running" ? activeTasks : completedTasks).length === 0 ? (
            <p className="empty">No tasks in this section</p>
          ) : (
            (tab === "running" ? activeTasks : completedTasks).map((t) => (
              <li key={t.id} className="task">
                <div className="task-left">
                  <input type="checkbox" checked={t.completed} onChange={() => toggleComplete(t.id)} />
                  <span className={`task-text ${t.completed ? "completed" : ""}`}>{t.text}</span>
                  <span className="badge" style={{ backgroundColor: categoryColors[t.category] }}>{t.category}</span>
                </div>
                <button className="delete-button" onClick={() => deleteTask(t.id)}>✖</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
