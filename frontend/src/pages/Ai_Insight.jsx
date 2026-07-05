import { useState } from "react";
import Sidebar from "../components/Sidebar";
import LiveAlerts from "../components/LiveAlerts";
import SmartRecommendations from "../components/SmartRecommendations";

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function AiInsight() {
  // -------------------------
  // STATE
  // -------------------------
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  // -------------------------
  // ASK AI (POST /chat)
  // -------------------------
  async function ask() {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
        }),
      });

      const data = await res.json();
      setAnswer(data);
    } catch {
      setAnswer({
        response: "Something went wrong. Try again.",
        sql: "",
      });
    }

    setLoading(false);
  }

  // -------------------------
  // CATEGORY COLOR HELPER
  // -------------------------
  function getCategoryColor(category) {
    const colors = {
      HVAC: "#38bdf8",
      Lighting: "#facc15",
      "Plug Loads": "#fb923c",
      "Server Room": "#a78bfa",
      Elevators: "#34d399",
      General: "#94a3b8",
    };

    return colors[category] || "#94a3b8";
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="app-layout">
      <Sidebar />

      <main
        className="main-content"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* ---- CONTENT WRAPPER ---- */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "20px" }}>
          {/* ---- HEADER ---- */}
          <div className="page-header">
            <div>
              <p className="eyebrow">AI Assistant</p>
              <h1>⚡ Smart Energy - AI Insights</h1>
              <p className="header-subtitle">
                Ask anything about energy usage, savings, or efficiency
              </p>
            </div>
          </div>

          {/* ---- MAIN CONTENT LAYOUT ---- */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr",
              gap: "22px",
            }}
          >
            {/* ---- LEFT COLUMN: Chat and Alerts ---- */}
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              {/* ---- CHAT SECTION ---- */}
              <div className="chart-panel">
                <div className="panel-header">
                  <h2>Ask Your Question</h2>
                </div>

                {/* ---- INPUT ROW ---- */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. What is the energy consumption at ground floor?"
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #176c8d",
                      outline: "none",
                      background: "#07152e",
                      color: "#dff8ff",
                      fontFamily: "Segoe UI, Arial, sans-serif",
                    }}
                  />

                  <button
                    onClick={ask}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "8px",
                      border: "1px solid #22d3ee",
                      cursor: "pointer",
                      background: "#0a7896",
                      color: "#fff",
                      fontWeight: "600",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#0e8fb0";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#0a7896";
                    }}
                  >
                    {loading ? "Thinking..." : "Ask"}
                  </button>
                </div>

                {/* ---- ANSWER BOX ---- */}
                <div
                  style={{
                    padding: "15px",
                    borderRadius: "8px",
                    background: "#07152e",
                    border: "1px solid #176c8d",
                    minHeight: "100px",
                  }}
                >
                  <h3 style={{ margin: "0 0 8px", color: "#22d3ee" }}>
                    Answer
                  </h3>

                  {answer ? (
                    <>
                      <p
                        style={{
                          color: "#cbd5e1",
                          lineHeight: "1.5",
                          margin: "0 0 12px",
                        }}
                      >
                        {answer.response}
                      </p>

                      <hr
                        style={{
                          borderColor: "#176c8d",
                          margin: "12px 0",
                        }}
                      />

                      <h4
                        style={{
                          color: "#e7d84b",
                          fontSize: "14px",
                          margin: "12px 0 8px",
                        }}
                      >
                        Generated SQL
                      </h4>

                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          color: "#21ff8a",
                          fontSize: "12px",
                          background: "#051118",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #145c7a",
                          overflow: "auto",
                        }}
                      >
                        {answer.sql}
                      </pre>
                    </>
                  ) : (
                    <p style={{ color: "#94a3b8", margin: 0 }}>
                      Your response will appear here...
                    </p>
                  )}
                </div>
              </div>

              {/* ---- LIVE ALERTS WIDGET ---- */}
              <div className="chart-panel">
                <LiveAlerts />
              </div>
            </div>

            {/* ---- RIGHT COLUMN: SMART RECOMMENDATIONS ---- */}
            <div className="chart-panel">
              <SmartRecommendations />
            </div>
          </div>
        </div>

        {/* ---- FOOTER ---- */}
        <div
          style={{
            textAlign: "center",
            padding: "18px",
            color: "#9fd9ea",
            fontSize: 13,
            borderTop: "1px solid #176c8d",
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Smart Energy Analytics Platform — Generated{" "}
          {new Date().toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
          })}{" "}
          · Data source: PostgreSQL energy_readings (18,000 records)
        </div>
      </main>
    </div>
  );
}
