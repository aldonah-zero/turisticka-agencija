import React from "react";
import { TableBlock } from "../components/runtime/TableBlock";

const Hotel: React.FC = () => {
  return (
    <div id="page-hotel-2">
    <div id="if9xf" style={{"display": "flex", "height": "100vh", "fontFamily": "Arial, sans-serif", "--chart-color-palette": "default"}}>
      <nav id="ipit7f" style={{"width": "250px", "background": "linear-gradient(135deg, #4b3c82 0%, #5a3d91 100%)", "color": "white", "padding": "20px", "overflowY": "auto", "display": "flex", "flexDirection": "column", "--chart-color-palette": "default"}}>
        <h2 id="i51d1h" style={{"marginTop": "0", "fontSize": "24px", "marginBottom": "30px", "fontWeight": "bold", "--chart-color-palette": "default"}}>{"BESSER"}</h2>
        <div id="idfb5u" style={{"display": "flex", "flexDirection": "column", "flex": "1", "--chart-color-palette": "default"}}>
          <a id="ici1a6" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/klijent">{"Klijent"}</a>
          <a id="iwew2z" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/destinacija">{"Destinacija"}</a>
          <a id="iprotd" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "rgba(255,255,255,0.2)", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/hotel">{"Hotel"}</a>
          <a id="i7m2yf" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/aranzman">{"Aranzman"}</a>
          <a id="iziwi7" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/rezervacija">{"Rezervacija"}</a>
          <a id="itokqc" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/vodic">{"Vodic"}</a>
          <a id="ioxhga" style={{"color": "white", "textDecoration": "none", "padding": "10px 15px", "display": "block", "background": "transparent", "borderRadius": "4px", "marginBottom": "5px", "--chart-color-palette": "default"}} href="/racun">{"Racun"}</a>
        </div>
        <p id="ijis9j" style={{"marginTop": "auto", "paddingTop": "20px", "borderTop": "1px solid rgba(255,255,255,0.2)", "fontSize": "11px", "opacity": "0.8", "textAlign": "center", "--chart-color-palette": "default"}}>{"© 2026 BESSER. All rights reserved."}</p>
      </nav>
      <main id="i5hbec" style={{"flex": "1", "padding": "40px", "overflowY": "auto", "background": "#f5f5f5", "--chart-color-palette": "default"}}>
        <h1 id="ige5s2" style={{"marginTop": "0", "color": "#333", "fontSize": "32px", "marginBottom": "10px", "--chart-color-palette": "default"}}>{"Hotel"}</h1>
        <p id="ibdcxq" style={{"color": "#666", "marginBottom": "30px", "--chart-color-palette": "default"}}>{"Manage Hotel data"}</p>
        <TableBlock id="table-hotel-2" styles={{"width": "auto", "height": "auto", "padding": "0", "margin": "0", "position": "static", "textAlign": "left", "zIndex": 0, "backgroundColor": "#2c3e50", "--chart-color-palette": "default"}} title="Hotel List" options={{"showHeader": true, "stripedRows": false, "showPagination": true, "rowsPerPage": 5, "actionButtons": true, "columns": [{"label": "Naziv", "column_type": "field", "field": "naziv", "type": "str", "required": true}, {"label": "Zvezdice", "column_type": "field", "field": "zvezdice", "type": "str", "required": true}, {"label": "Adresa", "column_type": "field", "field": "adresa", "type": "str", "required": true}], "formColumns": [{"column_type": "field", "field": "naziv", "label": "naziv", "type": "str", "required": true, "defaultValue": null}, {"column_type": "field", "field": "zvezdice", "label": "zvezdice", "type": "str", "required": true, "defaultValue": null}, {"column_type": "field", "field": "adresa", "label": "adresa", "type": "str", "required": true, "defaultValue": null}]}} dataBinding={{"entity": "Hotel", "endpoint": "/hotel/"}} />
      </main>
    </div>    </div>
  );
};

export default Hotel;
