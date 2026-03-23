import React from "react";
import { TableBlock } from "../components/runtime/TableBlock";

const Vodic: React.FC = () => {
  return (
    <div id="page-vodic-5">
    <div id="i7xn9q" style={{"display": "flex", "height": "100vh", "fontFamily": "Arial, sans-serif", "--chart-color-palette": "default"}}>
      <nav id="iazbkj" style={{"width": "250px", "background": "linear-gradient(135deg, #4b3c82 0%, #5a3d91 100%)", "color": "white", "padding": "20px", "overflowY": "auto", "display": "flex", "flexDirection": "column", "--chart-color-palette": "default"}}>
        <h2 id="i9edrd" style={{"marginTop": "0", "fontSize": "24px", "marginBottom": "30px", "fontWeight": "bold", "--chart-color-palette": "default"}}>{"BESSER"}</h2>
        <div id="iuvoal" style={{"display": "flex", "flexDirection": "column", "flex": "1", "--chart-color-palette": "default"}}>
          <a id="in68h9" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/klijent">{"Klijent"}</a>
          <a id="iiv5kh" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/destinacija">{"Destinacija"}</a>
          <a id="ign1lm" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/hotel">{"Hotel"}</a>
          <a id="iaxk74" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/aranzman">{"Aranzman"}</a>
          <a id="in02yd" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/rezervacija">{"Rezervacija"}</a>
          <a id="icn9ej" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "rgba(255,255,255,0.2)", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/vodic">{"Vodic"}</a>
          <a id="icat6g" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/racun">{"Racun"}</a>
        </div>
        <p id="if8x2i" style={{"marginTop": "auto", "paddingTop": "20px", "borderTop": "1px solid rgba(255,255,255,0.2)", "fontSize": "11px", "opacity": "0.8", "textAlign": "center", "--chart-color-palette": "default"}}>{"© 2026 BESSER. All rights reserved."}</p>
      </nav>
      <main id="igghm3" style={{"flex": "1", "padding": "40px", "overflowY": "auto", "background": "#f5f5f5", "--chart-color-palette": "default"}}>
        <h1 id="i18psz" style={{"marginTop": "0", "color": "#333", "fontSize": "32px", "marginBottom": "10px", "--chart-color-palette": "default"}}>{"Vodic"}</h1>
        <p id="idiaf5" style={{"color": "#666", "marginBottom": "30px", "--chart-color-palette": "default"}}>{"Manage Vodic data"}</p>
        <TableBlock id="table-vodic-5" styles={{"width": "auto", "height": "auto", "padding": "0", "margin": "0", "position": "static", "textAlign": "left", "zIndex": 0, "backgroundColor": "#2c3e50", "--chart-color-palette": "default"}} title="Vodic List" options={{"showHeader": true, "stripedRows": false, "showPagination": true, "rowsPerPage": 5, "actionButtons": true, "columns": [{"label": "Ime", "column_type": "field", "field": "ime", "type": "str", "required": true}, {"label": "Prezime", "column_type": "field", "field": "prezime", "type": "str", "required": true}, {"label": "Jezici", "column_type": "field", "field": "jezici", "type": "str", "required": true}, {"label": "Specijalizacija", "column_type": "field", "field": "specijalizacija", "type": "str", "required": true}], "formColumns": [{"column_type": "field", "field": "ime", "label": "ime", "type": "str", "required": true, "defaultValue": null}, {"column_type": "field", "field": "prezime", "label": "prezime", "type": "str", "required": true, "defaultValue": null}, {"column_type": "field", "field": "jezici", "label": "jezici", "type": "str", "required": true, "defaultValue": null}, {"column_type": "field", "field": "specijalizacija", "label": "specijalizacija", "type": "str", "required": true, "defaultValue": null}]}} dataBinding={{"entity": "Vodic", "endpoint": "/vodic/"}} />
      </main>
    </div>    </div>
  );
};

export default Vodic;
