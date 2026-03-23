import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { TableProvider } from "./contexts/TableContext";
import Klijent from "./pages/Klijent";
import Destinacija from "./pages/Destinacija";
import Hotel from "./pages/Hotel";
import Aranzman from "./pages/Aranzman";
import Rezervacija from "./pages/Rezervacija";
import Vodic from "./pages/Vodic";
import Racun from "./pages/Racun";

function App() {
  return (
    <TableProvider>
      <div className="app-container">
        <main className="app-main">
          <Routes>
            <Route path="/klijent" element={<Klijent />} />
            <Route path="/destinacija" element={<Destinacija />} />
            <Route path="/hotel" element={<Hotel />} />
            <Route path="/aranzman" element={<Aranzman />} />
            <Route path="/rezervacija" element={<Rezervacija />} />
            <Route path="/vodic" element={<Vodic />} />
            <Route path="/racun" element={<Racun />} />
            <Route path="/" element={<Navigate to="/klijent" replace />} />
            <Route path="*" element={<Navigate to="/klijent" replace />} />
          </Routes>
        </main>
      </div>
    </TableProvider>
  );
}
export default App;
