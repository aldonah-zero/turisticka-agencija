import React from "react";
import { ChartBlock } from "../components/runtime/ChartBlock";
import { MetricCardBlock } from "../components/runtime/MetricCardBlock";

const Home: React.FC = () => {
  return (
    <div id="gvfTfnul3BcvOhwZ">
    <div id="im4i0j" className="gjs-row" style={{"width": "100%", "height": "auto", "padding": "0", "margin": "0", "position": "static", "textAlign": "left", "zIndex": 0, "--chart-color-palette": "default", "display": "flex", "paddingTop": "10px", "paddingRight": "10px", "paddingBottom": "10px", "paddingLeft": "10px", "flexWrap": "wrap"}} />
    <div id="i59dal" className="gjs-row" style={{"width": "100%", "height": "auto", "padding": "0", "margin": "0", "position": "static", "textAlign": "left", "zIndex": 0, "--chart-color-palette": "default", "display": "flex", "paddingTop": "10px", "paddingRight": "10px", "paddingBottom": "10px", "paddingLeft": "10px", "flexWrap": "wrap"}}>
      <div id="container_cell" className="gjs-cell" style={{"height": "75px", "padding": "0", "margin": "0", "position": "static", "textAlign": "left", "zIndex": 0, "--chart-color-palette": "default", "flex": "1 1 calc(33.333% - 20px)", "minWidth": "250px"}} />
    </div>
    <section id="ikojcg" style={{"padding": "60px 20px", "--chart-color-palette": "default"}}>
      <div id="i4zsa6" style={{"maxWidth": "1200px", "margin": "0 auto", "--chart-color-palette": "default"}}>
        <div id="il3br" style={{"padding": "20px", "backgroundColor": "#4b3c82", "--chart-color-palette": "default"}}>
          <div id="i6deg" style={{"maxWidth": "1400px", "margin": "0 auto", "--chart-color-palette": "default"}}>
            <div id="ij1n3" style={{"marginBottom": "30px"}}>
              <p id="icued" style={{"color": "rgba(255,255,255,0.8)", "margin": "0", "--chart-color-palette": "default"}}>{"Real-time insights and metrics"}</p>
            </div>
            <div id="inzkw" className="kpi-row" style={{"display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(250px, 1fr))", "gap": "20px", "marginBottom": "30px", "--chart-color-palette": "default"}}>
              <MetricCardBlock id="iap7i" styles={{"width": "100%", "minHeight": "140px", "--chart-color-palette": "default"}} metric={{"metricTitle": "Metric Title", "format": "number", "valueColor": "#2c3e50", "valueSize": 32, "showTrend": true, "positiveColor": "#27ae60", "negativeColor": "#e74c3c", "value": 0, "trend": 12}} />
              <MetricCardBlock id="iraev" styles={{"width": "100%", "minHeight": "140px", "--chart-color-palette": "default"}} metric={{"metricTitle": "Metric Title", "format": "number", "valueColor": "#2c3e50", "valueSize": 32, "showTrend": true, "positiveColor": "#27ae60", "negativeColor": "#e74c3c", "value": 0, "trend": 12}} />
              <MetricCardBlock id="in24l" styles={{"width": "100%", "minHeight": "140px", "--chart-color-palette": "default"}} metric={{"metricTitle": "Metric Title", "format": "number", "valueColor": "#2c3e50", "valueSize": 32, "showTrend": true, "positiveColor": "#27ae60", "negativeColor": "#e74c3c", "value": 0, "trend": 12}} />
              <MetricCardBlock id="i701w" styles={{"width": "100%", "minHeight": "140px", "--chart-color-palette": "default"}} metric={{"metricTitle": "Metric Title", "format": "number", "valueColor": "#2c3e50", "valueSize": 32, "showTrend": true, "positiveColor": "#27ae60", "negativeColor": "#e74c3c", "value": 0, "trend": 12}} />
            </div>
            <div id="intv2" className="charts-row" style={{"display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(500px, 1fr))", "gap": "20px", "marginBottom": "20px", "--chart-color-palette": "default"}}>
              <div id="i6ral" style={{"background": "white", "padding": "25px", "borderRadius": "10px", "boxShadow": "0 4px 6px rgba(0,0,0,0.1)", "--chart-color-palette": "default"}}>
                <h3 id="i6qux" style={{"margin": "0 0 20px 0", "color": "#2c3e50", "--chart-color-palette": "default"}}>{"Revenue Trend"}</h3>
                <ChartBlock id="is7b3g" styles={{"width": "100%", "minHeight": "400px", "--chart-color-palette": "default"}} chartType="bar-chart" title="Bar Chart Title" color="#3498db" chart={{"barWidth": 30, "orientation": "vertical", "showGrid": true, "showLegend": true, "showTooltip": true, "stacked": false, "animate": true, "legendPosition": "top", "gridColor": "#e0e0e0", "barGap": 4}} series={[{"name": "Series_1", "label": "Series 1", "color": "#3498db"}]} />
              </div>
              <div id="i16ik" style={{"background": "white", "padding": "25px", "borderRadius": "10px", "boxShadow": "0 4px 6px rgba(0,0,0,0.1)", "--chart-color-palette": "default"}}>
                <h3 id="iwvos" style={{"margin": "0 0 20px 0", "color": "#2c3e50", "--chart-color-palette": "default"}}>{"Category Distribution"}</h3>
                <ChartBlock id="iharv4" styles={{"width": "100%", "minHeight": "400px", "--chart-color-palette": "default"}} chartType="pie-chart" title="Pie Chart Title" color="default" chart={{"showLegend": true, "legendPosition": "bottom", "showLabels": true, "labelPosition": "inside", "paddingAngle": 0, "innerRadius": 0, "outerRadius": 80, "startAngle": 0, "endAngle": 360}} series={[{"name": "Series_1", "label": "Series 1", "color": "#4CAF50"}]} />
              </div>
            </div>
          </div>
        </div>
        <div id="iyxupl" style={{"display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(300px, 1fr))", "gap": "40px", "--chart-color-palette": "default"}} />
      </div>
    </section>    </div>
  );
};

export default Home;
