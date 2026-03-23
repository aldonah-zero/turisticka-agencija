import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { aranžmanAPI, destinacijaAPI, hotelAPI, vodicAPI } from "../api";
import "./AranžmanDetalji.css";

const DESTINACIJA_IMAGES = {
  Santorini:
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=90",
  Dubrovnik:
    "https://images.unsplash.com/photo-1555990793-da11153b2473?w=1400&q=90",
  Rim: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1400&q=90",
  Barcelona:
    "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1400&q=90",
  Istanbul:
    "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1400&q=90",
  Pariz:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&q=90",
  "Bečki Alpi":
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=90",
  "Egipat - Hurgada":
    "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1400&q=90",
  Grčka:
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=90",
  Hrvatska:
    "https://images.unsplash.com/photo-1555990793-da11153b2473?w=1400&q=90",
  Italija:
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1400&q=90",
  Španija:
    "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1400&q=90",
  Turska:
    "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1400&q=90",
  Francuska:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&q=90",
  Austrija:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=90",
  Egipat:
    "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1400&q=90",
  default:
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=90",
};

export default function AranžmanDetalji() {
  const { id } = useParams();
  const [aranzman, setAranzman] = useState(null);
  const [destinacija, setDestinacija] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [vodic, setVodic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await aranžmanAPI.getById(id);
        setAranzman(data);
        const [dRes, hRes] = await Promise.all([
          destinacijaAPI.getById(data.destinacija_id).catch(() => null),
          hotelAPI.getById(data.hotel_id).catch(() => null),
        ]);
        if (dRes) setDestinacija(dRes.data);
        if (hRes) setHotel(hRes.data);
        if (data.vodic_id) {
          const vRes = await vodicAPI.getById(data.vodic_id).catch(() => null);
          if (vRes) setVodic(vRes.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading)
    return (
      <div className="loading-state" style={{ paddingTop: 120 }}>
        <div className="loading-spinner" />
        <p>Učitavanje...</p>
      </div>
    );

  if (!aranzman)
    return (
      <div className="page-container" style={{ paddingTop: 120 }}>
        <div className="error-state">Aranžman nije pronađen.</div>
      </div>
    );

  const img =
    DESTINACIJA_IMAGES[destinacija?.naziv] ||
    DESTINACIJA_IMAGES[destinacija?.zemlja] ||
    DESTINACIJA_IMAGES.default;

  return (
    <div className="detalji-page">
      {/* Hero */}
      <div className="detalji-hero">
        <img src={img} alt={aranzman.naziv} className="detalji-hero-img" />
        <div className="detalji-hero-overlay" />
        <div className="detalji-hero-content">
          <Link to="/" className="back-link">
            ← Nazad na aranžmane
          </Link>
          <p className="detalji-eyebrow">
            {destinacija ? `${destinacija.naziv}, ${destinacija.zemlja}` : ""}
          </p>
          <h1 className="detalji-title">{aranzman.naziv}</h1>
          <div className="detalji-hero-meta">
            <span>✈ {aranzman.trajanje} dana</span>
            <span>
              📅 {new Date(aranzman.datumPolaska).toLocaleDateString("sr-RS")} –{" "}
              {new Date(aranzman.datumPovratka).toLocaleDateString("sr-RS")}
            </span>
            <span className="badge badge-gold">{aranzman.tip}</span>
          </div>
        </div>
      </div>

      <div className="page-container detalji-body">
        <div className="detalji-grid">
          {/* Left col */}
          <div className="detalji-main">
            {destinacija && (
              <section className="detalji-section">
                <h2 className="detalji-section-title">O destinaciji</h2>
                <div className="dest-card">
                  <div className="dest-card-header">
                    <span className="dest-flag">📍</span>
                    <div>
                      <h3>{destinacija.naziv}</h3>
                      <p>{destinacija.zemlja}</p>
                    </div>
                  </div>
                  {destinacija.opis && (
                    <p className="dest-opis">{destinacija.opis}</p>
                  )}
                </div>
              </section>
            )}

            {hotel && (
              <section className="detalji-section">
                <h2 className="detalji-section-title">Smeštaj</h2>
                <div className="hotel-card">
                  <div className="hotel-stars">
                    {"★".repeat(parseInt(hotel.zvezdice) || 4)}
                  </div>
                  <h3 className="hotel-name">{hotel.naziv}</h3>
                  <p className="hotel-adresa">📍 {hotel.adresa}</p>
                </div>
              </section>
            )}

            {vodic && (
              <section className="detalji-section">
                <h2 className="detalji-section-title">Turistički vodič</h2>
                <div className="vodic-card">
                  <div className="vodic-avatar">
                    {vodic.ime[0]}
                    {vodic.prezime[0]}
                  </div>
                  <div>
                    <h3>
                      {vodic.ime} {vodic.prezime}
                    </h3>
                    <p>🌐 Jezici: {vodic.jezici}</p>
                    <p>✦ {vodic.specijalizacija}</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right col - booking widget */}
          <div className="detalji-sidebar">
            <div className="booking-widget">
              <p className="booking-eyebrow">Cena po osobi</p>
              <div className="booking-price">
                <span className="booking-price-amount">
                  {Number(aranzman.cena).toLocaleString("sr-RS")}
                </span>
                <span className="booking-price-currency">RSD</span>
              </div>
              <div className="booking-details">
                <div className="booking-row">
                  <span>Trajanje</span>
                  <strong>{aranzman.trajanje} dana</strong>
                </div>
                <div className="booking-row">
                  <span>Polazak</span>
                  <strong>
                    {new Date(aranzman.datumPolaska).toLocaleDateString(
                      "sr-RS",
                    )}
                  </strong>
                </div>
                <div className="booking-row">
                  <span>Povratak</span>
                  <strong>
                    {new Date(aranzman.datumPovratka).toLocaleDateString(
                      "sr-RS",
                    )}
                  </strong>
                </div>
                <div className="booking-row">
                  <span>Tip</span>
                  <strong>{aranzman.tip}</strong>
                </div>
              </div>
              <Link
                to={`/rezervacija?aranzman=${aranzman.id}`}
                className="btn-primary booking-btn"
              >
                Rezerviši ovaj aranžman
              </Link>
              <p className="booking-note">
                Besplatno otkazivanje do 7 dana pre polaska
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
