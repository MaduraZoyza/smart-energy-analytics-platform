import { useEffect, useState } from "react";
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
      { name: "Floor 1", usage: 88, fill: "#22d3ee" },
      { name: "Floor 2", usage: 94, fill: "#21ff8a" },
      { name: "Floor 3", usage: 118, fill: "#e7d84b" },
      { name: "Common Areas", usage: 42, fill: "#a78bfa" },
    ],
    breakdown: {
      "Floor 1": [
        { name: "HVAC", value: 45, fill: "#8ce99a" },
        { name: "Lighting", value: 25, fill: "#f8e16c" },
        { name: "Plug Loads", value: 30, fill: "#60a5fa" },
      ],
      "Floor 2": [
        { name: "HVAC", value: 48, fill: "#8ce99a" },
        { name: "Lighting", value: 24, fill: "#f8e16c" },
        { name: "Plug Loads", value: 28, fill: "#60a5fa" },
      ],
      "Floor 3": [
        { name: "HVAC", value: 35, fill: "#8ce99a" },
        { name: "Lighting", value: 20, fill: "#f8e16c" },
        { name: "Server Room", value: 45, fill: "#fb7185" },
      ],
      "Common Areas": [
        { name: "Elevators", value: 35, fill: "#38bdf8" },
        { name: "Fire System", value: 20, fill: "#f97316" },
        { name: "Outdoor Lighting", value: 45, fill: "#facc15" },
      ],
    },
  },

  daily: {
    summary: [
      { name: "Floor 1", usage: 620, fill: "#22d3ee" },
      { name: "Floor 2", usage: 690, fill: "#21ff8a" },
      { name: "Floor 3", usage: 810, fill: "#e7d84b" },
      { name: "Common Areas", usage: 280, fill: "#a78bfa" },
    ],
    breakdown: {
      "Floor 1": [
        { name: "HVAC", value: 44, fill: "#8ce99a" },
        { name: "Lighting", value: 26, fill: "#f8e16c" },
        { name: "Plug Loads", value: 30, fill: "#60a5fa" },
      ],
      "Floor 2": [
        { name: "HVAC", value: 47, fill: "#8ce99a" },
        { name: "Lighting", value: 25, fill: "#f8e16c" },
        { name: "Plug Loads", value: 28, fill: "#60a5fa" },
      ],
      "Floor 3": [
        { name: "HVAC", value: 34, fill: "#8ce99a" },
        { name: "Lighting", value: 19, fill: "#f8e16c" },
        { name: "Server Room", value: 47, fill: "#fb7185" },
      ],
      "Common Areas": [
        { name: "Elevators", value: 34, fill: "#38bdf8" },
        { name: "Fire System", value: 18, fill: "#f97316" },
        { name: "Outdoor Lighting", value: 48, fill: "#facc15" },
      ],
    },
  },

  weekly: {
    summary: [
      { name: "Floor 1", usage: 4200, fill: "#22d3ee" },
      { name: "Floor 2", usage: 4650, fill: "#21ff8a" },
      { name: "Floor 3", usage: 5400, fill: "#e7d84b" },
      { name: "Common Areas", usage: 1800, fill: "#a78bfa" },
    ],
    breakdown: {
      "Floor 1": [
        { name: "HVAC", value: 43, fill: "#8ce99a" },
        { name: "Lighting", value: 27, fill: "#f8e16c" },
        { name: "Plug Loads", value: 30, fill: "#60a5fa" },
      ],
      "Floor 2": [
        { name: "HVAC", value: 46, fill: "#8ce99a" },
        { name: "Lighting", value: 25, fill: "#f8e16c" },
        { name: "Plug Loads", value: 29, fill: "#60a5fa" },
      ],
      "Floor 3": [
        { name: "HVAC", value: 33, fill: "#8ce99a" },
        { name: "Lighting", value: 20, fill: "#f8e16c" },
        { name: "Server Room", value: 47, fill: "#fb7185" },
      ],
      "Common Areas": [
        { name: "Elevators", value: 35, fill: "#38bdf8" },
        { name: "Fire System", value: 18, fill: "#f97316" },
        { name: "Outdoor Lighting", value: 47, fill: "#facc15" },
      ],
    },
  },

  monthly: {
    summary: [
      { name: "Floor 1", usage: 16800, fill: "#22d3ee" },
      { name: "Floor 2", usage: 18400, fill: "#21ff8a" },
      { name: "Floor 3", usage: 21800, fill: "#e7d84b" },
      { name: "Common Areas", usage: 7200, fill: "#a78bfa" },
    ],
    breakdown: {
      "Floor 1": [
        { name: "HVAC", value: 44, fill: "#8ce99a" },
        { name: "Lighting", value: 26, fill: "#f8e16c" },
        { name: "Plug Loads", value: 30, fill: "#60a5fa" },
      ],
      "Floor 2": [
        { name: "HVAC", value: 46, fill: "#8ce99a" },
        { name: "Lighting", value: 25, fill: "#f8e16c" },
        { name: "Plug Loads", value: 29, fill: "#60a5fa" },
      ],
      "Floor 3": [
        { name: "HVAC", value: 32, fill: "#8ce99a" },
        { name: "Lighting", value: 19, fill: "#f8e16c" },
        { name: "Server Room", value: 49, fill: "#fb7185" },
      ],
      "Common Areas": [
        { name: "Elevators", value: 34, fill: "#38bdf8" },
        { name: "Fire System", value: 17, fill: "#f97316" },
        { name: "Outdoor Lighting", value: 49, fill: "#facc15" },
      ],
    },
  },
};

function Dashboard() {
  const [selectedView, setSelectedView] = useState("hourly");
  const [selectedZone, setSelectedZone] = useState("Floor 1");

  const [summaryData, setSummaryData] = useState(null);
  const [zoneApiData, setZoneApiData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const summaryResponse = await fetch(
          "http://127.0.0.1:8000/energy/summary"
        );
        const zonesResponse = await fetch(
          "http://127.0.0.1:8000/energy/zones"
        );

        const summary = await summaryResponse.json();
        const zones = await zonesResponse.json();

        setSummaryData(summary);
        setZoneApiData(zones);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const floorColors = {
    "Floor 1": "#22d3ee",
    "Floor 2": "#21ff8a",
    "Floor 3": "#e7d84b",
    "Common Areas": "#a78bfa",
  };

  const categoryColors = {
    HVAC: "#8ce99a",
    Lighting: "#f8e16c",
    "Plug Loads": "#60a5fa",
    "Server Room": "#fb7185",
    Elevators: "#38bdf8",
    "Fire System": "#f97316",
    "Outdoor Lighting": "#facc15",
  };

  const buildZoneSummary = () => {
    const floorTotals = {};

    zoneApiData.forEach((item) => {
      floorTotals[item.floor_area] =
        (floorTotals[item.floor_area] || 0) + Number(item.total_kwh);
    });

    return Object.keys(floorTotals).map((floor) => ({
      name: floor,
      usage: Number(floorTotals[floor].toFixed(2)),
      fill: floorColors[floor] || "#22d3ee",
    }));
  };

  const buildCategoryBreakdown = (floor) => {
    const categories = zoneApiData.filter((item) => item.floor_area === floor);
    const total = categories.reduce(
      (sum, item) => sum + Number(item.total_kwh),
      0
    );

    if (total === 0) {
      return [];
    }

    return categories.map((item) => ({
      name: item.category,
      value: Number(((Number(item.total_kwh) / total) * 100).toFixed(0)),
      fill: categoryColors[item.category] || "#22d3ee",
    }));
  };

  const currentZoneSummary =
    zoneApiData.length > 0
      ? buildZoneSummary()
      : zoneComparisonData[selectedView].summary;

  const currentZoneBreakdown =
    zoneApiData.length > 0
      ? buildCategoryBreakdown(selectedZone)
      : zoneComparisonData[selectedView].breakdown[selectedZone];

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
            value={
              summaryData
                ? `${Number(summaryData.total_kwh).toFixed(2)} kWh`
                : "Loading..."
            }
            note="Total building consumption"
          />

          <SummaryCard
            title="Total Records"
            value={summaryData ? summaryData.total_records : "Loading..."}
            note="Energy data readings"
          />

          <SummaryCard
            title="Average Usage"
            value={
              summaryData
                ? `${Number(summaryData.avg_kwh).toFixed(2)} kWh`
                : "Loading..."
            }
            note="Average reading value"
          />

          <SummaryCard
            title="Peak Usage"
            value={
              summaryData
                ? `${Number(summaryData.peak_kwh).toFixed(2)} kWh`
                : "Loading..."
            }
            note="Highest recorded value"
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
                      {`${
                        selectedView.charAt(0).toUpperCase() +
                        selectedView.slice(1)
                      } electricity usage (kWh)`}
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
                        formatter={(value) => [
                          `${value} kWh`,
                          "Energy Usage",
                        ]}
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
                  <li>
                    Floor 3 shows high energy usage due to server room
                    consumption.
                  </li>
                  <li>
                    HVAC and lighting loads increase mainly during working hours.
                  </li>
                  <li>
                    Common area outdoor lighting can be optimized during daytime.
                  </li>
                </ul>
              </InsightBox>

              <InsightBox title="Live Alerts">
                <ul>
                  <li className="warning-text">
                    Energy spike detected in Floor 3 Server Room.
                  </li>
                  <li>
                    Lighting usage on Floor 2 is higher than expected after
                    office hours.
                  </li>
                  <li>Common area systems are currently within normal range.</li>
                </ul>
              </InsightBox>
            </div>
          </div>

          <div className="chart-panel zone-panel">
            <div className="panel-header zone-header">
              <div>
                <h2>Hierarchical Zone Comparison</h2>
                <span>
                  {`${
                    selectedView.charAt(0).toUpperCase() + selectedView.slice(1)
                  } electricity usage by floor and category (kWh)`}
                </span>
              </div>
            </div>

            <div className="zone-concept-layout">
              <div className="zone-main-chart-card">
                <div className="zone-subtitle">
                  Building Level Floor / Area Share
                </div>

                <div className="zone-main-pie">
                  <ResponsiveContainer width="100%" height={210}>
                    <PieChart
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <Pie
                        data={currentZoneSummary}
                        dataKey="usage"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={68}
                        paddingAngle={3}
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
                        formatter={(value) => [`${value} kWh`, "Area Usage"]}
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
                  Functional Category Breakdown of {selectedZone}
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
                  <p>{selectedZone} Total Energy Usage</p>
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