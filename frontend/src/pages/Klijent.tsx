import React from "react";
import { TableBlock } from "../components/runtime/TableBlock";

const Klijent: React.FC = () => {
  return (
    <div id="page-klijent-0">
    <div id="i7d8f" style={{"display": "flex", "height": "100vh", "fontFamily": "Arial, sans-serif", "--chart-color-palette": "default"}}>
      <nav id="iu7tk" style={{"width": "250px", "background": "linear-gradient(135deg, #4b3c82 0%, #5a3d91 100%)", "color": "white", "padding": "20px", "overflowY": "auto", "display": "flex", "flexDirection": "column", "--chart-color-palette": "default"}}>
        <h2 id="i59xk" style={{"marginTop": "0", "fontSize": "24px", "marginBottom": "30px", "fontWeight": "bold", "--chart-color-palette": "default"}}>{"BESSER"}</h2>
        <div id="idu8c" style={{"display": "flex", "flexDirection": "column", "flex": "1", "--chart-color-palette": "default"}}>
          <a id="ihgbi" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "rgba(255,255,255,0.2)", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/klijent">{"Klijent"}</a>
          <a id="igjoo" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/destinacija">{"Destinacija"}</a>
          <a id="itnkg" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/hotel">{"Hotel"}</a>
          <a id="iveem" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/aranzman">{"Aranzman"}</a>
          <a id="iueap" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/rezervacija">{"Rezervacija"}</a>
          <a id="i2tgi" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/vodic">{"Vodic"}</a>
          <a id="i1iud" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/racun">{"Racun"}</a>
        </div>
        <p id="iqk84" style={{"marginTop": "auto", "paddingTop": "20px", "borderTop": "1px solid rgba(255,255,255,0.2)", "fontSize": "11px", "opacity": "0.8", "textAlign": "center", "--chart-color-palette": "default"}}>{"© 2026 BESSER. All rights reserved."}</p>
      </nav>
      <main id="ir91b" style={{"flex": "1", "padding": "40px", "overflowY": "auto", "background": "#f5f5f5", "--chart-color-palette": "default"}}>
        <h1 id="i3z9v" style={{"marginTop": "0", "color": "#333", "fontSize": "32px", "marginBottom": "10px", "--chart-color-palette": "default"}}>{"Klijent"}</h1>
        <p id="iprzf" style={{"color": "#666", "marginBottom": "30px", "--chart-color-palette": "default"}}>{"Manage Klijent data"}</p>
        <TableBlock id="table-klijent-0" styles={{"width": "auto", "height": "auto", "padding": "0", "margin": "0", "position": "static", "textAlign": "left", "zIndex": 0, "backgroundColor": "#2c3e50", "--chart-color-palette": "default"}} title="Klijent List" options={{"showHeader": true, "stripedRows": false, "showPagination": true, "rowsPerPage": 5, "actionButtons": true, "columns": [{"label": "Ime", "column_type": "field", "field": "ime", "type": "str", "required": true}, {"label": "Prezime", "column_type": "field", "field": "prezime", "type": "str", "required": true}, {"label": "Email", "column_type": "field", "field": "email", "type": "str", "required": true}, {"label": "Telefon", "column_type": "field", "field": "telefon", "type": "str", "required": true}, {"label": "DatumRodjenja", "column_type": "field", "field": "datumRodjenja", "type": "date", "required": true}], "formColumns": [{"column_type": "field", "field": "ime", "label": "ime", "type": "str", "required": true, "defaultValue": null}, {"column_type": "field", "field": "prezime", "label": "prezime", "type": "str", "required": true, "defaultValue": null}, {"column_type": "field", "field": "email", "label": "email", "type": "str", "required": true, "defaultValue": null}, {"column_type": "field", "field": "telefon", "label": "telefon", "type": "str", "required": true, "defaultValue": null}, {"column_type": "field", "field": "datumRodjenja", "label": "datumRodjenja", "type": "date", "required": true, "defaultValue": null}, {"column_type": "lookup", "path": "rezervacija", "field": "rezervacija", "lookup_field": "datumRezervacije", "entity": "Rezervacija", "type": "list", "required": false}, {"column_type": "lookup", "path": "racun", "field": "racun", "lookup_field": "brojRacuna", "entity": "Racun", "type": "list", "required": false}]}} dataBinding={{"entity": "Klijent", "endpoint": "/klijent/"}} />
      </main>
    </div>    </div>
  );
};

export default Klijent;
