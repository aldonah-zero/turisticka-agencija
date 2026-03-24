import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  aranžmanAPI,
  klijentAPI,
  rezervacijaAPI,
  hotelAPI,
  destinacijaAPI,
  vodicAPI,
  racunAPI,
} from "../api";
import "./Admin.css";

const PER_PAGE = 10;

const ENTITIES = [
  {
    key: "aranzman",
    label: "Aranžmani",
    api: aranžmanAPI,
    icon: "✈️",
    fields: [
      { name: "naziv", label: "Naziv", type: "text" },
      { name: "cena", label: "Cena", type: "number" },
      { name: "trajanje", label: "Trajanje (dana)", type: "number" },
      { name: "datumPolaska", label: "Datum polaska", type: "date" },
      { name: "datumPovratka", label: "Datum povratka", type: "date" },
      {
        name: "tip",
        label: "Tip",
        type: "select",
        options: ["LETOVANJE", "ZIMOVANJE", "CITY_BREAK", "KRSTARENJE"],
      },
      { name: "destinacija", label: "Destinacija ID", type: "number" },
      { name: "hotel", label: "Hotel ID", type: "number" },
      {
        name: "vodic",
        label: "Vodič ID (opcionalno)",
        type: "number",
        required: false,
      },
    ],
  },
  {
    key: "destinacija",
    label: "Destinacije",
    api: destinacijaAPI,
    icon: "🌍",
    fields: [
      { name: "naziv", label: "Naziv", type: "text" },
      { name: "zemlja", label: "Zemlja", type: "text" },
      { name: "opis", label: "Opis", type: "text" },
    ],
  },
  {
    key: "hotel",
    label: "Hoteli",
    api: hotelAPI,
    icon: "🏨",
    fields: [
      { name: "naziv", label: "Naziv", type: "text" },
      { name: "zvezdice", label: "Zvezdice", type: "number" },
      { name: "adresa", label: "Adresa", type: "text" },
    ],
  },
  {
    key: "vodic",
    label: "Vodiči",
    api: vodicAPI,
    icon: "👤",
    fields: [
      { name: "ime", label: "Ime", type: "text" },
      { name: "prezime", label: "Prezime", type: "text" },
      { name: "jezici", label: "Jezici", type: "text" },
      { name: "specijalizacija", label: "Specijalizacija", type: "text" },
    ],
  },
  {
    key: "klijent",
    label: "Klijenti",
    api: klijentAPI,
    icon: "👥",
    fields: [
      { name: "ime", label: "Ime", type: "text" },
      { name: "prezime", label: "Prezime", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "telefon", label: "Telefon", type: "text" },
      { name: "datumRodjenja", label: "Datum rođenja", type: "date" },
    ],
  },
  {
    key: "racun",
    label: "Računi",
    api: racunAPI,
    icon: "🧾",
    fields: [
      { name: "brojRacuna", label: "Broj računa", type: "text" },
      { name: "datumIzdavanja", label: "Datum izdavanja", type: "date" },
      { name: "datumDospeca", label: "Datum dospeća", type: "date" },
      { name: "iznos", label: "Iznos", type: "number" },
      { name: "pdv", label: "PDV", type: "number" },
      { name: "ukupno", label: "Ukupno", type: "number" },
      {
        name: "nacin_placanja",
        label: "Način plaćanja",
        type: "select",
        options: ["GOTOVINA", "KARTICA", "PRENOS", "ONLINE"],
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["IZDAT", "PLACEN", "OTKAZAN", "KASNI"],
      },
      { name: "klijent_id", label: "Klijent ID", type: "number" },
      { name: "aranzman_id", label: "Aranžman ID", type: "number" },
    ],
  },
  {
    key: "rezervacija",
    label: "Rezervacije",
    api: rezervacijaAPI,
    icon: "📋",
    fields: [
      { name: "datumRezervacije", label: "Datum rezervacije", type: "date" },
      { name: "ukupnaCena", label: "Ukupna cena", type: "number" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["NA_CEKANJU", "POTVRDJENO", "OTKAZANO", "ZAVRSENO"],
      },
      { name: "klijent", label: "Klijent ID", type: "number" },
      { name: "aranzman", label: "Aranžman ID", type: "number" },
    ],
  },
];

function EntityForm({ entity, initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => {
    const def = {};
    entity.fields.forEach((f) => {
      if (initial?.[f.name] !== undefined) def[f.name] = initial[f.name];
      else if (f.type === "select") def[f.name] = f.options[0];
      else def[f.name] = "";
    });
    return def;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const out = {};
    entity.fields.forEach((f) => {
      const v = form[f.name];
      if (f.type === "number")
        out[f.name] = v === "" || v == null ? null : Number(v);
      else if (f.type === "date" && v)
        out[f.name] = new Date(v).toISOString().split("T")[0];
      else out[f.name] = v === "" ? null : v;
    });
    onSave(out);
  };

  return (
    <form onSubmit={handleSubmit} className="entity-form">
      <div className="entity-form-header">
        <h3 className="entity-form-title">
          {initial ? "✏️ Uredi" : "➕ Novi"} {entity.label.slice(0, -1)}
        </h3>
        <button type="button" className="form-close-btn" onClick={onCancel}>
          ✕
        </button>
      </div>
      <div className="entity-form-grid">
        {entity.fields.map((f) => (
          <div key={f.name} className="form-group">
            <label>{f.label}</label>
            {f.type === "select" ? (
              <select
                value={form[f.name]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [f.name]: e.target.value }))
                }
              >
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={f.type}
                value={form[f.name]}
                required={f.required !== false}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [f.name]: e.target.value }))
                }
              />
            )}
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          💾 Sačuvaj
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Otkaži
        </button>
      </div>
    </form>
  );
}

function Pagination({ page, total, perPage, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="admin-pagination">
      <button
        className="pg-btn"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ←
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
        const show = Math.abs(p - page) <= 2 || p === 1 || p === pages;
        if (!show)
          return p === page - 3 || p === page + 3 ? (
            <span key={p} className="pg-dots">
              …
            </span>
          ) : null;
        return (
          <button
            key={p}
            className={`pg-btn ${p === page ? "active" : ""}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        );
      })}
      <button
        className="pg-btn"
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
      >
        →
      </button>
      <span className="pg-info">
        {total} zapisa · str. {page}/{pages}
      </span>
    </div>
  );
}

function EntityTable({ entity, data, onEdit, onDelete, page, onPageChange }) {
  const cols = entity.fields.slice(0, 4);
  const paginated = data.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (!data.length)
    return (
      <div className="admin-empty">
        <div className="admin-empty-icon">{entity.icon}</div>
        <h3>Nema podataka</h3>
        <p>Dodajte prvi zapis klikom na dugme iznad.</p>
      </div>
    );

  return (
    <div className="table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: 60 }}>ID</th>
            {cols.map((f) => (
              <th key={f.name}>{f.label}</th>
            ))}
            <th style={{ width: 140 }}>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((row) => (
            <tr key={row.id}>
              <td className="id-cell">#{row.id}</td>
              {cols.map((f) => (
                <td key={f.name}>
                  {f.type === "select" ? (
                    <span
                      className={`abadge ${
                        row[f.name] === "POTVRDJENO" || row[f.name] === "PLACEN"
                          ? "abadge-green"
                          : row[f.name] === "OTKAZANO" ||
                              row[f.name] === "KASNI"
                            ? "abadge-red"
                            : "abadge-blue"
                      }`}
                    >
                      {row[f.name]}
                    </span>
                  ) : (
                    String(row[f.name] ?? "—").slice(0, 40)
                  )}
                </td>
              ))}
              <td className="actions-cell">
                <button className="btn-edit" onClick={() => onEdit(row)}>
                  Uredi
                </button>
                <button className="btn-danger" onClick={() => onDelete(row.id)}>
                  Briši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-footer">
        <Pagination
          page={page}
          total={data.length}
          perPage={PER_PAGE}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
}

export default function Admin() {
  const [activeKey, setActiveKey] = useState("aranzman");
  const [counts, setCounts] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);

  const entity = ENTITIES.find((e) => e.key === activeKey);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load counts for all entities on mount
  useEffect(() => {
    ENTITIES.forEach(async (e) => {
      try {
        const res = await e.api.getAll();
        setCounts((prev) => ({ ...prev, [e.key]: (res.data || []).length }));
      } catch {}
    });
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setPage(1);
    try {
      const res = await entity.api.getAll();
      setData(res.data || []);
    } catch {
      showToast("Greška pri učitavanju.", "error");
    } finally {
      setLoading(false);
    }
  }, [entity]);

  useEffect(() => {
    setData([]);
    setShowForm(false);
    setEditRow(null);
    loadData();
  }, [loadData]);

  const handleSave = async (form) => {
    try {
      if (editRow) {
        await entity.api.update(editRow.id, form);
        showToast("✓ Uspešno ažurirano!");
      } else {
        await entity.api.create(form);
        showToast("✓ Uspešno kreirano!");
      }
      setShowForm(false);
      setEditRow(null);
      loadData();
    } catch {
      showToast("Greška pri čuvanju.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Da li ste sigurni?")) return;
    try {
      await entity.api.delete(id);
      showToast("✓ Obrisano.");
      loadData();
    } catch {
      showToast("Greška pri brisanju.", "error");
    }
  };

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-back-btn">
            ← Nazad na sajt
          </Link>
          <p className="admin-sidebar-label">Admin Panel</p>
        </div>
        {ENTITIES.map((e) => (
          <button
            key={e.key}
            className={`sidebar-item ${activeKey === e.key ? "active" : ""}`}
            onClick={() => setActiveKey(e.key)}
          >
            <span className="sidebar-icon">{e.icon}</span>
            <span>{e.label}</span>
            {counts[e.key] > 0 && (
              <span
                className={`sidebar-count ${activeKey === e.key ? "active" : ""}`}
              >
                {counts[e.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-left">
            <div className="admin-entity-icon">{entity.icon}</div>
            <div>
              <h1 className="admin-title">{entity.label}</h1>
              <p className="admin-subtitle">{data.length} zapisa u bazi</p>
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditRow(null);
            }}
          >
            + Dodaj novi
          </button>
        </div>

        {/* Entity cards quick nav */}
        <div className="entity-cards">
          {ENTITIES.map((e) => (
            <button
              key={e.key}
              className={`entity-card ${activeKey === e.key ? "active" : ""}`}
              onClick={() => setActiveKey(e.key)}
            >
              <span className="ec-icon">{e.icon}</span>
              <span className="ec-label">{e.label}</span>
              {counts[e.key] > 0 && (
                <span className="ec-count">{counts[e.key]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <div className="form-panel">
            <EntityForm
              entity={entity}
              initial={editRow}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditRow(null);
              }}
            />
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Učitavanje...</p>
          </div>
        ) : (
          <EntityTable
            entity={entity}
            data={data}
            onEdit={(row) => {
              setEditRow(row);
              setShowForm(true);
            }}
            onDelete={handleDelete}
            page={page}
            onPageChange={setPage}
          />
        )}
      </div>

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
