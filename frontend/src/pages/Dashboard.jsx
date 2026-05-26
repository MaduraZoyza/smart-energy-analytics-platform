import { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";

import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";
import InsightBox from "../components/InsightBox";

const chartData = {
  hourly: [
    { time: "00:00", usage: 42 },
    { time: "03:00", usage: 35 },
    { time: "06:00", usage: 50 },
    { time: "09:00", usage: 95 },
    { time: "12:00", usage: 130 },
    { time: "15:00", usage: 125 },
    { time: "18:00", usage: 90 },
    { time: "21:00", usage: 60 },
  ],
  daily: [
    { time: "Mon", usage: 980 },
    { time: "Tue", usage: 1120 },
    { time: "Wed", usage: 1080 },
    { time: "Thu", usage: 1250 },
    { time: "Fri", usage: 1180 },
    { time: "Sat", usage: 760 },
    { time: "Sun", usage: 690 },
  ],
  weekly: [
    { time: "Week 1", usage: 6900 },
    { time: "Week 2", usage: 7350 },
    { time: "Week 3", usage: 7100 },
    { time: "Week 4", usage: 7680 },
  ],
  monthly: [
    { time: "Jan", usage: 28800 },
    { time: "Feb", usage: 27100 },
    { time: "Mar", usage: 29500 },
    { time: "Apr", usage: 30600 },
    { time: "May", usage: 31800 },
    { time: "Jun", usage: 29900 },
  ],
};

const liveFluctuationData = [
  { time: "1", load: 42 },
  { time: "2", load: 55 },
  { time: "3", load: 48 },
  { time: "4", load: 70 },
  { time: "5", load: 62 },
  { time: "6", load: 88 },
  { time: "7", load: 76 },
  { time: "8", load: 95 },
  { time: "9", load: 72 },
  { time: "10", load: 84 },
];

const zoneComparisonData = {
  hourly: {
    summary: [
      { name: "HVAC", usage: 76, fill: "#21ff8a" },
      { name: "Lighting", usage: 28, fill: "#e7d84b" },
      { name: "Floor 1", usage: 27, fill: "#22d3ee" },
      { name: "Floor 2", usage: 40, fill: "#1d8fb3" },
    ],
    breakdown: {
      HVAC: [
        { name: "Cooling", value: 45, fill: "#8ce99a" },
        { name: "Ventilation", value: 30, fill: "#5fd97b" },
        { name: "Heating", value: 25, fill: "#2eb85c" },
      ],
      Lighting: [
        { name: "Office Lights", value: 50, fill: "#f8e16c" },
        { name: "Corridors", value: 30, fill: "#f1d54b" },
        { name: "Exterior", value: 20, fill: "#dcbf1f" },
      ],
      "Floor 1": [
        { name: "Open Office", value: 40, fill: "#7dd3fc" },
        { name: "Meeting Rooms", value: 35, fill: "#38bdf8" },
        { name: "Reception", value: 25, fill: "#0ea5e9" },
      ],
      "Floor 2": [
        { name: "Private Offices", value: 45, fill: "#60a5fa" },
        { name: "Labs", value: 30, fill: "#3b82f6" },
        { name: "Common Area", value: 25, fill: "#2563eb" },
      ],
    },
  },

  daily: {
    summary: [
      { name: "HVAC", usage: 520, fill: "#21ff8a" },
      { name: "Lighting", usage: 260, fill: "#e7d84b" },
      { name: "Floor 1", usage: 210, fill: "#22d3ee" },
      { name: "Floor 2", usage: 340, fill: "#1d8fb3" },
    ],
    breakdown: {
      HVAC: [
        { name: "Cooling", value: 42, fill: "#8ce99a" },
        { name: "Ventilation", value: 31, fill: "#5fd97b" },
        { name: "Heating", value: 27, fill: "#2eb85c" },
      ],
      Lighting: [
        { name: "Office Lights", value: 48, fill: "#f8e16c" },
        { name: "Corridors", value: 32, fill: "#f1d54b" },
        { name: "Exterior", value: 20, fill: "#dcbf1f" },
      ],
      "Floor 1": [
        { name: "Open Office", value: 43, fill: "#7dd3fc" },
        { name: "Meeting Rooms", value: 33, fill: "#38bdf8" },
        { name: "Reception", value: 24, fill: "#0ea5e9" },
      ],
      "Floor 2": [
        { name: "Private Offices", value: 46, fill: "#60a5fa" },
        { name: "Labs", value: 29, fill: "#3b82f6" },
        { name: "Common Area", value: 25, fill: "#2563eb" },
      ],
    },
  },

  weekly: {
    summary: [
      { name: "HVAC", usage: 3100, fill: "#21ff8a" },
      { name: "Lighting", usage: 1450, fill: "#e7d84b" },
      { name: "Floor 1", usage: 1250, fill: "#22d3ee" },
      { name: "Floor 2", usage: 1850, fill: "#1d8fb3" },
    ],
    breakdown: {
      HVAC: [
        { name: "Cooling", value: 44, fill: "#8ce99a" },
        { name: "Ventilation", value: 29, fill: "#5fd97b" },
        { name: "Heating", value: 27, fill: "#2eb85c" },
      ],
      Lighting: [
        { name: "Office Lights", value: 49, fill: "#f8e16c" },
        { name: "Corridors", value: 31, fill: "#f1d54b" },
        { name: "Exterior", value: 20, fill: "#dcbf1f" },
      ],
      "Floor 1": [
        { name: "Open Office", value: 41, fill: "#7dd3fc" },
        { name: "Meeting Rooms", value: 34, fill: "#38bdf8" },
        { name: "Reception", value: 25, fill: "#0ea5e9" },
      ],
      "Floor 2": [
        { name: "Private Offices", value: 45, fill: "#60a5fa" },
        { name: "Labs", value: 30, fill: "#3b82f6" },
        { name: "Common Area", value: 25, fill: "#2563eb" },
      ],
    },
  },

  monthly: {
    summary: [
      { name: "HVAC", usage: 12800, fill: "#21ff8a" },
      { name: "Lighting", usage: 6200, fill: "#e7d84b" },
      { name: "Floor 1", usage: 5400, fill: "#22d3ee" },
      { name: "Floor 2", usage: 7600, fill: "#1d8fb3" },
    ],
    breakdown: {
      HVAC: [
        { name: "Cooling", value: 43, fill: "#8ce99a" },
        { name: "Ventilation", value: 30, fill: "#5fd97b" },
        { name: "Heating", value: 27, fill: "#2eb85c" },
      ],
      Lighting: [
        { name: "Office Lights", value: 50, fill: "#f8e16c" },
        { name: "Corridors", value: 30, fill: "#f1d54b" },
        { name: "Exterior", value: 20, fill: "#dcbf1f" },
      ],
      "Floor 1": [
        { name: "Open Office", value: 42, fill: "#7dd3fc" },
        { name: "Meeting Rooms", value: 33, fill: "#38bdf8" },
        { name: "Reception", value: 25, fill: "#0ea5e9" },
      ],
      "Floor 2": [
        { name: "Private Offices", value: 46, fill: "#60a5fa" },
        { name: "Labs", value: 29, fill: "#3b82f6" },
        { name: "Common Area", value: 25, fill: "#2563eb" },
      ],
    },
  },
};

function Dashboard() {
  const [selectedView, setSelectedView] = useState("hourly");
  const [selectedZone, setSelectedZone] = useState("HVAC");

  const currentZoneSummary = zoneComparisonData[selectedView].summary;
  const currentZoneBreakdown =
    zoneComparisonData[selectedView].breakdown[selectedZone];

  const selectedZoneTotal =
    currentZoneSummary.find((item) => item.name === selectedZone)?.usage || 0;

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <p className="eyebrow">AI-Driven Energy Intelligence</p>
            <h1>Smart Energy Analytics Dashboard</h1>
            <p className="header-subtitle">
              Commercial building electricity consumption monitoring and insights
            </p>
          </div>

          <button className="export-button">Export Report</button>
        </div>

        <section className="summary-grid">
          <SummaryCard
            title="Total Energy Usage"
            value="1,250 kWh"
            note="Weekly building consumption"
          />

          <SummaryCard
            title="Peak Usage Zone"
            value="HVAC"
            note="Highest consuming system"
          />

          <SummaryCard
            title="Predicted Usage"
            value="1,320 kWh"
            note="Expected next week"
          />

          <SummaryCard
            title="Estimated Cost"
            value="€245"
            note="Based on sample tariff"
          />
        </section>

        <section className="dashboard-main-grid">
          <div className="left-dashboard-area">
            <div className="top-monitoring-row">
              <div className="chart-panel trend-panel">
                <div className="panel-header">
                  <div>
                    <h2>Energy Usage Trend</h2>
                    <span>
                      {selectedView.charAt(0).toUpperCase() +
                        selectedView.slice(1)}{" "}
                      electricity usage (kWh)
                    </span>
                  </div>

                  <div className="chart-tabs">
                    {["hourly", "daily", "weekly", "monthly"].map((view) => (
                      <button
                        key={view}
                        className={
                          selectedView === view
                            ? "tab-button active-tab"
                            : "tab-button"
                        }
                        onClick={() => setSelectedView(view)}
                      >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="real-chart">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chartData[selectedView]}>
                      <CartesianGrid stroke="#145c7a" strokeDasharray="3 3" />
                      <XAxis dataKey="time" stroke="#9fd9ea" />
                      <YAxis stroke="#9fd9ea">
                        <Label
                          value="Energy Usage (kWh)"
                          angle={-90}
                          position="insideLeft"
                          style={{ fill: "#9fd9ea", fontSize: 13 }}
                        />
                      </YAxis>
                      <Tooltip
                        formatter={(value) => [`${value} kWh`, "Energy Usage"]}
                        contentStyle={{
                          backgroundColor: "#0a1d36",
                          border: "1px solid #22d3ee",
                          color: "#ffffff",
                        }}
                        labelStyle={{ color: "#ffffff" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="usage"
                        stroke="#22d3ee"
                        strokeWidth={3}
                        dot={{ fill: "#e7d84b", strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-panel live-panel">
                <div className="panel-header compact-header">
                  <div>
                    <h2>Live Load Monitoring</h2>
                    <span>Simulated live fluctuation from building load</span>
                  </div>
                </div>

                <div className="live-status-row">
                  <span className="live-dot"></span>
                  <span className="live-label">LIVE MODE</span>
                </div>

                <div className="load-value">
                  <h3>84 kW</h3>
                  <p>Current Building Load</p>
                </div>

                <div className="live-fluctuation-box">
                  <ResponsiveContainer width="100%" height={190}>
                    <AreaChart data={liveFluctuationData}>
                      <defs>
                        <linearGradient
                          id="liveGreen"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#21ff8a"
                            stopOpacity={0.7}
                          />
                          <stop
                            offset="95%"
                            stopColor="#21ff8a"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid stroke="#143c4d" strokeDasharray="3 3" />
                      <XAxis dataKey="time" hide />
                      <YAxis hide />

                      <Tooltip
                        formatter={(value) => [`${value} kW`, "Live Load"]}
                        contentStyle={{
                          backgroundColor: "#0a1d36",
                          border: "1px solid #21ff8a",
                          color: "#ffffff",
                        }}
                        labelStyle={{ color: "#ffffff" }}
                      />

                      <Area
                        type="monotone"
                        dataKey="load"
                        stroke="#21ff8a"
                        fill="url(#liveGreen)"
                        strokeWidth={3}
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={1800}
                      />
                    </AreaChart>
                  </ResponsiveContainer>

                  <div className="scanning-line"></div>
                </div>

                <p className="live-note">
                  This animation represents live load fluctuation when connected
                  to real-time monitoring equipment.
                </p>
              </div>
            </div>

            <div className="bottom-insights-grid">
              <InsightBox title="AI Insights">
                <ul>
                  <li>HVAC system has the highest energy usage this week.</li>
                  <li>Consumption increases mainly during working hours.</li>
                  <li>Next week usage is expected to increase slightly.</li>
                </ul>
              </InsightBox>

              <InsightBox title="Live Alerts">
                <ul>
                  <li className="warning-text">
                    High HVAC usage detected after office hours.
                  </li>
                  <li>No critical system anomaly detected.</li>
                  <li>Real-time load is currently within the expected range.</li>
                </ul>
              </InsightBox>
            </div>
          </div>

          <div className="chart-panel zone-panel">
            <div className="panel-header zone-header">
              <div>
                <h2>Zone Comparison</h2>
                <span>
                  {selectedView.charAt(0).toUpperCase() +
                    selectedView.slice(1)}{" "}
                  electricity usage by zone (kWh)
                </span>
              </div>
            </div>

            <div className="zone-concept-layout">
              <div className="zone-main-chart-card">
                <div className="zone-subtitle">Overall Zone Share</div>

                <div className="zone-main-pie">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={currentZoneSummary}
                        dataKey="usage"
                        nameKey="name"
                        innerRadius={58}
                        outerRadius={108}
                        paddingAngle={2}
                      >
                        {currentZoneSummary.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={entry.fill}
                            stroke={
                              selectedZone === entry.name
                                ? "#ffffff"
                                : "transparent"
                            }
                            strokeWidth={selectedZone === entry.name ? 4 : 1}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedZone(entry.name)}
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value) => [
                          `${value} kWh`,
                          "Zone Usage",
                        ]}
                        contentStyle={{
                          backgroundColor: "#0a1d36",
                          border: "1px solid #22d3ee",
                          color: "#ffffff",
                        }}
                        labelStyle={{ color: "#ffffff" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="zone-selector-row">
                  {currentZoneSummary.map((zone) => (
                    <button
                      key={zone.name}
                      className={
                        selectedZone === zone.name
                          ? "zone-pill active-zone-pill"
                          : "zone-pill"
                      }
                      onClick={() => setSelectedZone(zone.name)}
                    >
                      {zone.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="zone-breakdown-card">
                <div className="zone-subtitle">
                  Detailed Breakdown of {selectedZone}
                </div>

                <div className="zone-breakdown-content">
                  <div className="breakdown-stack">
                    {currentZoneBreakdown.map((item) => (
                      <div
                        key={item.name}
                        className="breakdown-segment"
                        style={{
                          height: `${item.value}%`,
                          backgroundColor: item.fill,
                        }}
                        title={`${item.name}: ${item.value}%`}
                      >
                        <span>{item.value}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="breakdown-labels">
                    {currentZoneBreakdown.map((item) => (
                      <div key={item.name} className="breakdown-label-item">
                        <b style={{ backgroundColor: item.fill }}></b>
                        <span>{item.name}</span>
                        <strong>{item.value}%</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="zone-total-box">
                  <p>{selectedZone} Total Usage</p>
                  <h3>{selectedZoneTotal} kWh</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;