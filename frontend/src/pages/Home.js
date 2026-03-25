import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { aranžmanAPI, destinacijaAPI } from "../api";

const PER_PAGE = 6;

const TIP = {
  LETOVANJE: {
    label: "Letovanje",
    icon: "☀️",
    color: "#E8540A",
    glow: "rgba(232,84,10,0.18)",
    bg: "rgba(232,84,10,0.08)",
  },
  ZIMOVANJE: {
    label: "Zimovanje",
    icon: "⛷️",
    color: "#2563EB",
    glow: "rgba(37,99,235,0.18)",
    bg: "rgba(37,99,235,0.08)",
  },
  CITY_BREAK: {
    label: "City Break",
    icon: "🏙️",
    color: "#059669",
    glow: "rgba(5,150,105,0.18)",
    bg: "rgba(5,150,105,0.08)",
  },
  KRSTARENJE: {
    label: "Krstarenje",
    icon: "🚢",
    color: "#7C3AED",
    glow: "rgba(124,58,237,0.18)",
    bg: "rgba(124,58,237,0.08)",
  },
};

const IMGS = {
  Santorini:
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=900&q=90",
  Dubrovnik:
    "https://images.unsplash.com/photo-1555990793-da11153b2473?w=900&q=90",
  Rim: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&q=90",
  Barcelona:
    "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=900&q=90",
  Istanbul:
    "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=900&q=90",
  Pariz:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=90",
  "Bečki Alpi":
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=90",
  "Egipat - Hurgada":
    "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=900&q=90",
  default:
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=90",
};
const getImg = (naziv, zemlja) => IMGS[naziv] || IMGS[zemlja] || IMGS.default;

function Card({ a, dest, index }) {
  const [hov, setHov] = useState(false);
  const [fav, setFav] = useState(false);
  const tip = TIP[a.tip] || {
    label: a.tip,
    icon: "✈️",
    color: "#0040FF",
    glow: "rgba(0,64,255,0.15)",
    bg: "rgba(0,64,255,0.08)",
  };
  const img = getImg(dest?.naziv, dest?.zemlja);
  const score = (8.0 + (a.id % 20) * 0.1).toFixed(1);
  const msrp = Math.round(a.cena * 1.22);
  const save = Math.round((1 - a.cena / msrp) * 100);
  const dep = new Date(a.datumPolaska).toLocaleDateString("sr-RS", {
    day: "numeric",
    month: "short",
  });

  return (
    <Link
      to={`/aranzman/${a.id}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`card-link ${hov ? "card-hov" : ""}`}
      style={{
        display: "flex",
        textDecoration: "none",
        color: "inherit",
        background: "#fff",
        borderRadius: 24,
        border: `1.5px solid ${hov ? "#C7D2FE" : "#EAEDF5"}`,
        overflow: "hidden",
        transition:
          "transform 0.38s cubic-bezier(.22,1,.36,1), box-shadow 0.38s cubic-bezier(.22,1,.36,1), border-color 0.22s",
        transform: hov
          ? "translateY(-4px) scale(1.005)"
          : "translateY(0) scale(1)",
        boxShadow: hov
          ? "0 32px 72px rgba(0,40,200,0.11), 0 8px 24px rgba(0,0,0,0.06)"
          : "0 2px 12px rgba(10,13,26,0.05)",
        animationDelay: `${index * 0.07}s`,
      }}
    >
      {/* Image — className allows CSS override on mobile */}
      <div
        className="card-img"
        style={{
          position: "relative",
          width: 280,
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <img
          src={img}
          alt={a.naziv}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.65s cubic-bezier(.22,1,.36,1)",
            transform: hov ? "scale(1.10)" : "scale(1.02)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.02) 40%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Tip chip */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            padding: "5px 13px",
            borderRadius: 100,
            fontSize: 11,
            fontWeight: 800,
            color: tip.color,
            fontFamily: "'Outfit',sans-serif",
            boxShadow: `0 4px 16px ${tip.glow}`,
            display: "flex",
            alignItems: "center",
            gap: 5,
            border: `1px solid ${tip.bg}`,
            transition: "transform 0.22s",
            transform: hov ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          <span style={{ fontSize: 12 }}>{tip.icon}</span>
          {tip.label}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setFav((v) => !v);
          }}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            background: fav ? "#FEF2F2" : "rgba(255,255,255,0.92)",
            border: `1.5px solid ${fav ? "#FCA5A5" : "rgba(255,255,255,0.4)"}`,
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            color: fav ? "#EF4444" : "#94A3B8",
            transition: "all 0.25s cubic-bezier(.34,1.56,.64,1)",
            transform: fav ? "scale(1.2)" : "scale(1)",
            backdropFilter: "blur(8px)",
            boxShadow: fav
              ? "0 4px 14px rgba(239,68,68,0.25)"
              : "0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          {fav ? "♥" : "♡"}
        </button>

        {/* Save badge */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 14,
            background: "linear-gradient(135deg, #DC2626, #EF4444)",
            color: "#fff",
            fontSize: 10,
            fontWeight: 900,
            fontFamily: "'Outfit',sans-serif",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            padding: "5px 11px",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(220,38,38,0.35)",
          }}
        >
          -{save}%
        </div>

        {/* Duration */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            right: 14,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "'Outfit',sans-serif",
            padding: "5px 11px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          🌙 {a.trajanje}n
        </div>
      </div>

      {/* Body */}
      <div
        className="card-body"
        style={{
          flex: 1,
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minWidth: 0,
        }}
      >
        <div>
          {/* Location */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#0040FF",
              fontFamily: "'Outfit',sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 18,
                height: 18,
                background: "#EEF2FF",
                borderRadius: "50%",
                fontSize: 9,
              }}
            >
              📍
            </span>
            {dest ? `${dest.naziv}, ${dest.zemlja}` : "—"}
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: "'Khand',sans-serif",
              fontSize: 23,
              fontWeight: 700,
              color: "#0A0D1A",
              marginBottom: 14,
              lineHeight: 1.12,
              letterSpacing: "-0.01em",
              transition: "color 0.2s",
              ...(hov ? { color: "#001FC2" } : {}),
            }}
          >
            {a.naziv}
          </h3>

          {/* Tags */}
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {[
              {
                ico: "🗓",
                txt: `${a.trajanje} ${a.trajanje === 1 ? "dan" : "dana"}`,
              },
              { ico: "✈️", txt: dep },
              { ico: "👥", txt: "Slobodna mesta" },
            ].map((t, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6B7394",
                  background: "#F4F5FB",
                  border: "1.5px solid #EAEDF5",
                  padding: "5px 12px",
                  borderRadius: 100,
                  whiteSpace: "nowrap",
                  fontFamily: "'Outfit',sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "border-color 0.2s, background 0.2s",
                  ...(hov
                    ? { borderColor: "#C7D2FE", background: "#EEF2FF" }
                    : {}),
                }}
              >
                <span style={{ fontSize: 10 }}>{t.ico}</span> {t.txt}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="card-footer-row"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingTop: 18,
            marginTop: 18,
            borderTop: "1px solid #EAEDF5",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {/* Price */}
          <div>
            <span
              style={{
                fontSize: 11,
                color: "#B0B6C8",
                textDecoration: "line-through",
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              {msrp.toLocaleString("sr-RS")} RSD
            </span>
            <div
              style={{
                fontFamily: "'Khand',sans-serif",
                fontSize: 30,
                fontWeight: 700,
                color: "#0A0D1A",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                marginTop: 2,
              }}
            >
              {Number(a.cena).toLocaleString("sr-RS")}
              <span
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#9CA3B8",
                  marginLeft: 5,
                }}
              >
                RSD
              </span>
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#16A34A",
                fontWeight: 800,
                marginTop: 4,
                fontFamily: "'Outfit',sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 14,
                  background: "#DCFCE7",
                  borderRadius: "50%",
                  textAlign: "center",
                  lineHeight: "14px",
                  fontSize: 9,
                }}
              >
                ✓
              </span>
              UKLJ. SVI POREZI
            </div>
          </div>

          {/* Score + CTA */}
          <div
            className="card-cta-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "10px 10px 10px 3px",
                  background:
                    parseFloat(score) >= 9
                      ? "linear-gradient(135deg, #0040FF, #4F46E5)"
                      : "linear-gradient(135deg, #0040FF, #2563EB)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  marginTop: 12,
                  fontWeight: 800,
                  color: "#fff",
                  fontFamily: "'Khand',sans-serif",
                  letterSpacing: "-0.02em",
                  boxShadow: "0 4px 14px rgba(0,64,255,0.3)",
                  transition: "transform 0.2s",
                  transform: hov ? "scale(1.05)" : "scale(1)",
                }}
              >
                {score}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#9CA3B8",
                  marginTop: 4,
                  fontWeight: 600,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                {parseFloat(score) >= 9
                  ? "Odlično"
                  : parseFloat(score) >= 8
                    ? "Sjajno"
                    : "Dobro"}
              </div>
            </div>
            <div
              style={{
                background: hov
                  ? "linear-gradient(135deg, #002CCB, #0040FF)"
                  : "linear-gradient(135deg, #0040FF, #1A56FF)",
                color: "#fff",
                padding: "12px 22px",
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "'Khand',sans-serif",
                transition: "all 0.28s cubic-bezier(.22,1,.36,1)",
                transform: hov ? "translateX(4px)" : "translateX(0)",
                boxShadow: hov
                  ? "0 10px 28px rgba(0,64,255,0.45)"
                  : "0 4px 16px rgba(0,64,255,0.28)",
                display: "flex",
                alignItems: "center",
                gap: 7,
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
              }}
            >
              Vidi ponudu{" "}
              <span
                style={{
                  display: "inline-block",
                  transition: "transform 0.22s",
                  transform: hov ? "translateX(3px)" : "translateX(0)",
                }}
              >
                →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Pagination({ page, total, perPage, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 52,
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        style={{
          width: 40,
          height: 40,
          borderRadius: 11,
          border: `1.5px solid ${page === 1 ? "#F0F2F8" : "#E0E4F0"}`,
          background: page === 1 ? "#F8F9FC" : "#fff",
          color: page === 1 ? "#CBD5E1" : "#4B5168",
          fontSize: 15,
          fontWeight: 700,
          cursor: page === 1 ? "not-allowed" : "pointer",
          fontFamily: "'Khand',sans-serif",
          transition: "all 0.18s",
        }}
      >
        ←
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
        const isActive = p === page;
        const show = Math.abs(p - page) <= 2 || p === 1 || p === pages;
        if (!show)
          return p === page - 3 || p === page + 3 ? (
            <span
              key={p}
              style={{
                color: "#C0C8DA",
                padding: "0 2px",
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              …
            </span>
          ) : null;
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              border: isActive ? "none" : "1.5px solid #E0E4F0",
              background: isActive
                ? "linear-gradient(135deg, #0040FF, #1A56FF)"
                : "#fff",
              color: isActive ? "#fff" : "#4B5168",
              fontSize: 15,
              fontWeight: isActive ? 700 : 500,
              cursor: "pointer",
              fontFamily: "'Khand',sans-serif",
              boxShadow: isActive
                ? "0 6px 18px rgba(0,64,255,0.32)"
                : "0 2px 8px rgba(0,0,0,0.04)",
              transition: "all 0.22s cubic-bezier(.22,1,.36,1)",
              transform: isActive ? "scale(1.07)" : "scale(1)",
            }}
          >
            {p}
          </button>
        );
      })}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        style={{
          width: 40,
          height: 40,
          borderRadius: 11,
          border: `1.5px solid ${page === pages ? "#F0F2F8" : "#E0E4F0"}`,
          background: page === pages ? "#F8F9FC" : "#fff",
          color: page === pages ? "#CBD5E1" : "#4B5168",
          fontSize: 15,
          fontWeight: 700,
          cursor: page === pages ? "not-allowed" : "pointer",
          fontFamily: "'Khand',sans-serif",
          transition: "all 0.18s",
        }}
      >
        →
      </button>
    </div>
  );
}

function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);
  return [count, ref];
}

function StatItem({ number, suffix, label }) {
  const [count, ref] = useCounter(parseInt(number));
  return (
    <div ref={ref} className="hstat">
      <div className="hstat-n">
        {count}
        {suffix}
      </div>
      <div className="hstat-l">{label}</div>
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
  const [page, setPage] = useState(1);
  const [heroVisible, setHeroVisible] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [aR, dR] = await Promise.all([
          aranžmanAPI.getAll(),
          destinacijaAPI.getAll(),
        ]);
        setAranzmani(aR.data || []);
        const m = {};
        (dR.data || []).forEach((d) => {
          m[d.id] = d;
        });
        setDestinacije(m);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter, search, sortBy]);

  let filtered = aranzmani.filter(
    (a) =>
      (filter === "SVE" || a.tip === filter) &&
      (!search || a.naziv?.toLowerCase().includes(search.toLowerCase())),
  );
  if (sortBy === "cena-asc")
    filtered = [...filtered].sort((a, b) => a.cena - b.cena);
  if (sortBy === "cena-desc")
    filtered = [...filtered].sort((a, b) => b.cena - a.cena);
  if (sortBy === "trajanje")
    filtered = [...filtered].sort((a, b) => a.trajanje - b.trajanje);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const handlePage = useCallback((p) => {
    setPage(p);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Khand:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,900;1,9..144,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .home-root { font-family:'Outfit',system-ui,sans-serif; background:#EFF1F8; min-height:100vh; }

        /* ── HERO ── */
        .hero-bg { position:absolute; inset:0; overflow:hidden; }
        .hero { position:relative; min-height:520px; display:flex; align-items:center; justify-content:center; padding:88px 0 80px; }
        .hero-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 60%; transition:transform 8s ease-out; }
        .hero-img.visible { transform:scale(1.04); }
        .hero-dark { position:absolute; inset:0; background:linear-gradient(115deg,rgba(2,4,22,0.97) 0%,rgba(4,10,50,0.82) 35%,rgba(0,18,60,0.50) 62%,rgba(0,0,0,0.18) 100%); }
        .hero-noise { position:absolute; inset:0; opacity:0.03; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size:200px; }
        .hero-slice { position:absolute; bottom:-2px; left:0; right:0; background:#EFF1F8; clip-path:polygon(0 60%,100% 0%,100% 100%,0 100%); }
        .hero-inner { position:relative; z-index:2; max-width:860px; margin:0 auto; padding:0 24px; width:100%; text-align:center; }

        .h-fade { opacity:0; transform:translateY(28px); transition:opacity 0.7s ease, transform 0.7s ease; }
        .h-fade.vis { opacity:1; transform:translateY(0); }
        .h-fade-1{transition-delay:0.05s;} .h-fade-2{transition-delay:0.18s;}
        .h-fade-3{transition-delay:0.30s;} .h-fade-4{transition-delay:0.44s;}
        .h-fade-5{transition-delay:0.56s;}

        .hero-eye { display:inline-flex; align-items:center; gap:10px; font-size:10px; font-weight:800; letter-spacing:0.20em; text-transform:uppercase; color:#F5C842; margin-bottom:16px; }
        .hero-eye::before,.hero-eye::after { content:''; width:24px; height:2px; background:linear-gradient(90deg,#F5C842,transparent); border-radius:1px; display:block; }
        .hero-eye::after { background:linear-gradient(90deg,transparent,#F5C842); }

        .hero-h1 { font-family:'Khand',sans-serif; font-size:clamp(2rem,5vw,4.2rem); font-weight:700; color:#fff; line-height:1.04; letter-spacing:-0.01em; margin-bottom:14px; }
        .hero-h1 em { font-style:italic; font-family:'Fraunces',serif; color:#F5C842; background:linear-gradient(135deg,#F5C842,#FFAD3B); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .hero-sub { font-size:15px; color:rgba(255,255,255,0.62); max-width:520px; line-height:1.78; font-weight:400; margin-bottom:32px; margin-left:auto; margin-right:auto; }

        /* ── SEARCH ── */
        .hero-search { background:rgba(255,255,255,0.97); backdrop-filter:blur(20px); border-radius:16px; display:flex; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.28),0 0 0 1px rgba(255,255,255,0.15); width:100%; max-width:700px; height:58px; margin:0 auto; border:1.5px solid rgba(255,255,255,0.2); }
        .sf { flex:1; display:flex; align-items:center; gap:9px; padding:0 18px; border-right:1px solid #EEF0F8; min-width:0; }
        .sf-inner { flex:1; padding:10px 0; min-width:0; }
        .sf-lbl { font-size:9px; font-weight:800; letter-spacing:0.16em; text-transform:uppercase; color:#A0ABBB; margin-bottom:3px; font-family:'Outfit',sans-serif; }
        .sf input,.sf select { border:none !important; outline:none !important; box-shadow:none !important; background:transparent; font-size:14px; font-weight:600; color:#0A0D1A; width:100%; font-family:'Outfit',sans-serif; padding:0; }
        .sf input::placeholder { color:#C8CEDE; font-weight:400; }
        .sf.sm { flex:0 0 176px; }
        .sgo { flex-shrink:0; padding:0 28px; background:#0DB6A0; color:#fff; border:none; cursor:pointer; font-family:'Khand',sans-serif; font-size:16px; font-weight:700; letter-spacing:0.03em; transition:background 0.22s; display:flex; align-items:center; gap:8px; border-radius:0 14px 14px 0; }
        .sgo:hover { background:#0aa390; }

        .hero-stats { display:flex; gap:40px; margin-top:28px; justify-content:center; flex-wrap:wrap; }
        .hstat-n { font-family:'Khand',sans-serif; font-size:28px; font-weight:700; color:#F5C842; letter-spacing:-0.02em; line-height:1; }
        .hstat-l { font-size:11px; color:rgba(255,255,255,0.40); margin-top:3px; font-weight:500; letter-spacing:0.02em; }

        /* ── FILTER BAR ── */
        .fbar-outer { display:flex; justify-content:center; padding:0 32px; margin-top:-28px; position:relative; z-index:50; }
        .fbar { background:rgba(255,255,255,0.97); backdrop-filter:blur(14px); border:1.5px solid #EAEDF5; border-radius:16px; position:sticky; top:16px; box-shadow:0 8px 32px rgba(0,40,200,0.10), 0 2px 12px rgba(0,0,0,0.06); width:100%; max-width:960px; }
        .fin { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 20px; flex-wrap:wrap; }
        .chips { display:flex; gap:8px; flex-wrap:wrap; }
        .chip { display:inline-flex; align-items:center; gap:6px; padding:7px 18px; border-radius:100px; border:1.5px solid #E4E6EF; background:#fff; color:#4B5168; font-family:'Khand',sans-serif; font-size:15px; font-weight:600; cursor:pointer; transition:all 0.2s cubic-bezier(.22,1,.36,1); white-space:nowrap; letter-spacing:0.01em; }
        .chip:hover { border-color:#0040FF; color:#0040FF; background:#F0F4FF; transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,64,255,0.10); }
        .chip.on { background:linear-gradient(135deg,#0040FF,#1A56FF); border-color:#0040FF; color:#fff; box-shadow:0 6px 18px rgba(0,64,255,0.28); transform:translateY(-1px); }
        .sort-sel { padding:9px 16px; border:1.5px solid #E4E6EF; border-radius:11px; font-size:13px; font-weight:600; color:#4B5168; cursor:pointer; font-family:'Outfit',sans-serif; outline:none; background:#fff; transition:border-color 0.18s,box-shadow 0.18s; flex-shrink:0; }
        .sort-sel:hover { border-color:#0040FF; box-shadow:0 0 0 3px rgba(0,64,255,0.06); }

        /* ── RESULTS ── */
        .results { padding:56px 0 100px; }
        .res-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; flex-wrap:wrap; gap:10px; }
        .res-title { font-family:'Khand',sans-serif; font-size:28px; font-weight:700; color:#0A0D1A; letter-spacing:-0.02em; }
        .res-badge { font-size:12px; font-weight:800; color:#0040FF; background:linear-gradient(135deg,#EEF2FF,#E8EEFF); padding:5px 14px; border-radius:100px; margin-left:12px; font-family:'Outfit',sans-serif; border:1.5px solid #C7D2FE; }
        .res-info { font-size:13px; color:#9CA3B8; font-weight:500; font-family:'Outfit',sans-serif; }
        .cards-list { display:flex; flex-direction:column; gap:16px; }

        @keyframes cardAppear { from{opacity:0;transform:translateY(28px) scale(0.99);}to{opacity:1;transform:translateY(0) scale(1);} }
        .ca { animation:cardAppear 0.5s cubic-bezier(.22,1,.36,1) both; }

        .spin-wrap { text-align:center; padding:100px 0; }
        @keyframes sp { to{transform:rotate(360deg)} }
        .spin { width:46px; height:46px; border:3px solid #EEF2FF; border-top-color:#0040FF; border-radius:50%; animation:sp .8s linear infinite; margin:0 auto 16px; }
        .spin-wrap p { font-size:14px; color:#9CA3B8; font-family:'Outfit',sans-serif; }

        .empty { text-align:center; padding:100px 32px; background:#fff; border-radius:24px; border:1.5px solid #EAEDF5; }
        .empty h3 { font-family:'Khand',sans-serif; font-size:26px; font-weight:700; margin-bottom:10px; color:#0A0D1A; }
        .empty p { color:#9CA3B8; font-size:14px; margin-bottom:28px; font-family:'Outfit',sans-serif; line-height:1.7; }
        .rbtn { background:linear-gradient(135deg,#EEF2FF,#E8EEFF); color:#0040FF; border:1.5px solid #C7D2FE; padding:12px 28px; border-radius:12px; font-weight:700; font-size:15px; cursor:pointer; font-family:'Khand',sans-serif; transition:all 0.2s; }
        .rbtn:hover { background:linear-gradient(135deg,#E0E8FF,#D8E4FF); transform:translateY(-2px); box-shadow:0 6px 18px rgba(0,64,255,0.12); }

        /* ── WHY ── */
        .why { background:linear-gradient(160deg,#040915 0%,#050D22 60%,#071228 100%); padding:100px 0; position:relative; overflow:hidden; }
        .why::before { content:''; position:absolute; top:-200px; right:-200px; width:600px; height:600px; background:radial-gradient(circle,rgba(0,64,255,0.07) 0%,transparent 70%); pointer-events:none; }
        .why-eye { display:inline-flex; align-items:center; gap:10px; font-size:10px; font-weight:800; letter-spacing:0.20em; text-transform:uppercase; color:#F5C842; margin-bottom:16px; font-family:'Outfit',sans-serif; }
        .why-eye::before { content:''; width:20px; height:2px; background:linear-gradient(90deg,#F5C842,transparent); border-radius:1px; }
        .why-t { font-family:'Khand',sans-serif; font-size:clamp(2rem,3.5vw,3.2rem); font-weight:700; color:#fff; letter-spacing:-0.02em; line-height:1.05; margin-bottom:12px; }
        .why-s { font-size:14px; color:rgba(255,255,255,0.32); margin-bottom:52px; max-width:420px; line-height:1.8; font-family:'Outfit',sans-serif; }
        .why-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:16px; }
        .wc { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:22px; padding:30px 26px; transition:all 0.32s cubic-bezier(.22,1,.36,1); position:relative; overflow:hidden; }
        .wc::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#0040FF,#6366F1,#8B5CF6); transform:scaleX(0); transform-origin:left; transition:transform 0.38s ease; border-radius:2px; }
        .wc:hover { background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.12); transform:translateY(-6px); box-shadow:0 24px 48px rgba(0,0,0,0.2); }
        .wc:hover::before { transform:scaleX(1); }
        .wi { width:52px; height:52px; border-radius:15px; background:rgba(0,64,255,0.12); display:flex; align-items:center; justify-content:center; font-size:23px; margin-bottom:20px; border:1px solid rgba(0,64,255,0.16); transition:transform 0.28s cubic-bezier(.34,1.56,.64,1); }
        .wc:hover .wi { transform:scale(1.12) rotate(-4deg); }
        .wc h3 { font-family:'Khand',sans-serif; font-size:19px; font-weight:700; color:#F1F5F9; margin-bottom:9px; }
        .wc p { font-size:13px; color:rgba(255,255,255,0.34); line-height:1.75; font-family:'Outfit',sans-serif; }

        /* ── MOBILE ── */
        @media(max-width:640px) {
          /* Hero */
          .hero { min-height:460px; padding:72px 0 60px; }
          .hero-sub { font-size:13px; margin-bottom:22px; }
          .hero-search { flex-direction:column; height:auto; border-radius:14px; }
          .sf { border-right:none; border-bottom:1px solid #EEF0F8; }
          .sf.sm { flex:unset; width:100%; }
          .sgo { padding:14px 16px; justify-content:center; border-radius:0 0 12px 12px; }
          .hero-stats { gap:20px; }

          /* Filter bar */
          .fbar-outer { padding:0 12px; margin-top:-16px; }
          .fin { flex-direction:column; align-items:flex-start; gap:10px; padding:10px 14px; }
          .chips { gap:6px; }
          .chip { font-size:13px; padding:5px 12px; }
          .sort-sel { width:100%; }

          /* Results */
          .results { padding:32px 0 60px; }

          /* ── CARD MOBILE FIX ── */
          .card-link {
            flex-direction: column !important;
          }
          .card-img {
            width: 100% !important;
            height: 200px !important;
            flex-shrink: unset !important;
          }
          .card-img img {
            height: 200px;
          }
          .card-body {
            padding: 18px 18px 20px !important;
          }
          .card-footer-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .card-cta-row {
            width: 100%;
            justify-content: space-between;
          }

          /* Why */
          .why { padding:60px 0; }
          .why-grid { grid-template-columns:1fr; }
        }

        @media(max-width:400px) {
          .chip { font-size:12px; padding:5px 10px; }
          .card-img { height: 180px !important; }
          .card-img img { height: 180px; }
        }
      `}</style>

      <div className="home-root">
        {/* HERO */}
        <section className="hero">
          <div className="hero-bg">
            <img
              className={`hero-img ${heroVisible ? "visible" : ""}`}
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1900&q=85"
              alt=""
            />
            <div className="hero-dark" />
            <div className="hero-noise" />
            <div className="hero-slice" />
          </div>
          <div className="hero-inner">
            <div
              className={`hero-eye h-fade h-fade-1 ${heroVisible ? "vis" : ""}`}
            >
              Više od 200 destinacija worldwide
            </div>
            <h1
              className={`hero-h1 h-fade h-fade-2 ${heroVisible ? "vis" : ""}`}
            >
              Pronađite savršen odmor
              <br />
              po <em>najboljim cenama</em>
            </h1>
            <p
              className={`hero-sub h-fade h-fade-3 ${heroVisible ? "vis" : ""}`}
            >
              Letovanja, city breakovi, zimovanja i krstarenja — sve na jednom
              mestu.
            </p>

            <div
              className={`hero-search h-fade h-fade-4 ${heroVisible ? "vis" : ""}`}
            >
              <div className="sf">
                <svg
                  width="15"
                  height="15"
                  fill="none"
                  viewBox="0 0 17 17"
                  style={{ flexShrink: 0, opacity: 0.35 }}
                >
                  <path
                    d="M8.5 2C6.015 2 4 4.015 4 6.5c0 3.375 4.5 8.5 4.5 8.5S13 9.875 13 6.5C13 4.015 10.985 2 8.5 2z"
                    stroke="#0A0D1A"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="8.5"
                    cy="6.5"
                    r="1.5"
                    stroke="#0A0D1A"
                    strokeWidth="1.3"
                  />
                </svg>
                <div className="sf-inner">
                  <div className="sf-lbl">Destinacija</div>
                  <input
                    type="text"
                    placeholder="Kuda putujete? (Santorini, Rim...)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="sf sm">
                <svg
                  width="15"
                  height="15"
                  fill="none"
                  viewBox="0 0 16 16"
                  style={{ flexShrink: 0, opacity: 0.35 }}
                >
                  <rect
                    x="2"
                    y="3"
                    width="12"
                    height="11"
                    rx="2.5"
                    stroke="#0A0D1A"
                    strokeWidth="1.3"
                  />
                  <path d="M2 7h12" stroke="#0A0D1A" strokeWidth="1.3" />
                  <path
                    d="M5 1.5v3M11 1.5v3"
                    stroke="#0A0D1A"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="sf-inner">
                  <div className="sf-lbl">Kategorija</div>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="SVE">Sve kategorije</option>
                    {Object.entries(TIP).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.icon} {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                className="sgo"
                onClick={() =>
                  resultsRef.current?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 15 15">
                  <circle
                    cx="6"
                    cy="6"
                    r="4.5"
                    stroke="white"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M11 11l2.8 2.8"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                Pretraži
              </button>
            </div>

            <div
              className={`hero-stats h-fade h-fade-5 ${heroVisible ? "vis" : ""}`}
            >
              <StatItem number="500" suffix="+" label="aranžmana" />
              <StatItem number="80" suffix="+" label="destinacija" />
              <StatItem number="98" suffix="%" label="zadovoljnih klijenata" />
            </div>
          </div>
        </section>

        {/* FILTER BAR */}
        <div className="fbar-outer">
          <div className="fbar">
            <div className="fin">
              <div className="chips">
                <button
                  className={`chip ${filter === "SVE" ? "on" : ""}`}
                  onClick={() => setFilter("SVE")}
                >
                  🌐 Sve
                </button>
                {Object.entries(TIP).map(([k, v]) => (
                  <button
                    key={k}
                    className={`chip ${filter === k ? "on" : ""}`}
                    onClick={() => setFilter(k)}
                  >
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>
              <select
                className="sort-sel"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Preporučeno</option>
                <option value="cena-asc">Najjeftinije</option>
                <option value="cena-desc">Najskuplje</option>
                <option value="trajanje">Trajanje</option>
              </select>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <section className="results" ref={resultsRef} id="results">
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 16px" }}>
            <div className="res-hdr">
              <div>
                <span className="res-title">
                  {filter === "SVE" ? "Svi aranžmani" : TIP[filter]?.label}
                </span>
                {!loading && (
                  <span className="res-badge">{filtered.length} rezultata</span>
                )}
              </div>
              {!loading && filtered.length > 0 && (
                <div className="res-info">
                  Stranica {page} od {totalPages}
                </div>
              )}
            </div>

            {loading ? (
              <div className="spin-wrap">
                <div className="spin" />
                <p>Učitavanje ponude...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty">
                <div style={{ fontSize: "3.5rem", marginBottom: 18 }}>🔍</div>
                <h3>Nema rezultata</h3>
                <p>Pokušajte sa drugačijim filterima ili pretragom.</p>
                <button
                  className="rbtn"
                  onClick={() => {
                    setFilter("SVE");
                    setSearch("");
                  }}
                >
                  Resetuj filtere
                </button>
              </div>
            ) : (
              <>
                <div className="cards-list">
                  {paginated.map((a, i) => (
                    <div
                      key={a.id}
                      className="ca"
                      style={{ animationDelay: `${i * 0.065}s` }}
                    >
                      <Card
                        a={a}
                        dest={destinacije[a.destinacija_id]}
                        index={i}
                      />
                    </div>
                  ))}
                </div>
                <Pagination
                  page={page}
                  total={filtered.length}
                  perPage={PER_PAGE}
                  onChange={handlePage}
                />
              </>
            )}
          </div>
        </section>

        {/* WHY */}
        <section className="why">
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
            <div className="why-eye">Zašto Adriatica</div>
            <h2 className="why-t">
              Putujte bez brige,
              <br />
              mi brinemo o svemu
            </h2>
            <p className="why-s">
              15 godina iskustva, hiljade zadovoljnih klijenata i podrška koja
              ne spava.
            </p>
            <div className="why-grid">
              {[
                {
                  ico: "🏷️",
                  t: "Garantovane cene",
                  d: "Najniže cene na tržištu — ili vraćamo razliku bez pitanja.",
                },
                {
                  ico: "🔒",
                  t: "Sigurna rezervacija",
                  d: "SSL enkripcija i višeslojna zaštita svakog plaćanja.",
                },
                {
                  ico: "📞",
                  t: "Podrška 24/7/365",
                  d: "Naš tim je tu čak i kad ste usred odmora.",
                },
                {
                  ico: "🔄",
                  t: "Fleksibilno otkazivanje",
                  d: "Promenili ste planove? Otkazivanje bez naknade.",
                },
              ].map((w, i) => (
                <div
                  key={i}
                  className="wc"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="wi">{w.ico}</div>
                  <h3>{w.t}</h3>
                  <p>{w.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
