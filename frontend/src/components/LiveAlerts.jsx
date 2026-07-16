import { useState, useEffect } from "react";

export default function LiveAlerts() {

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {

    async function loadAlerts() {

      try {

        const res = await fetch(`${import.meta.env.VITE_API_URL}/alerts`);
        const data = await res.json();

        setAlerts(data);

      } catch {

        setAlerts([
          {
            text: "Alert service unavailable",
            color: "#ef4444",
          },
        ]);

      }

    }

    loadAlerts();

  }, []);

  return (

    <div className="chart-panel">

      <div className="panel-header">
        <h2>⚠️ Live Alerts</h2>
      </div>

      {alerts.length === 0 ? (

        <p style={{ color: "#94a3b8" }}>
          Loading alerts...
        </p>

      ) : (

        <ul
          style={{
            margin: 0,
            paddingLeft: "18px",
            listStyle: "none",
          }}
        >

          {alerts.map((alert, index) => (

            <li
              key={index}
              style={{
                marginBottom: "10px",
                lineHeight: "1.6",
                fontSize: "14px",
                color: alert.color,
              }}
            >
              {alert.text}
            </li>

          ))}

        </ul>

      )}

    </div>

  );

}