import { useState } from "react";
import Sidebar from "../components/Sidebar";

function Settings() {
  const [theme, setTheme] = useState("Dark");
  const [reportMonth, setReportMonth] = useState("June 2026");
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <p className="eyebrow">System Preferences</p>
            <h1>Settings</h1>
            <p className="header-subtitle">
              Manage basic display, report, and system preferences
            </p>
          </div>
        </div>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 22,
          }}
        >
          {/* General Settings */}
          <div className="chart-panel">
            <div className="panel-header">
              <div>
                <h2>General Settings</h2>
                <span>Basic system preferences</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <SettingSelect
                label="Theme"
                value={theme}
                onChange={setTheme}
                options={["Dark", "Light"]}
              />

              <SettingSelect
                label="Default Report Month"
                value={reportMonth}
                onChange={setReportMonth}
                options={["June 2026", "May 2026", "April 2026"]}
              />

              <SettingToggle
                label="Enable Notifications"
                description="Show alerts and energy warnings in the system."
                checked={notifications}
                onChange={setNotifications}
              />

              <SettingToggle
                label="Auto Refresh Data"
                description="Automatically refresh dashboard data during monitoring."
                checked={autoRefresh}
                onChange={setAutoRefresh}
              />
            </div>
          </div>

          {/* System Information */}
          <div className="chart-panel">
            <div className="panel-header">
              <div>
                <h2>System Information</h2>
                <span>Current prototype configuration</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InfoRow label="Application" value="Smart Energy Analytics Platform" />
              <InfoRow label="Building Type" value="Academic and Laboratory Building" />
              <InfoRow label="Frontend" value="React + Vite" />
              <InfoRow label="Backend" value="FastAPI" />
              <InfoRow label="Database" value="PostgreSQL" />
              <InfoRow label="Data Period" value="June 2026" />
            </div>
          </div>
        </section>

        <section className="chart-panel" style={{ marginTop: 26 }}>
          <div className="panel-header">
            <div>
              <h2>Account and Access</h2>
              <span>Demo user access information</span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
            }}
          >
            <InfoCard title="User Role" value="System Viewer" />
            <InfoCard title="Access Level" value="Demo Access" />
            <InfoCard title="AI Features" value="Enabled" />
          </div>
        </section>

        <section className="chart-panel" style={{ marginTop: 26 }}>
          <div className="panel-header">
            <div>
              <h2>Save Changes</h2>
              <span>Settings are shown for prototype demonstration</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
            }}
          >
            <p style={{ color: "#9fd9ea", margin: 0 }}>
              These settings are stored temporarily in the frontend for demo
              purposes.
            </p>

            <button className="export-button" type="button">
              Save Settings
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function SettingSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          color: "#dff8ff",
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: 8,
          border: "1px solid #176c8d",
          background: "#07152e",
          color: "#ffffff",
          outline: "none",
        }}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function SettingToggle({ label, description, checked, onChange }) {
  return (
    <div
      style={{
        background: "#07182e",
        border: "1px solid #145c7a",
        borderRadius: 10,
        padding: "14px",
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div>
        <h3 style={{ margin: "0 0 5px", color: "#ffffff", fontSize: 16 }}>
          {label}
        </h3>
        <p style={{ margin: 0, color: "#9fd9ea", fontSize: 13 }}>
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: 20,
          height: 20,
          cursor: "pointer",
        }}
      />
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        background: "#07182e",
        border: "1px solid #145c7a",
        borderRadius: 10,
        padding: "12px 14px",
      }}
    >
      <p
        style={{
          margin: "0 0 5px",
          color: "#9fd9ea",
          fontSize: 13,
        }}
      >
        {label}
      </p>
      <strong style={{ color: "#ffffff", fontSize: 15 }}>{value}</strong>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div
      style={{
        background: "#07182e",
        border: "1px solid #176c8d",
        borderRadius: 12,
        padding: "18px",
      }}
    >
      <p style={{ margin: "0 0 8px", color: "#9fd9ea", fontSize: 13 }}>
        {title}
      </p>
      <h3 style={{ margin: 0, color: "#22d3ee", fontSize: 22 }}>{value}</h3>
    </div>
  );
}

export default Settings;
