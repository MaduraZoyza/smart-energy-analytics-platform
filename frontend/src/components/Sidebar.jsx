import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Energy Usage", path: "/" },
    { name: "Zone Analytics", path: "/" },
    { name: "AI Insights", path: "/ai-insights" },
    { name: "Reports", path: "/reports" },
    { name: "Settings", path: "/" },
  ];

  useEffect(() => {
    if (location.pathname === "/reports") {
      setActiveTab("Reports");
    } else if (location.pathname === "/ai-insights") {
      setActiveTab("AI Insights");
    } else if (location.pathname === "/") {
      setActiveTab("Dashboard");
    }
  }, [location.pathname]);

  const handleNavigation = (item) => {
    setActiveTab(item.name);
    navigate(item.path);
  };

  return (
    <aside className="sidebar">
      <div className="brand-box">
        <div className="brand-icon">⚡</div>

        <div>
          <h2 className="sidebar-title">Smart Energy</h2>
          <p>Analytics Platform</p>
        </div>
      </div>

      <nav>
        {menuItems.map((item) => (
          <button
            key={item.name}
            type="button"
            className={`sidebar-item ${
              activeTab === item.name ? "active" : ""
            }`}
            onClick={() => handleNavigation(item)}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;