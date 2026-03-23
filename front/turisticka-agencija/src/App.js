import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AranžmanDetalji from "./pages/AranžmanDetalji";
import Rezervacija from "./pages/Rezervacija";
import Admin from "./pages/Admin";
import Racuni from "./pages/Racuni";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aranzman/:id" element={<AranžmanDetalji />} />
          <Route path="/rezervacija" element={<Rezervacija />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/racuni" element={<Racuni />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
