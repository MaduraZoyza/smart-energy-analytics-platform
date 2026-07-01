import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Energy Usage", path: "/" },
    { name: "Zone Analytics", path: "/" },
    { name: "AI Insights", path: "/" },
    { name: "Reports", path: "/reports" },
    { name: "Settings", path: "/" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">⚡</div>
        <div>
          <h2>Smart Energy</h2>
          <p>Analytics Platform</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;