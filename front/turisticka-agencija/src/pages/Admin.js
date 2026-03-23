import React, { useState, useEffect, useCallback } from "react";
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
      if (initial?.[f.name] !== undefined) {
        def[f.name] = initial[f.name];
      } else if (f.type === "select") {
        def[f.name] = f.options[0];
      } else {
        def[f.name] = "";
      }
    });
    return def;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalized = {};
    entity.fields.forEach((f) => {
      const val = form[f.name];
      if (f.type === "number") {
        normalized[f.name] =
          val === "" || val === null || val === undefined ? null : Number(val);
      } else if (f.type === "date" && val) {
        const d = new Date(val);
        normalized[f.name] = d.toISOString().split("T")[0];
      } else {
        normalized[f.name] = val === "" ? null : val;
      }
    });
    onSave(normalized);
  };

  return (
    <form onSubmit={handleSubmit} className="entity-form">
      <h3 className="entity-form-title">
        {initial ? "Uredi" : "Novi"} {entity.label.slice(0, -1)}
      </h3>
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
          Sačuvaj
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Otkaži
        </button>
      </div>
    </form>
  );
}

function EntityTable({ entity, data, onEdit, onDelete }) {
  if (!data.length)
    return (
      <div className="empty-state" style={{ padding: "40px 0" }}>
        <p className="empty-icon">✦</p>
        <p>Nema podataka</p>
      </div>
    );

  const cols = entity.fields.slice(0, 4);

  return (
    <div className="table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            {cols.map((f) => (
              <th key={f.name}>{f.label}</th>
            ))}
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td className="id-cell">#{row.id}</td>
              {cols.map((f) => (
                <td key={f.name}>
                  {f.type === "select" ? (
                    <span
                      className={`badge ${row[f.name] === "POTVRDJENO" ? "badge-sage" : row[f.name] === "OTKAZANO" ? "badge-terra" : "badge-gold"}`}
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
    </div>
  );
}

export default function Admin() {
  const [activeEntity, setActiveEntity] = useState(ENTITIES[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await activeEntity.api.getAll();
      setData(res.data || []);
    } catch {
      showToast("Greška pri učitavanju.", "error");
    } finally {
      setLoading(false);
    }
  }, [activeEntity]);

  useEffect(() => {
    setData([]);
    setShowForm(false);
    setEditRow(null);
    loadData();
  }, [loadData]);

  const handleSave = async (form) => {
    try {
      if (editRow) {
        await activeEntity.api.update(editRow.id, form);
        showToast("✓ Uspešno ažurirano!");
      } else {
        await activeEntity.api.create(form);
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
      await activeEntity.api.delete(id);
      showToast("✓ Obrisano.");
      loadData();
    } catch {
      showToast("Greška pri brisanju.", "error");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <p className="admin-sidebar-label">Admin Panel</p>
        </div>
        {ENTITIES.map((e) => (
          <button
            key={e.key}
            className={`sidebar-item ${activeEntity.key === e.key ? "active" : ""}`}
            onClick={() => setActiveEntity(e)}
          >
            <span className="sidebar-icon">{e.icon}</span>
            <span>{e.label}</span>
            {activeEntity.key === e.key && data.length > 0 && (
              <span className="sidebar-count">{data.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">
              {activeEntity.icon} {activeEntity.label}
            </h1>
            <p className="admin-subtitle">{data.length} zapisa</p>
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

        {showForm && (
          <div className="form-panel">
            <EntityForm
              entity={activeEntity}
              initial={editRow}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditRow(null);
              }}
            />
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Učitavanje...</p>
          </div>
        ) : (
          <EntityTable
            entity={activeEntity}
            data={data}
            onEdit={(row) => {
              setEditRow(row);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </div>

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
