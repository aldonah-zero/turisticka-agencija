import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const LINKS = [
  { to: "/", icon: "🏖", label: "Aranžmani" },
  { to: "/rezervacija", icon: "📋", label: "Rezervacije" },
  { to: "/racuni", icon: "🧾", label: "Računi" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile topbar */}
      <header className="mob-bar">
        <Link to="/" className="mob-logo">
          <div className="logo-box">✈</div>

          <span>
            Adria<em>tica</em>
          </span>
        </Link>
        <button className="mob-toggle" onClick={() => setOpen((v) => !v)}>
          <span className={open ? "x" : ""} />
          <span className={open ? "x" : ""} />
          <span className={open ? "x" : ""} />
        </button>
      </header>

      {/* Overlay */}
      {open && <div className="sb-overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sb-logo">
          <div className="logo-box">✈</div>
          <div>
            <div className="sb-brand">
              Adria<em>tica</em>
            </div>
            <div className="sb-tagline">Travel Agency</div>
          </div>
        </div>

        <nav className="sb-nav">
          <div className="sb-label">Navigacija</div>
          {LINKS.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`sb-link ${pathname === to ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <span className="sb-icon">{icon}</span>
              <span className="sb-link-text">{label}</span>
              {pathname === to && <span className="sb-dot" />}
            </Link>
          ))}

          <div className="sb-label" style={{ marginTop: 24 }}>
            Sistem
          </div>
          <Link
            to="/admin"
            className={`sb-link ${pathname === "/admin" ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            <span className="sb-icon">⚙️</span>
            <span className="sb-link-text">Admin panel</span>
          </Link>
        </nav>

        <div className="sb-footer">
          <div className="sb-avatar">IG</div>
          <div>
            <div className="sb-uname">Igor P.</div>
            <div className="sb-urole">Administrator</div>
          </div>
        </div>
      </aside>
    </>
  );
}
