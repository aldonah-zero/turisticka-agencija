import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { rezervacijaAPI, klijentAPI, aranžmanAPI } from "../api";
import "./Rezervacija.css";

const STATUS_OPTIONS = ["NA_CEKANJU", "POTVRDJENO", "OTKAZANO", "ZAVRSENO"];

export default function Rezervacija() {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("aranzman");

  const [aranzmani, setAranzmani] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [klijentData, setKlijentData] = useState({
    ime: "",
    prezime: "",
    email: "",
    telefon: "",
    datumRodjenja: "",
  });

  const [rezData, setRezData] = useState({
    datumRezervacije: new Date().toISOString().split("T")[0],
    ukupnaCena: "",
    status: "NA_CEKANJU",
    aranzman_id: preselectedId || "",
  });

  useEffect(() => {
    aranžmanAPI.getAll().then((r) => {
      setAranzmani(r.data || []);
      if (preselectedId) {
        const found = r.data.find(
          (a) => String(a.id) === String(preselectedId),
        );
        if (found) setRezData((prev) => ({ ...prev, ukupnaCena: found.cena }));
      }
    });
  }, [preselectedId]);

  const handleAranzmanChange = (e) => {
    const id = e.target.value;
    const found = aranzmani.find((a) => String(a.id) === String(id));
    setRezData((prev) => ({
      ...prev,
      aranzman_id: id,
      ukupnaCena: found?.cena || "",
    }));
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // First create klijent, then rezervacija
      const kRes = await klijentAPI.create(klijentData);
      const klijentId = kRes.data.id;
      await rezervacijaAPI.create({
        datumRezervacije: rezData.datumRezervacije,
        ukupnaCena: rezData.ukupnaCena,
        status: rezData.status,
        aranzman: rezData.aranzman_id, // BESSER ocekuje 'aranzman' ne 'aranzman_id'
        klijent: klijentId, // BESSER ocekuje 'klijent' ne 'klijent_id'
      });
      showToast("✓ Rezervacija uspešno kreirana!");
      setStep(3);
    } catch (err) {
      showToast("Greška pri kreiranju rezervacije.", "error");
    } finally {
      setLoading(false);
    }
  };

  const selectedAranzman = aranzmani.find(
    (a) => String(a.id) === String(rezData.aranzman_id),
  );

  return (
    <div className="rez-page">
      <div className="rez-hero">
        <div className="rez-hero-bg" />
        <div className="rez-hero-content">
          <p className="section-subtitle">Online rezervacija</p>
          <h1 className="section-title">
            Rezervišite
            <br />
            <em>vaše putovanje</em>
          </h1>
        </div>
      </div>

      <div className="page-container rez-body">
        {step < 3 ? (
          <div className="rez-layout">
            {/* Steps indicator */}
            <div className="steps-indicator">
              {["Lični podaci", "Detalji rezervacije"].map((s, i) => (
                <div
                  key={i}
                  className={`step-item ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}
                >
                  <div className="step-num">{step > i + 1 ? "✓" : i + 1}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="rez-form">
              {/* Step 1 */}
              {step === 1 && (
                <div className="form-step">
                  <h2 className="form-step-title">Vaši podaci</h2>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Ime</label>
                      <input
                        required
                        value={klijentData.ime}
                        onChange={(e) =>
                          setKlijentData((p) => ({ ...p, ime: e.target.value }))
                        }
                        placeholder="Marko"
                      />
                    </div>
                    <div className="form-group">
                      <label>Prezime</label>
                      <input
                        required
                        value={klijentData.prezime}
                        onChange={(e) =>
                          setKlijentData((p) => ({
                            ...p,
                            prezime: e.target.value,
                          }))
                        }
                        placeholder="Petrović"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email adresa</label>
                    <input
                      required
                      type="email"
                      value={klijentData.email}
                      onChange={(e) =>
                        setKlijentData((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="marko@email.com"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Telefon</label>
                      <input
                        required
                        value={klijentData.telefon}
                        onChange={(e) =>
                          setKlijentData((p) => ({
                            ...p,
                            telefon: e.target.value,
                          }))
                        }
                        placeholder="+381 60 123 4567"
                      />
                    </div>
                    <div className="form-group">
                      <label>Datum rođenja</label>
                      <input
                        required
                        type="date"
                        value={klijentData.datumRodjenja}
                        onChange={(e) =>
                          setKlijentData((p) => ({
                            ...p,
                            datumRodjenja: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setStep(2)}
                  >
                    Nastavi →
                  </button>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="form-step">
                  <h2 className="form-step-title">Detalji rezervacije</h2>
                  <div className="form-group">
                    <label>Aranžman</label>
                    <select
                      required
                      value={rezData.aranzman_id}
                      onChange={handleAranzmanChange}
                    >
                      <option value="">— Izaberite aranžman —</option>
                      {aranzmani.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.naziv} — {Number(a.cena).toLocaleString()} RSD
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Datum rezervacije</label>
                      <input
                        required
                        type="date"
                        value={rezData.datumRezervacije}
                        onChange={(e) =>
                          setRezData((p) => ({
                            ...p,
                            datumRezervacije: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Ukupna cena (RSD)</label>
                      <input
                        required
                        type="number"
                        value={rezData.ukupnaCena}
                        onChange={(e) =>
                          setRezData((p) => ({
                            ...p,
                            ukupnaCena: e.target.value,
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={rezData.status}
                      onChange={(e) =>
                        setRezData((p) => ({ ...p, status: e.target.value }))
                      }
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setStep(1)}
                    >
                      ← Nazad
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Kreiranje..." : "Potvrdi rezervaciju ✓"}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Summary */}
            {selectedAranzman && (
              <div className="rez-summary">
                <p className="summary-label">Izabrani aranžman</p>
                <h3 className="summary-name">{selectedAranzman.naziv}</h3>
                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Trajanje</span>
                    <strong>{selectedAranzman.trajanje} dana</strong>
                  </div>
                  <div className="summary-row">
                    <span>Polazak</span>
                    <strong>
                      {new Date(
                        selectedAranzman.datumPolaska,
                      ).toLocaleDateString("sr-RS")}
                    </strong>
                  </div>
                  <div className="summary-row">
                    <span>Tip</span>
                    <strong>{selectedAranzman.tip}</strong>
                  </div>
                  <div className="summary-row total">
                    <span>Cena</span>
                    <strong>
                      {Number(selectedAranzman.cena).toLocaleString("sr-RS")}{" "}
                      RSD
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Success state */
          <div className="success-state">
            <div className="success-icon">✓</div>
            <h2>Rezervacija potvrđena!</h2>
            <p>
              Vaša rezervacija je uspešno kreirana. Uskoro ćete dobiti potvrdu
              na email.
            </p>
            <div className="success-actions">
              <Link to="/" className="btn-primary">
                Istraži još aranžmana
              </Link>
              <button
                className="btn-secondary"
                onClick={() => {
                  setStep(1);
                  setKlijentData({
                    ime: "",
                    prezime: "",
                    email: "",
                    telefon: "",
                    datumRodjenja: "",
                  });
                  setRezData({
                    datumRezervacije: new Date().toISOString().split("T")[0],
                    ukupnaCena: "",
                    status: "NA_CEKANJU",
                    aranzman_id: "",
                  });
                }}
              >
                Nova rezervacija
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
