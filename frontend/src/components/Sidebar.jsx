import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Energy Usage", path: "/" },
    { label: "Zone Analytics", path: "/" },
    { label: "AI Insights", path: "/" },
    { label: "Alerts", path: "/" },
    { label: "Reports", path: "/reports" },
    { label: "Settings", path: "/" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand-box">
        <div className="brand-icon">⚡</div>
        <div>
          <h2 className="sidebar-title">Energy AI</h2>
          <p>Smart Building</p>
        </div>
      </div>
      <nav>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={
              location.pathname === item.path && item.path !== "/" 
                ? "sidebar-item active"
                : location.pathname === "/" && item.label === "Dashboard"
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
