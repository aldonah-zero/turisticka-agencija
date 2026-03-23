import React from "react";
import { TableBlock } from "../components/runtime/TableBlock";

const Destinacija: React.FC = () => {
  return (
    <div id="page-destinacija-1">
    <div id="i4xi2" style={{"display": "flex", "height": "100vh", "fontFamily": "Arial, sans-serif", "--chart-color-palette": "default"}}>
      <nav id="in05v" style={{"width": "250px", "background": "linear-gradient(135deg, #4b3c82 0%, #5a3d91 100%)", "color": "white", "padding": "20px", "overflowY": "auto", "display": "flex", "flexDirection": "column", "--chart-color-palette": "default"}}>
        <h2 id="iuusg" style={{"marginTop": "0", "fontSize": "24px", "marginBottom": "30px", "fontWeight": "bold", "--chart-color-palette": "default"}}>{"BESSER"}</h2>
        <div id="i8vbj" style={{"display": "flex", "flexDirection": "column", "flex": "1", "--chart-color-palette": "default"}}>
          <a id="i4no7" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/klijent">{"Klijent"}</a>
          <a id="ixq3t" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "rgba(255,255,255,0.2)", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/destinacija">{"Destinacija"}</a>
          <a id="i042b" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/hotel">{"Hotel"}</a>
          <a id="iqld9" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/aranzman">{"Aranzman"}</a>
          <a id="icwmj" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/rezervacija">{"Rezervacija"}</a>
          <a id="iprgz" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/vodic">{"Vodic"}</a>
          <a id="izd1y" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/racun">{"Racun"}</a>
        </div>
        <p id="ij19y" style={{"marginTop": "auto", "paddingTop": "20px", "borderTop": "1px solid rgba(255,255,255,0.2)", "fontSize": "11px", "opacity": "0.8", "textAlign": "center", "--chart-color-palette": "default"}}>{"© 2026 BESSER. All rights reserved."}</p>
      </nav>
      <main id="iqke7" style={{"flex": "1", "padding": "40px", "overflowY": "auto", "background": "#f5f5f5", "--chart-color-palette": "default"}}>
        <h1 id="i83rf" style={{"marginTop": "0", "color": "#333", "fontSize": "32px", "marginBottom": "10px", "--chart-color-palette": "default"}}>{"Destinacija"}</h1>
        <p id="iyelk" style={{"color": "#666", "marginBottom": "30px", "--chart-color-palette": "default"}}>{"Manage Destinacija data"}</p>
        <TableBlock id="table-destinacija-1" styles={{"width": "auto", "height": "auto", "padding": "0", "margin": "0", "position": "static", "textAlign": "left", "zIndex": 0, "backgroundColor": "#2c3e50", "--chart-color-palette": "default"}} title="Destinacija List" options={{"showHeader": true, "stripedRows": false, "showPagination": true, "rowsPerPage": 5, "actionButtons": true, "columns": [{"label": "Naziv", "column_type": "field", "field": "naziv", "type": "str", "required": true}, {"label": "Zemlja", "column_type": "field", "field": "zemlja", "type": "str", "required": true}, {"label": "Opis", "column_type": "field", "field": "opis", "type": "str", "required": true}], "formColumns": [{"column_type": "field", "field": "naziv", "label": "naziv", "type": "str", "required": true, "defaultValue": null}, {"column_type": "field", "field": "zemlja", "label": "zemlja", "type": "str", "required": true, "defaultValue": null}, {"column_type": "field", "field": "opis", "label": "opis", "type": "str", "required": true, "defaultValue": null}]}} dataBinding={{"entity": "Destinacija", "endpoint": "/destinacija/"}} />
      </main>
    </div>    </div>
  );
};

export default Destinacija;
