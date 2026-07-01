import { useState, useEffect } from "react";

export default function SmartRecommendations() {

  const [recommendations, setRecommendations] = useState([]);



  
  useEffect(() => {

    async function loadRecommendations() {

      try {

        const res = await fetch("http://localhost:8000/recommendations");
        const data = await res.json();

        setRecommendations(data);

      } catch {

        setRecommendations([
          {
            title: "Unavailable",
            detail: "Recommendation service unavailable.",
            floor: "N/A",
            category: "General",
          },
        ]);

      }

    }

    loadRecommendations();

  }, []);

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





  return (

    <div className="chart-panel">

      <div className="panel-header">
        <h2>💡 Smart AI Recommendations</h2>
      </div>

      {recommendations.length === 0 ? (

        <p style={{ color: "#94a3b8" }}>
          Loading recommendations...
        </p>

      ) : (

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >

          {recommendations.map((rec, index) => (

            <div
              key={index}
              style={{
                padding: "14px",
                borderRadius: "8px",
                background: "#07152e",
                border: "1px solid #145c7a",
              }}
            >

              <div style={{ marginBottom: "6px" }}>

                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "#000",
                    backgroundColor: getCategoryColor(rec.category),
                    marginRight: "8px",
                  }}
                >
                  {rec.category}
                </span>

                <span
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                  }}
                >
                  📍 {rec.floor}
                </span>

              </div>

              <p
                style={{
                  margin: "6px 0 4px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#e2e8f0",
                }}
              >
                {rec.title}
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#94a3b8",
                  lineHeight: "1.5",
                }}
              >
                {rec.detail}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}