import React, { useState, useEffect } from "react";
import { racunAPI, klijentAPI, aranžmanAPI } from "../api";
import "./Racuni.css";

const NACIN_ICONS = {
  GOTOVINA: "💵",
  KARTICA: "💳",
  PRENOS: "🏦",
  ONLINE: "🌐",
};

const STATUS_CONFIG = {
  IZDAT: { label: "Izdat", badge: "badge-blue" },
  PLACEN: { label: "Plaćen", badge: "badge-green" },
  OTKAZAN: { label: "Otkazan", badge: "badge-red" },
  KASNI: { label: "Kasni", badge: "badge-yellow" },
};

export default function Racuni() {
  const [racuni, setRacuni] = useState([]);
  const [klijenti, setKlijenti] = useState({});
  const [aranzmani, setAranzmani] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("SVE");
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({
    ukupno: 0,
    placeno: 0,
    ceka: 0,
    kasni: 0,
  });

  const [form, setForm] = useState({
    brojRacuna: "",
    datumIzdavanja: new Date().toISOString().split("T")[0],
    datumDospeca: "",
    iznos: "",
    pdv: "",
    ukupno: "",
    nacin_placanja: "KARTICA",
    status: "IZDAT",
    klijent: "",
    aranzman: "",
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function load() {
      try {
        const [rRes, kRes, aRes] = await Promise.all([
          racunAPI.getAll(),
          klijentAPI.getAll(),
          aranžmanAPI.getAll(),
        ]);
        const racuniData = rRes.data || [];
        setRacuni(racuniData);

        const kMap = {},
          aMap = {};
        (kRes.data || []).forEach((k) => {
          kMap[k.id] = k;
        });
        (aRes.data || []).forEach((a) => {
          aMap[a.id] = a;
        });
        setKlijenti(kMap);
        setAranzmani(aMap);

        // Stats
        const placeno = racuniData
          .filter((r) => r.status === "PLACEN")
          .reduce((s, r) => s + (r.ukupno || 0), 0);
        const ceka = racuniData.filter((r) => r.status === "IZDAT").length;
        const kasni = racuniData.filter((r) => r.status === "KASNI").length;
        setStats({ ukupno: racuniData.length, placeno, ceka, kasni });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Auto-calculate PDV and ukupno
  const handleIznos = (val) => {
    const iznos = parseFloat(val) || 0;
    const pdv = Math.round(iznos * 0.18);
    const ukupno = iznos + pdv;
    setForm((p) => ({
      ...p,
      iznos: val,
      pdv: String(pdv),
      ukupno: String(ukupno),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await racunAPI.create({
        ...form,
        iznos: Number(form.iznos),
        pdv: Number(form.pdv),
        ukupno: Number(form.ukupno),
        klijent_id: Number(form.klijent),
        aranzman_id: Number(form.aranzman),
      });
      showToast("✓ Račun uspešno kreiran!");
      setShowForm(false);
      // Reload
      const rRes = await racunAPI.getAll();
      setRacuni(rRes.data || []);
    } catch (e) {
      showToast("Greška pri kreiranju računa.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Obrisati račun?")) return;
    await racunAPI.delete(id);
    setRacuni((prev) => prev.filter((r) => r.id !== id));
    showToast("✓ Račun obrisan.");
  };

  const filtered = racuni.filter(
    (r) => filterStatus === "SVE" || r.status === filterStatus,
  );

  return (
    <div className="racuni-page">
      {/* Header */}
      <div className="racuni-hero">
        <div className="page-container racuni-hero-inner">
          <div>
            <h1 className="racuni-title">🧾 Računi</h1>
            <p className="racuni-sub">Pregled i upravljanje svim računima</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "✕ Zatvori" : "+ Novi račun"}
          </button>
        </div>
      </div>

      <div className="page-container racuni-body">
        {/* Stats cards */}
        <div className="racuni-stats">
          <div className="stat-card">
            <span className="stat-icon">📄</span>
            <div>
              <strong>{stats.ukupno}</strong>
              <span>Ukupno računa</span>
            </div>
          </div>
          <div className="stat-card stat-card-green">
            <span className="stat-icon">✅</span>
            <div>
              <strong>{stats.placeno.toLocaleString("sr-RS")} RSD</strong>
              <span>Naplaćeno</span>
            </div>
          </div>
          <div className="stat-card stat-card-blue">
            <span className="stat-icon">⏳</span>
            <div>
              <strong>{stats.ceka}</strong>
              <span>Čeka plaćanje</span>
            </div>
          </div>
          <div className="stat-card stat-card-red">
            <span className="stat-icon">⚠️</span>
            <div>
              <strong>{stats.kasni}</strong>
              <span>Kasni</span>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="racun-form-panel">
            <h3 className="form-panel-title">Novi račun</h3>
            <form onSubmit={handleSubmit} className="racun-form">
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Broj računa</label>
                  <input
                    required
                    placeholder="ADR-2025-001"
                    value={form.brojRacuna}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, brojRacuna: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Datum izdavanja</label>
                  <input
                    required
                    type="date"
                    value={form.datumIzdavanja}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, datumIzdavanja: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Datum dospeća</label>
                  <input
                    required
                    type="date"
                    value={form.datumDospeca}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, datumDospeca: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Iznos (RSD)</label>
                  <input
                    required
                    type="number"
                    placeholder="100000"
                    value={form.iznos}
                    onChange={(e) => handleIznos(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>PDV 18% (auto)</label>
                  <input
                    readOnly
                    value={form.pdv}
                    style={{ background: "var(--bg)" }}
                  />
                </div>
                <div className="form-group">
                  <label>Ukupno sa PDV (auto)</label>
                  <input
                    readOnly
                    value={form.ukupno}
                    style={{ background: "var(--bg)", fontWeight: 700 }}
                  />
                </div>
                <div className="form-group">
                  <label>Način plaćanja</label>
                  <select
                    value={form.nacin_placanja}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, nacin_placanja: e.target.value }))
                    }
                  >
                    {["GOTOVINA", "KARTICA", "PRENOS", "ONLINE"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, status: e.target.value }))
                    }
                  >
                    {["IZDAT", "PLACEN", "OTKAZAN", "KASNI"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Klijent ID</label>
                  <select
                    value={form.klijent}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, klijent: e.target.value }))
                    }
                  >
                    <option value="">— Izaberi —</option>
                    {Object.values(klijenti).map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.ime} {k.prezime}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Aranžman</label>
                  <select
                    value={form.aranzman}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, aranzman: e.target.value }))
                    }
                  >
                    <option value="">— Izaberi —</option>
                    {Object.values(aranzmani).map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.naziv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Sačuvaj račun
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Otkaži
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter tabs */}
        <div className="racuni-filters">
          {["SVE", "IZDAT", "PLACEN", "KASNI", "OTKAZAN"].map((s) => (
            <button
              key={s}
              className={`filter-chip ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s === "SVE" ? "Svi" : STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Učitavanje...</p>
          </div>
        ) : (
          <div className="racuni-table-wrap">
            <table className="racuni-table">
              <thead>
                <tr>
                  <th>Broj računa</th>
                  <th>Klijent</th>
                  <th>Aranžman</th>
                  <th>Datum izdavanja</th>
                  <th>Datum dospeća</th>
                  <th>Iznos</th>
                  <th>PDV</th>
                  <th>Ukupno</th>
                  <th>Plaćanje</th>
                  <th>Status</th>
                  <th>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "var(--ink-light)",
                      }}
                    >
                      Nema računa
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => {
                    const k = klijenti[r.klijent_id];
                    const a = aranzmani[r.aranzman_id];
                    const st = STATUS_CONFIG[r.status] || {
                      label: r.status,
                      badge: "badge-blue",
                    };
                    return (
                      <tr key={r.id}>
                        <td>
                          <strong className="racun-broj">{r.brojRacuna}</strong>
                        </td>
                        <td>
                          {k ? `${k.ime} ${k.prezime}` : `#${r.klijent_id}`}
                        </td>
                        <td className="td-aranzman">
                          {a ? a.naziv : `#${r.aranzman_id}`}
                        </td>
                        <td>{r.datumIzdavanja}</td>
                        <td>{r.datumDospeca}</td>
                        <td>{Number(r.iznos).toLocaleString("sr-RS")} RSD</td>
                        <td>{Number(r.pdv).toLocaleString("sr-RS")} RSD</td>
                        <td>
                          <strong>
                            {Number(r.ukupno).toLocaleString("sr-RS")} RSD
                          </strong>
                        </td>
                        <td>
                          {NACIN_ICONS[r.nacin_placanja]} {r.nacin_placanja}
                        </td>
                        <td>
                          <span className={`badge ${st.badge}`}>
                            {st.label}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-danger"
                            onClick={() => handleDelete(r.id)}
                          >
                            Briši
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {filtered.length > 0 && (
                <tfoot>
                  <tr>
                    <td colSpan={7} className="tfoot-label">
                      Ukupno naplaćeno (plaćeni):
                    </td>
                    <td colSpan={4} className="tfoot-total">
                      {filtered
                        .filter((r) => r.status === "PLACEN")
                        .reduce((s, r) => s + (r.ukupno || 0), 0)
                        .toLocaleString("sr-RS")}{" "}
                      RSD
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
