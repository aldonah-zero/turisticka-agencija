import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { aranžmanAPI, destinacijaAPI } from "../api";
import "./Home.css";

const TIP_CONFIG = {
  LETOVANJE: { label: "Letovanje", icon: "☀️", badge: "badge-yellow" },
  ZIMOVANJE: { label: "Zimovanje", icon: "⛷️", badge: "badge-blue" },
  CITY_BREAK: { label: "City Break", icon: "🏙️", badge: "badge-teal" },
  KRSTARENJE: { label: "Krstarenje", icon: "🚢", badge: "badge-blue" },
};

const DEST_IMAGES = {
  Santorini:
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&q=85",
  Dubrovnik:
    "https://images.unsplash.com/photo-1555990793-da11153b2473?w=700&q=85",
  Rim: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=700&q=85",
  Barcelona:
    "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=700&q=85",
  Istanbul:
    "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=700&q=85",
  Pariz:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=700&q=85",
  "Bečki Alpi":
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=85",
  "Egipat - Hurgada":
    "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=700&q=85",
  default:
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=85",
};

function getImage(naziv, zemlja) {
  return DEST_IMAGES[naziv] || DEST_IMAGES[zemlja] || DEST_IMAGES.default;
}

function StarRating({ score = 8.5 }) {
  return (
    <div className="rating-box">
      <span className="rating-score">{score}</span>
      <div className="rating-text">
        <span className="rating-label">
          {score >= 9 ? "Odlično" : score >= 8 ? "Sjajno" : "Vrlo dobro"}
        </span>
        <span className="rating-count">· 124 recenzije</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [aranzmani, setAranzmani] = useState([]);
  const [destinacije, setDestinacije] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("SVE");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    async function load() {
      try {
        const [aRes, dRes] = await Promise.all([
          aranžmanAPI.getAll(),
          destinacijaAPI.getAll(),
        ]);
        setAranzmani(aRes.data || []);
        const dMap = {};
        (dRes.data || []).forEach((d) => {
          dMap[d.id] = d;
        });
        setDestinacije(dMap);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  let filtered = aranzmani.filter((a) => {
    const matchTip = filter === "SVE" || a.tip === filter;
    const matchSearch =
      !search || a.naziv?.toLowerCase().includes(search.toLowerCase());
    return matchTip && matchSearch;
  });

  if (sortBy === "cena-asc")
    filtered = [...filtered].sort((a, b) => a.cena - b.cena);
  if (sortBy === "cena-desc")
    filtered = [...filtered].sort((a, b) => b.cena - a.cena);
  if (sortBy === "trajanje")
    filtered = [...filtered].sort((a, b) => a.trajanje - b.trajanje);

  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"
            alt=""
          />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content page-container">
          <p className="hero-eyebrow">Više od 200 destinacija worldwide</p>
          <h1 className="hero-title">
            Pronađite savršen odmor
            <br />
            po najboljim cenama
          </h1>
          <p className="hero-sub">
            Letovanja, city breakovi, zimovanja i krstarenja — sve na jednom
            mestu.
          </p>

          {/* Search bar */}
          <div className="hero-search">
            <div className="search-field">
              <span className="search-field-icon">📍</span>
              <input
                type="text"
                placeholder="Kuda putujete? (Santorini, Rim...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input-hero"
              />
            </div>
            <div className="search-field search-field-sm">
              <span className="search-field-icon">🗂</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="search-input-hero"
              >
                <option value="SVE">Sve kategorije</option>
                <option value="LETOVANJE">☀️ Letovanje</option>
                <option value="ZIMOVANJE">⛷️ Zimovanje</option>
                <option value="CITY_BREAK">🏙️ City Break</option>
                <option value="KRSTARENJE">🚢 Krstarenje</option>
              </select>
            </div>
            <button className="search-btn">🔍 Pretraži</button>
          </div>

          {/* Quick stats */}
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>500+</strong>
              <span>aranžmana</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>80+</strong>
              <span>destinacija</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>98%</strong>
              <span>zadovoljnih klijenata</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTERS BAR ── */}
      <div className="filters-bar">
        <div className="page-container filters-bar-inner">
          <div className="filter-chips">
            {["SVE", "LETOVANJE", "ZIMOVANJE", "CITY_BREAK", "KRSTARENJE"].map(
              (t) => (
                <button
                  key={t}
                  className={`filter-chip ${filter === t ? "active" : ""}`}
                  onClick={() => setFilter(t)}
                >
                  {t === "SVE"
                    ? "🌐 Sve"
                    : `${TIP_CONFIG[t].icon} ${TIP_CONFIG[t].label}`}
                </button>
              ),
            )}
          </div>
          <div className="sort-select-wrap">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Sortiraj: Preporučeno</option>
              <option value="cena-asc">Cena: Najniža prvo</option>
              <option value="cena-desc">Cena: Najviša prvo</option>
              <option value="trajanje">Trajanje</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── RESULTS ── */}
      <section className="results-section">
        <div className="page-container">
          <div className="results-header">
            <h2 className="results-title">
              {filter === "SVE" ? "Svi aranžmani" : TIP_CONFIG[filter]?.label}
              {!loading && (
                <span className="results-count">
                  {filtered.length} pronađenih
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Učitavanje ponude...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Nema rezultata</h3>
              <p>Pokušajte sa drugačijim filterima ili pretragom.</p>
              <button
                className="btn-secondary"
                onClick={() => {
                  setFilter("SVE");
                  setSearch("");
                }}
              >
                Resetuj filtere
              </button>
            </div>
          ) : (
            <div className="cards-list">
              {filtered.map((a, i) => {
                const dest = destinacije[a.destinacija_id];
                const tip = TIP_CONFIG[a.tip] || {
                  label: a.tip,
                  icon: "✈️",
                  badge: "badge-blue",
                };
                const img = getImage(dest?.naziv, dest?.zemlja);
                const rating = (8.0 + (a.id % 20) * 0.1).toFixed(1);
                const oldPrice = Math.round(a.cena * 1.15);

                return (
                  <Link
                    to={`/aranzman/${a.id}`}
                    key={a.id}
                    className="card"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="card-img-wrap">
                      <img src={img} alt={a.naziv} loading="lazy" />
                      <span className={`badge ${tip.badge} card-tip-badge`}>
                        {tip.icon} {tip.label}
                      </span>
                      <button
                        className="wishlist-btn"
                        onClick={(e) => e.preventDefault()}
                      >
                        ♡
                      </button>
                    </div>
                    <div className="card-body">
                      <div className="card-top">
                        <div className="card-main">
                          <div className="card-dest">
                            <span>📍</span>
                            {dest ? `${dest.naziv}, ${dest.zemlja}` : "—"}
                          </div>
                          <h3 className="card-title">{a.naziv}</h3>
                          <div className="card-meta-row">
                            <span className="card-meta-item">
                              🗓 {a.trajanje}{" "}
                              {a.trajanje === 1 ? "dan" : "dana"}
                            </span>
                            <span className="card-meta-item">
                              ✈️{" "}
                              {new Date(a.datumPolaska).toLocaleDateString(
                                "sr-RS",
                                { day: "numeric", month: "short" },
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="card-rating">
                          <StarRating score={parseFloat(rating)} />
                        </div>
                      </div>
                      <div className="card-bottom">
                        <div className="card-price-block">
                          <span className="card-old-price">
                            {oldPrice.toLocaleString("sr-RS")} RSD
                          </span>
                          <div className="card-price">
                            {Number(a.cena).toLocaleString("sr-RS")}{" "}
                            <span>RSD</span>
                          </div>
                          <span className="card-price-note">
                            po osobi, uklj. poreze
                          </span>
                        </div>
                        <span className="card-cta-btn">Vidi ponudu →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="why-section">
        <div className="page-container">
          <h2 className="why-title">Zašto odabrati Adriatica?</h2>
          <div className="why-grid">
            {[
              {
                icon: "🏷️",
                title: "Najniže cene",
                desc: "Garantujemo najniže cene ili vraćamo razliku.",
              },
              {
                icon: "🔒",
                title: "Sigurna rezervacija",
                desc: "Vaši podaci su zaštićeni SSL enkripcijom.",
              },
              {
                icon: "📞",
                title: "Podrška 24/7",
                desc: "Naš tim je uvek tu — čak i usred odmora.",
              },
              {
                icon: "🔄",
                title: "Besplatno otkazivanje",
                desc: "Promenili ste planove? Otkazujte bez naknade.",
              },
            ].map((w, i) => (
              <div key={i} className="why-card">
                <div className="why-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
