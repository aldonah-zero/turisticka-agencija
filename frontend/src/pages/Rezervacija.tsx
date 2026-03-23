import React from "react";
import { TableBlock } from "../components/runtime/TableBlock";

const Rezervacija: React.FC = () => {
  return (
    <div id="page-rezervacija-4">
    <div id="ipkfel" style={{"display": "flex", "height": "100vh", "fontFamily": "Arial, sans-serif", "--chart-color-palette": "default"}}>
      <nav id="i50ihb" style={{"width": "250px", "background": "linear-gradient(135deg, #4b3c82 0%, #5a3d91 100%)", "color": "white", "padding": "20px", "overflowY": "auto", "display": "flex", "flexDirection": "column", "--chart-color-palette": "default"}}>
        <h2 id="iqa4i4" style={{"marginTop": "0", "fontSize": "24px", "marginBottom": "30px", "fontWeight": "bold", "--chart-color-palette": "default"}}>{"BESSER"}</h2>
        <div id="iz8xp5" style={{"display": "flex", "flexDirection": "column", "flex": "1", "--chart-color-palette": "default"}}>
          <a id="ibsg9v" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/klijent">{"Klijent"}</a>
          <a id="ihiy0f" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/destinacija">{"Destinacija"}</a>
          <a id="i4qujw" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/hotel">{"Hotel"}</a>
          <a id="ijmxgp" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/aranzman">{"Aranzman"}</a>
          <a id="igyph1" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "rgba(255,255,255,0.2)", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/rezervacija">{"Rezervacija"}</a>
          <a id="i8jck9" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/vodic">{"Vodic"}</a>
          <a id="iu79wb" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/racun">{"Racun"}</a>
        </div>
        <p id="iti576" style={{"marginTop": "auto", "paddingTop": "20px", "borderTop": "1px solid rgba(255,255,255,0.2)", "fontSize": "11px", "opacity": "0.8", "textAlign": "center", "--chart-color-palette": "default"}}>{"© 2026 BESSER. All rights reserved."}</p>
      </nav>
      <main id="i18iag" style={{"flex": "1", "padding": "40px", "overflowY": "auto", "background": "#f5f5f5", "--chart-color-palette": "default"}}>
        <h1 id="icldch" style={{"marginTop": "0", "color": "#333", "fontSize": "32px", "marginBottom": "10px", "--chart-color-palette": "default"}}>{"Rezervacija"}</h1>
        <p id="i1jr9b" style={{"color": "#666", "marginBottom": "30px", "--chart-color-palette": "default"}}>{"Manage Rezervacija data"}</p>
        <TableBlock id="table-rezervacija-4" styles={{"width": "auto", "height": "auto", "padding": "0", "margin": "0", "position": "static", "textAlign": "left", "zIndex": 0, "backgroundColor": "#2c3e50", "--chart-color-palette": "default"}} title="Rezervacija List" options={{"showHeader": true, "stripedRows": false, "showPagination": true, "rowsPerPage": 5, "actionButtons": true, "columns": [{"label": "DatumRezervacije", "column_type": "field", "field": "datumRezervacije", "type": "date", "required": true}, {"label": "UkupnaCena", "column_type": "field", "field": "ukupnaCena", "type": "float", "required": true}, {"label": "Status", "column_type": "field", "field": "status", "type": "enum", "options": ["NA_CEKANJU", "OTKAZANO", "POTVRDJENO", "ZAVRSENO"], "required": true}], "formColumns": [{"column_type": "field", "field": "datumRezervacije", "label": "datumRezervacije", "type": "date", "required": true, "defaultValue": null}, {"column_type": "field", "field": "ukupnaCena", "label": "ukupnaCena", "type": "float", "required": true, "defaultValue": null}, {"column_type": "field", "field": "status", "label": "status", "type": "enum", "required": true, "defaultValue": null, "options": ["NA_CEKANJU", "OTKAZANO", "POTVRDJENO", "ZAVRSENO"]}, {"column_type": "lookup", "path": "klijent", "field": "klijent", "lookup_field": "ime", "entity": "Klijent", "type": "str", "required": true}, {"column_type": "lookup", "path": "aranzman", "field": "aranzman", "lookup_field": "naziv", "entity": "Aranzman", "type": "str", "required": true}]}} dataBinding={{"entity": "Rezervacija", "endpoint": "/rezervacija/"}} />
      </main>
    </div>    </div>
  );
};

export default Rezervacija;
