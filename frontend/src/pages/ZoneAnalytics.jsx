import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";

import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";

function ZoneAnalytics() {
  const [selectedView, setSelectedView] = useState("monthly");
  const [selectedZone, setSelectedZone] = useState("Floor 1");

  const [zoneApiData, setZoneApiData] = useState([]);
  const [zoneByViewData, setZoneByViewData] = useState([]);

  useEffect(() => {
    const fetchInitialZoneData = async () => {
      try {
        const zonesResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/energy/zones`
        );

        const zones = await zonesResponse.json();
        setZoneApiData(Array.isArray(zones) ? zones : []);
      } catch (error) {
        console.error("Error fetching initial zone data:", error);
        setZoneApiData([]);
      }
    };

    fetchInitialZoneData();
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

  const activeZoneData =
    zoneByViewData.length > 0 ? zoneByViewData : zoneApiData;

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

  const currentZoneSummary =
    activeZoneData.length > 0 ? buildZoneSummary(activeZoneData) : [];

  const currentZoneBreakdown =
    activeZoneData.length > 0
      ? buildCategoryBreakdown(selectedZone, activeZoneData)
      : [];

  const selectedZoneTotal =
    currentZoneSummary.find((item) => item.name === selectedZone)?.usage || 0;

  const totalBuildingUsage = currentZoneSummary.reduce(
    (sum, item) => sum + (Number(item.usage) || 0),
    0
  );

  const highestZone =
    currentZoneSummary.length > 0
      ? currentZoneSummary.reduce((max, item) =>
          Number(item.usage) > Number(max.usage) ? item : max
        )
      : null;

  const highestCategory =
    currentZoneBreakdown.length > 0
      ? currentZoneBreakdown.reduce((max, item) =>
          Number(item.kwh) > Number(max.kwh) ? item : max
        )
      : null;

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <p className="eyebrow">Floor and Category Analysis</p>
            <h1>Zone Analytics</h1>
            <p className="header-subtitle">
              Energy comparison by floor area and functional category for the
              Academic and Laboratory Building
            </p>
          </div>
        </div>

        <section className="summary-grid">
          <SummaryCard
            title="Selected View Total"
            value={`${totalBuildingUsage.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })} kWh`}
            note={`${selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} building usage`}
          />

          <SummaryCard
            title="Highest Usage Area"
            value={highestZone ? highestZone.name : "Loading..."}
            note={
              highestZone
                ? `${highestZone.usage.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })} kWh`
                : "Calculating highest floor area"
            }
          />

          <SummaryCard
            title="Selected Area"
            value={selectedZone}
            note={`${selectedZoneTotal.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })} kWh total usage`}
          />

          <SummaryCard
            title="Main Category in Selected Area"
            value={highestCategory ? highestCategory.name : "Loading..."}
            note={
              highestCategory
                ? `${highestCategory.kwh.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })} kWh · ${highestCategory.value}%`
                : "Calculating category breakdown"
            }
          />
        </section>

        <section className="chart-panel" style={{ marginBottom: 26 }}>
          <div className="panel-header">
            <div>
              <h2>Zone Usage View</h2>
              <span>
                {selectedView === "monthly"
                  ? "Total electricity usage by floor and category for June 2026"
                  : `Average ${
                      selectedView.charAt(0).toUpperCase() +
                      selectedView.slice(1)
                    } electricity usage by floor and category`}
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 22,
              marginTop: 16,
            }}
          >
            <div className="zone-main-chart-card equal-zone-card">
              <div className="zone-card-top">
                <div>
                  <div className="zone-subtitle">
                    Building Level Floor / Area Share
                  </div>
                  <p className="zone-small-text">
                    Click a floor or service area to view its category usage.
                  </p>
                </div>
              </div>

              <div className="zone-main-pie">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <Pie
                      data={currentZoneSummary}
                      dataKey="usage"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
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
                  <p className="zone-small-text">
                    Energy usage categories inside the selected floor area.
                  </p>
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
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 22,
          }}
        >
          <div className="chart-panel">
            <div className="panel-header">
              <div>
                <h2>Floor / Area Ranking</h2>
                <span>Comparison of total usage by floor or service area</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={currentZoneSummary} layout="vertical">
                <CartesianGrid stroke="#145c7a" strokeDasharray="3 3" />

                <XAxis type="number" stroke="#9fd9ea">
                  <Label
                    value="Energy Usage (kWh)"
                    position="insideBottom"
                    offset={-5}
                    style={{ fill: "#9fd9ea", fontSize: 13 }}
                  />
                </XAxis>

                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#9fd9ea"
                  width={160}
                  tick={{ fontSize: 11 }}
                />

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

                <Bar dataKey="usage" radius={[0, 6, 6, 0]}>
                  {currentZoneSummary.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-panel">
            <div className="panel-header">
              <div>
                <h2>Zone Data Table</h2>
                <span>Detailed floor and category energy values</span>
              </div>
            </div>

            <div style={{ overflowY: "auto", maxHeight: 330 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #176c8d" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px 10px",
                        color: "#e7d84b",
                      }}
                    >
                      Floor / Area
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px 10px",
                        color: "#e7d84b",
                      }}
                    >
                      Category
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "8px 10px",
                        color: "#e7d84b",
                      }}
                    >
                      Total kWh
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {activeZoneData.map((item, index) => (
                    <tr
                      key={`${item.floor_area}-${item.category}-${index}`}
                      style={{
                        borderBottom: "1px solid #145c7a",
                        backgroundColor:
                          index % 2 === 0 ? "#07182e" : "transparent",
                      }}
                    >
                      <td
                        style={{
                          padding: "8px 10px",
                          color: floorColors[item.floor_area] || "#22d3ee",
                          fontWeight: 600,
                        }}
                      >
                        {item.floor_area}
                      </td>

                      <td style={{ padding: "8px 10px", color: "#dff8ff" }}>
                        {item.category}
                      </td>

                      <td
                        style={{
                          padding: "8px 10px",
                          textAlign: "right",
                          color: "#ffffff",
                          fontWeight: 600,
                        }}
                      >
                        {Number(item.total_kwh).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ZoneAnalytics;