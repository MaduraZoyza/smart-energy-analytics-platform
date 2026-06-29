import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Label,
} from "recharts";
import Sidebar from "../components/Sidebar";

function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/energy/report");
        const data = await res.json();
        setReportData(data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const floorColors = {
    "Floor 1": "#22d3ee",
    "Floor 2": "#21ff8a",
    "Floor 3": "#e7d84b",
    "Floor 4": "#a78bfa",
    "Common Building Services": "#fb7185",
  };

  const timePeriodColors = [
    "#22d3ee",
    "#21ff8a",
    "#e7d84b",
    "#a78bfa",
    "#fb7185",
    "#f97316",
    "#38bdf8",
  ];

  const buildFloorTotals = () => {
    if (!reportData) return [];
    const totals = {};
    reportData.zone_breakdown.forEach((item) => {
      totals[item.floor_area] =
        (totals[item.floor_area] || 0) + Number(item.total_kwh);
    });
    return Object.entries(totals).map(([floor, kwh]) => ({
      floor,
      kwh: Number(kwh.toFixed(2)),
      fill: floorColors[floor] || "#22d3ee",
    }));
  };

  const dailyChartData = reportData
    ? reportData.daily_usage.map((item) => ({
        date: item.date ? item.date.slice(5) : "",
        kwh: Number(item.total_kwh),
      }))
    : [];

  const floorTotals = buildFloorTotals();

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        {/* Header */}
        <div className="page-header">
          <div>
            <p className="eyebrow">Energy Report — June 2026</p>
            <h1>Smart Energy Analytics Report</h1>
            <p className="header-subtitle">
              Full building energy consumption breakdown for June 2026
            </p>
          </div>
          <button className="export-button" onClick={handlePrint}>
            🖨️ Print Report
          </button>
        </div>

        {loading ? (
          <div style={{ color: "#9fd9ea", fontSize: 20, marginTop: 40, textAlign: "center" }}>
            Loading report data...
          </div>
        ) : (
          <>
            {/* Section 1 — Summary Cards */}
            <section className="summary-grid" style={{ marginBottom: 26 }}>
              <div className="summary-card">
                <p className="card-title">Total Energy Usage</p>
                <h3>{Number(reportData.summary.total_kwh).toLocaleString()} kWh</h3>
                <p className="card-note">Total building consumption for June</p>
              </div>
              <div className="summary-card">
                <p className="card-title">Total Records</p>
                <h3>{Number(reportData.summary.total_records).toLocaleString()}</h3>
                <p className="card-note">Energy data readings</p>
              </div>
              <div className="summary-card">
                <p className="card-title">Average Usage</p>
                <h3>{Number(reportData.summary.avg_kwh).toFixed(2)} kWh</h3>
                <p className="card-note">Average per reading</p>
              </div>
              <div className="summary-card">
                <p className="card-title">Peak Usage</p>
                <h3>{Number(reportData.summary.peak_kwh).toFixed(2)} kWh</h3>
                <p className="card-note">Highest recorded value</p>
              </div>
            </section>

            {/* Section 2 — Daily Usage Chart */}
            <div className="chart-panel" style={{ marginBottom: 26 }}>
              <div className="panel-header">
                <div>
                  <h2>Daily Energy Usage — June 2026</h2>
                  <span>Total kWh consumed per day across all zones</span>
                </div>
              </div>
              <div className="real-chart" style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height={270}>
                  <LineChart data={dailyChartData}>
                    <CartesianGrid stroke="#145c7a" strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="#9fd9ea" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#9fd9ea">
                      <Label
                        value="kWh"
                        angle={-90}
                        position="insideLeft"
                        style={{ fill: "#9fd9ea", fontSize: 13 }}
                      />
                    </YAxis>
                    <Tooltip
                      formatter={(value) => [`${Number(value).toFixed(2)} kWh`, "Daily Usage"]}
                      contentStyle={{
                        backgroundColor: "#0a1d36",
                        border: "1px solid #22d3ee",
                        color: "#ffffff",
                      }}
                      labelStyle={{ color: "#ffffff" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="kwh"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      dot={{ fill: "#e7d84b", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Section 3 — Floor Breakdown + Zone Table side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 22, marginBottom: 26 }}>
              {/* Floor Bar Chart */}
              <div className="chart-panel">
                <div className="panel-header">
                  <div>
                    <h2>Energy by Floor</h2>
                    <span>Total kWh per floor area for June</span>
                  </div>
                </div>
                <div className="real-chart" style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={floorTotals} layout="vertical">
                      <CartesianGrid stroke="#145c7a" strokeDasharray="3 3" />
                      <XAxis type="number" stroke="#9fd9ea" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="floor" type="category" stroke="#9fd9ea" width={150} tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(value) => [`${Number(value).toLocaleString()} kWh`, "Total"]}
                        contentStyle={{
                          backgroundColor: "#0a1d36",
                          border: "1px solid #22d3ee",
                          color: "#ffffff",
                        }}
                        labelStyle={{ color: "#ffffff" }}
                      />
                      <Bar dataKey="kwh" radius={[0, 6, 6, 0]}>
                        {floorTotals.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Zone Breakdown Table */}
              <div className="chart-panel">
                <div className="panel-header">
                  <div>
                    <h2>Zone Breakdown</h2>
                    <span>Energy by floor and functional category</span>
                  </div>
                </div>
                <div style={{ overflowY: "auto", maxHeight: 320 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #176c8d" }}>
                        <th style={{ textAlign: "left", padding: "8px 10px", color: "#e7d84b" }}>Floor</th>
                        <th style={{ textAlign: "left", padding: "8px 10px", color: "#e7d84b" }}>Category</th>
                        <th style={{ textAlign: "right", padding: "8px 10px", color: "#e7d84b" }}>Total kWh</th>
                        <th style={{ textAlign: "right", padding: "8px 10px", color: "#e7d84b" }}>Avg kWh</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.zone_breakdown.map((item, index) => (
                        <tr
                          key={index}
                          style={{
                            borderBottom: "1px solid #145c7a",
                            backgroundColor: index % 2 === 0 ? "#07182e" : "transparent",
                          }}
                        >
                          <td style={{ padding: "8px 10px", color: floorColors[item.floor_area] || "#22d3ee" }}>
                            {item.floor_area}
                          </td>
                          <td style={{ padding: "8px 10px", color: "#dff8ff" }}>{item.category}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right", color: "#ffffff", fontWeight: 600 }}>
                            {Number(item.total_kwh).toLocaleString()}
                          </td>
                          <td style={{ padding: "8px 10px", textAlign: "right", color: "#9fd9ea" }}>
                            {Number(item.avg_kwh).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section 4 — Time Period + Weekend vs Weekday */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 26 }}>
              {/* Time Period Breakdown */}
              <div className="chart-panel">
                <div className="panel-header">
                  <div>
                    <h2>Time Period Breakdown</h2>
                    <span>Energy usage by time of day</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                  {reportData.time_period_breakdown.map((item, index) => {
                    const total = reportData.time_period_breakdown.reduce(
                      (sum, i) => sum + Number(i.total_kwh), 0
                    );
                    const pct = ((Number(item.total_kwh) / total) * 100).toFixed(1);
                    return (
                      <div key={index}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ color: "#dff8ff", fontSize: 13 }}>{item.time_period}</span>
                          <span style={{ color: "#ffffff", fontWeight: 600, fontSize: 13 }}>
                            {Number(item.total_kwh).toLocaleString()} kWh
                            <span style={{ color: "#9fd9ea", fontWeight: 400, marginLeft: 6 }}>({pct}%)</span>
                          </span>
                        </div>
                        <div style={{ background: "#07182e", borderRadius: 6, height: 10, border: "1px solid #145c7a" }}>
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              borderRadius: 6,
                              background: timePeriodColors[index % timePeriodColors.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekend vs Weekday */}
              <div className="chart-panel">
                <div className="panel-header">
                  <div>
                    <h2>Weekend vs Weekday</h2>
                    <span>Comparing energy consumption patterns</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 16 }}>
                  {reportData.weekend_vs_weekday.map((item, index) => {
                    const isWeekend = item.is_weekend;
                    const label = isWeekend ? "Weekend" : "Weekday";
                    const color = isWeekend ? "#a78bfa" : "#22d3ee";
                    return (
                      <div
                        key={index}
                        style={{
                          background: "#07182e",
                          border: `1px solid ${color}`,
                          borderRadius: 12,
                          padding: "18px 22px",
                        }}
                      >
                        <p style={{ margin: "0 0 8px", color: "#9fd9ea", fontSize: 13, fontWeight: 600 }}>
                          {label}
                        </p>
                        <h3 style={{ margin: "0 0 6px", fontSize: 28, color: color, fontWeight: 700 }}>
                          {Number(item.total_kwh).toLocaleString()} kWh
                        </h3>
                        <p style={{ margin: 0, color: "#9fd9ea", fontSize: 13 }}>
                          Avg per reading: <strong style={{ color: "#ffffff" }}>{Number(item.avg_kwh).toFixed(2)} kWh</strong>
                          &nbsp;·&nbsp; Readings: <strong style={{ color: "#ffffff" }}>{Number(item.reading_count).toLocaleString()}</strong>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              textAlign: "center",
              padding: "18px",
              color: "#9fd9ea",
              fontSize: 13,
              borderTop: "1px solid #176c8d",
              marginTop: 8,
            }}>
              Smart Energy Analytics Platform — Generated {new Date().toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric"
              })} · Data source: PostgreSQL energy_readings (18,000 records)
            </div>
          </>
        )}
      </main>

      {/* Print styles */}
      <style>{`
        @media print {
          .sidebar { display: none !important; }
          .export-button { display: none !important; }
          .main-content { padding: 10px !important; }
          body { background: white !important; color: black !important; }
          .chart-panel, .summary-card { border: 1px solid #ccc !important; }
        }
      `}</style>
    </div>
  );
}

export default Reports;
