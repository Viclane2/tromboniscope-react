import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Directory from "./pages/Directory";
import Archives from "./pages/Archives";
import { FaHome, FaUsers, FaFolderOpen } from "react-icons/fa";
import "./App.css";

const App = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem("students"));
    if (savedStudents) {
      setStudents(savedStudents);
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="nav-link"><FaHome /> <span>Accueil</span></Link>
          <Link to="/directory" className="nav-link"><FaUsers /> <span>Nouvel enregistrement</span></Link>
          <Link to="/archives" className="nav-link"><FaFolderOpen /> <span>Archives</span></Link>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/directory"
              element={<Directory students={students} setStudents={setStudents} />}
            />
            <Route
              path="/archives"
              element={<Archives data={students} setStudents={setStudents} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;