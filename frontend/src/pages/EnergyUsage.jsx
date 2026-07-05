import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";

import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";

function EnergyUsage() {
  const [selectedView, setSelectedView] = useState("daily");

  const [summaryData, setSummaryData] = useState(null);
  const [dailyApiData, setDailyApiData] = useState([]);
  const [hourlyApiData, setHourlyApiData] = useState([]);
  const [weeklyApiData, setWeeklyApiData] = useState([]);
  const [monthlyApiData, setMonthlyApiData] = useState([]);

  useEffect(() => {
    const fetchEnergyUsageData = async () => {
      try {
        const summaryResponse = await fetch(
          "http://127.0.0.1:8000/energy/summary"
        );

        const dailyResponse = await fetch(
          "http://127.0.0.1:8000/energy/daily"
        );

        const hourlyResponse = await fetch(
          "http://127.0.0.1:8000/energy/hourly"
        );

        const weeklyResponse = await fetch(
          "http://127.0.0.1:8000/energy/weekly"
        );

        const monthlyResponse = await fetch(
          "http://127.0.0.1:8000/energy/monthly"
        );

        const summary = await summaryResponse.json();
        const daily = await dailyResponse.json();
        const hourly = await hourlyResponse.json();
        const weekly = await weeklyResponse.json();
        const monthly = await monthlyResponse.json();

        setSummaryData(summary);
        setDailyApiData(Array.isArray(daily) ? daily : []);
        setHourlyApiData(Array.isArray(hourly) ? hourly : []);
        setWeeklyApiData(Array.isArray(weekly) ? weekly : []);
        setMonthlyApiData(Array.isArray(monthly) ? monthly : []);
      } catch (error) {
        console.error("Error fetching energy usage data:", error);
      }
    };

    fetchEnergyUsageData();
  }, []);

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

  const activeTotal = activeTrendData.reduce(
    (sum, item) => sum + (Number(item.usage) || 0),
    0
  );

  const activePeak =
    activeTrendData.length > 0
      ? activeTrendData.reduce((max, item) =>
          Number(item.usage) > Number(max.usage) ? item : max
        )
      : null;

  const activeAverage =
    activeTrendData.length > 0 ? activeTotal / activeTrendData.length : 0;

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <p className="eyebrow">Detailed Consumption Analysis</p>
            <h1>Energy Usage</h1>
            <p className="header-subtitle">
              Hourly, daily, weekly, and monthly electricity usage analysis for
              the Academic and Laboratory Building
            </p>
          </div>
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
            note="Total building consumption for June 2026"
          />

          <SummaryCard
            title={`${selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} View Total`}
            value={`${activeTotal.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })} kWh`}
            note="Total usage for selected chart view"
          />

          <SummaryCard
            title="Peak Value"
            value={
              activePeak
                ? `${Number(activePeak.usage).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })} kWh`
                : "Loading..."
            }
            note={activePeak ? `Highest point: ${activePeak.time}` : "Loading peak value"}
          />

          <SummaryCard
            title="Average Value"
            value={`${activeAverage.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })} kWh`}
            note="Average value for selected chart view"
          />
        </section>

        <section className="chart-panel" style={{ marginBottom: 26 }}>
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
            <ResponsiveContainer width="100%" height={360}>
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
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 22,
          }}
        >
          <div className="chart-panel">
            <div className="panel-header">
              <div>
                <h2>Energy Distribution</h2>
                <span>Area view of selected energy usage trend</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={activeTrendData}>
                <defs>
                  <linearGradient id="energyUsageArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#145c7a" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#9fd9ea" />
                <YAxis stroke="#9fd9ea" />

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

                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="#22d3ee"
                  fill="url(#energyUsageArea)"
                  strokeWidth={3}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-panel">
            <div className="panel-header">
              <div>
                <h2>Usage Interpretation</h2>
                <span>Explanation of selected energy usage period</span>
              </div>
            </div>

            <div style={{ color: "#dff8ff", lineHeight: 1.7, fontSize: 15 }}>
              <p>
                This page provides a focused view of building electricity
                consumption. The selected chart view helps compare short-term and
                long-term usage patterns.
              </p>

              <p>
                Hourly and daily views are useful for identifying peak demand
                periods, while weekly and monthly views support broader energy
                planning and reporting.
              </p>

              <p>
                The June 2026 values are loaded from the PostgreSQL backend. The
                previous monthly values are used as sample comparison values for
                visual trend demonstration.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default EnergyUsage;