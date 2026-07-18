import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import LiveAlerts from "../components/LiveAlerts";
import SmartRecommendations from "../components/SmartRecommendations";


// Temporary static fallback data.
// Currently not used because hourly, daily, and weekly data are fetched from backend.
// Monthly Jan–May values are still handled separately as sample values, while June is fetched from backend.
// Keep this commented in case fallback demo data is needed later.

/*
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
*/

const liveFluctuationData = [
  { time: "1", load: 188 },
  { time: "2", load: 196 },
  { time: "3", load: 207 },
  { time: "4", load: 218 },
  { time: "5", load: 229 },
  { time: "6", load: 241 },
  { time: "7", load: 233 },
  { time: "8", load: 224 },
  { time: "9", load: 238 },
  { time: "10", load: 252 },
  { time: "11", load: 244 },
  { time: "12", load: 231 },
];

function Dashboard() {
  const navigate = useNavigate();

  const [selectedView, setSelectedView] = useState("daily");
  const [selectedZone, setSelectedZone] = useState("Floor 1");

  const [summaryData, setSummaryData] = useState(null);
  const [zoneApiData, setZoneApiData] = useState([]);
  const [zoneByViewData, setZoneByViewData] = useState([]);

  const [dailyApiData, setDailyApiData] = useState([]);
  const [hourlyApiData, setHourlyApiData] = useState([]);
  const [weeklyApiData, setWeeklyApiData] = useState([]);
  const [monthlyApiData, setMonthlyApiData] = useState([]);

  const [monthlyPeakCategory, setMonthlyPeakCategory] = useState(null);
  const [highestDailyArea, setHighestDailyArea] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const summaryResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/energy/summary`
        );

        const zonesResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/energy/zones`
        );

        const dailyResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/energy/daily`
        );

        const hourlyResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/energy/hourly`
        );

        const weeklyResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/energy/weekly`
        );

        const monthlyResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/energy/monthly`
        );
        
        const monthlyZoneResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/energy/zones/by-view/monthly`
        );

        const highestDailyAreaResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/energy/highest-daily-area`
        );

        const summary = await summaryResponse.json();
        const zones = await zonesResponse.json();
        const daily = await dailyResponse.json();
        const hourly = await hourlyResponse.json();
        const weekly = await weeklyResponse.json();
        const monthly = await monthlyResponse.json();
        const monthlyZoneData = await monthlyZoneResponse.json();
        const highestDailyAreaData = await highestDailyAreaResponse.json();
        

        setSummaryData(summary);
        setZoneApiData(Array.isArray(zones) ? zones : []);
        setDailyApiData(Array.isArray(daily) ? daily : []);
        setHourlyApiData(Array.isArray(hourly) ? hourly : []);
        setWeeklyApiData(Array.isArray(weekly) ? weekly : []);
        setMonthlyApiData(Array.isArray(monthly) ? monthly : []);
        setHighestDailyArea(highestDailyAreaData);

        if (Array.isArray(monthlyZoneData)) {
          const categoryTotals = {};

          monthlyZoneData.forEach((item) => {
            const category = item.category || item.category_name || "Unknown";

            const value =
              Number(item.total_kwh) ||
              Number(item.energy_kwh) ||
              Number(item.usage) ||
              0;

            categoryTotals[category] =
              (categoryTotals[category] || 0) + value;
          });

          const peakCategory = Object.entries(categoryTotals)
            .map(([category, total]) => ({ category, total }))
            .sort((a, b) => b.total - a.total)[0];

          setMonthlyPeakCategory(peakCategory || null);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchZoneByViewData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/energy/zones/by-view/${selectedView}`
        );

        const data = await response.json();
        setZoneByViewData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching zone by view data:", error);
        setZoneByViewData([]);
      }
    };

    fetchZoneByViewData();
  }, [selectedView]);

  const floorColors = {
    "Floor 1": "#22d3ee",
    "Floor 2": "#21ff8a",
    "Floor 3": "#e7d84b",
    "Floor 4": "#fb7185",
    "Common Building Services": "#a78bfa",
  };

  const categoryColors = {
    "Laboratory Equipment": "#38bdf8",
    HVAC: "#8ce99a",
    "Work Area Lighting": "#f8e16c",
    "Circulation and Lobby Lighting": "#facc15",
    "Plug Load": "#60a5fa",
    "IT / Computer Lab Equipment": "#818cf8",
    "Smart Lab / Studio Equipment": "#a78bfa",
    "Server Room": "#fb7185",
    "IT Infrastructure": "#22d3ee",
    Elevator: "#34d399",
    "Fire and Safety": "#f97316",
    "Outdoor Lighting": "#fde047",
    "ELV / Network System": "#c084fc",
  };

  const buildZoneSummary = (dataSource) => {
    const floorOrder = [
      "Floor 1",
      "Floor 2",
      "Floor 3",
      "Floor 4",
      "Common Building Services",
    ];

    const floorTotals = {};

    dataSource.forEach((item) => {
      const floor = item.floor_area;
      const value = Number(item.total_kwh) || 0;

      floorTotals[floor] = (floorTotals[floor] || 0) + value;
    });

    return floorOrder
      .filter((floor) => floorTotals[floor] !== undefined)
      .map((floor) => ({
        name: floor,
        usage: Number(floorTotals[floor].toFixed(2)),
        fill: floorColors[floor] || "#22d3ee",
      }));
  };

  const buildCategoryBreakdown = (floor, dataSource) => {
    const categories = dataSource.filter((item) => item.floor_area === floor);

    const total = categories.reduce(
      (sum, item) => sum + (Number(item.total_kwh) || 0),
      0
    );

    if (total === 0) {
      return [];
    }

    return categories.map((item) => {
      const kwh = Number(item.total_kwh) || 0;

      return {
        name: item.category,
        value: Number(((kwh / total) * 100).toFixed(1)),
        kwh: Number(kwh.toFixed(2)),
        fill: categoryColors[item.category] || "#22d3ee",
      };
    });
  };

  const backendHourlyChartData = Array.isArray(hourlyApiData)
    ? hourlyApiData.map((item) => ({
        time:
          item.time ||
          item.hour_label ||
          (item.hour !== undefined
            ? `${String(item.hour).padStart(2, "0")}:00`
            : "N/A"),
        usage: Number(item.total_kwh) || 0,
      }))
    : [];

  const backendDailyChartData = Array.isArray(dailyApiData)
    ? dailyApiData.map((item) => ({
        time: item.date ? item.date.slice(5) : "N/A",
        usage: Number(item.total_kwh) || 0,
      }))
    : [];

  const backendWeeklyChartData = Array.isArray(weeklyApiData)
    ? weeklyApiData.map((item, index) => ({
        time:
          item.week ||
          item.week_label ||
          (item.week_start ? `Week ${index + 1}` : `Week ${index + 1}`),
        usage: Number(item.total_kwh) || 0,
      }))
    : [];

  const juneRealTotal =
    Array.isArray(monthlyApiData) && monthlyApiData.length > 0
      ? Number(monthlyApiData[0].total_kwh)
      : 0;

  const backendMonthlyChartData = [
    { time: "Jan", usage: 162500 },
    { time: "Feb", usage: 158200 },
    { time: "Mar", usage: 154600 },
    { time: "Apr", usage: 149800 },
    { time: "May", usage: 145300 },
    {
      time: "Jun",
      usage: juneRealTotal > 0 ? juneRealTotal : 0,
    },
  ];

  const activeTrendData =
    selectedView === "hourly"
      ? backendHourlyChartData
      : selectedView === "daily"
      ? backendDailyChartData
      : selectedView === "weekly"
      ? backendWeeklyChartData
      : selectedView === "monthly"
      ? backendMonthlyChartData
      : [];

  const activeZoneData =
    zoneByViewData.length > 0 ? zoneByViewData : zoneApiData;

  const currentZoneSummary =
    activeZoneData.length > 0 ? buildZoneSummary(activeZoneData) : [];

  const currentZoneBreakdown =
    activeZoneData.length > 0
      ? buildCategoryBreakdown(selectedZone, activeZoneData)
      : [];

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
              Academic and Laboratory Building electricity consumption monitoring
              and insights
            </p>
          </div>

          <button
            className="export-button"
            onClick={() => navigate("/reports")}
          >
            Export Report
          </button>
        </div>

        <section className="summary-grid">
          <SummaryCard
            title="Monthly Total Energy Usage"
            value={`${
              summaryData?.total_kwh
                ? Number(summaryData.total_kwh).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                : 0
            } kWh`}
            note="Total building consumption"
          />

          <SummaryCard
            title="Monthly Peak Usage Category"
            value={monthlyPeakCategory?.category || "Loading..."}
            note={
              monthlyPeakCategory
                ? `${monthlyPeakCategory.total.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })} kWh in current month`
                : "Calculating highest category"
            }
          />

          <SummaryCard
            title="Daily Average Energy Usage"
            value={`${
              summaryData?.total_kwh
                ? (Number(summaryData.total_kwh) / 30).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                : 0
            } kWh`}
            note="Average daily usage in current month"
          />

          <SummaryCard
            title="Highest Daily Consumption Area"
            value={
              highestDailyArea
                ? highestDailyArea.floor_area
                : "Loading..."
            }
            note={
              highestDailyArea
                ? `${Number(highestDailyArea.total_kwh).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })} kWh on ${new Date(highestDailyArea.date).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}`
                : "Highest single-day area usage"
            }
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
                      {selectedView === "monthly"
                        ? "Monthly overview: Jan–May sample values, June from backend data"
                        : `${
                            selectedView.charAt(0).toUpperCase() +
                            selectedView.slice(1)
                          } electricity usage from backend data`}
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
                    <LineChart data={activeTrendData}>
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
                          `${Number(value).toFixed(2)} kWh`,
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
                  <h3>{liveFluctuationData[liveFluctuationData.length - 1]?.load || 0} kW</h3>
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
              <InsightBox>
                <SmartRecommendations />
              </InsightBox>

              <InsightBox title="Live Alerts">
                <LiveAlerts />
              </InsightBox>
            </div>
          </div>

          <div className="chart-panel zone-panel">
            <div className="panel-header zone-header">
              <div>
                <h2>Hierarchical Zone Comparison</h2>
                <span>
                  {selectedView === "monthly"
                    ? "Total electricity usage by floor and category for June 2026 (kWh)"
                    : `Average ${
                        selectedView.charAt(0).toUpperCase() + selectedView.slice(1)
                      } electricity usage by floor and category (kWh)`}
                </span>
              </div>
            </div>

            <div className="zone-concept-layout updated-zone-layout">
              <div className="zone-main-chart-card equal-zone-card">
                <div className="zone-card-top">
                  <div>
                    <div className="zone-subtitle">
                      Building Level Floor / Area Share
                    </div>
                    <p className="zone-small-text">
                      Energy share by floor/service area.
                    </p>
                  </div>
                </div>

                <div className="zone-main-pie">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <Pie
                        data={currentZoneSummary}
                        dataKey="usage"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={78}
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
                        formatter={(value) => [
                          `${Number(value).toFixed(2)} kWh`,
                          "Total Usage",
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

                <div className="zone-legend-list">
                  {currentZoneSummary.map((zone) => (
                    <button
                      key={zone.name}
                      className={
                        selectedZone === zone.name
                          ? "zone-legend-item active-zone-legend"
                          : "zone-legend-item"
                      }
                      onClick={() => setSelectedZone(zone.name)}
                    >
                      <span style={{ backgroundColor: zone.fill }}></span>
                      <b>{zone.name}</b>
                      <strong>{Number(zone.usage).toFixed(2)} kWh</strong>
                    </button>
                  ))}
                </div>
              </div>

              <div className="zone-breakdown-card equal-zone-card">
                <div className="zone-card-top">
                  <div>
                    <div className="zone-subtitle">
                      Functional Category Breakdown
                    </div>
                    <p className="zone-small-text">Energy use by category.</p>
                  </div>
                </div>

                <div className="selected-area-box">
                  <span>Selected Area</span>
                  <strong>{selectedZone}</strong>
                </div>

                <div className="category-bar-list">
                  {currentZoneBreakdown.map((item) => (
                    <div key={item.name} className="category-bar-item">
                      <div className="category-bar-header">
                        <span>{item.name}</span>
                        <strong>{Number(item.value).toFixed(1)}%</strong>
                      </div>

                      <div className="category-bar-track">
                        <div
                          className="category-bar-fill"
                          style={{
                            width: `${item.value}%`,
                            backgroundColor: item.fill,
                          }}
                        ></div>
                      </div>

                      <div className="category-kwh-value">
                        {Number.isFinite(Number(item.kwh))
                          ? `${Number(item.kwh).toFixed(2)} kWh`
                          : "0.00 kWh"}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="zone-total-box">
                  <p>{selectedZone} Total Energy Usage</p>
                  <h3>{Number(selectedZoneTotal).toFixed(2)} kWh</h3>
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