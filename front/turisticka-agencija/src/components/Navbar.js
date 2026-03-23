// Novo:
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">✈</div>
          <span className="logo-text">
            Adria<span>tica</span>
          </span>
        </Link>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            🏖 Aranžmani
          </Link>
          <Link
            to="/racuni"
            className={`nav-link ${isActive("/racuni") ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            🧾 Računi
          </Link>
          <Link
            to="/rezervacija"
            className={`nav-link ${isActive("/rezervacija") ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            📋 Rezervacija
          </Link>
          <Link
            to="/admin"
            className={`nav-link nav-link-admin ${isActive("/admin") ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            ⚙️ Admin
          </Link>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
