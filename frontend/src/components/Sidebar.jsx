function Sidebar() {
  const menuItems = [
    "Dashboard",
    "Energy Usage",
    "Zone Analytics",
    "AI Insights",
    "Alerts",
    "Reports",
    "Settings",
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
            className={index === 0 ? "sidebar-item active" : "sidebar-item"}
          >
            {item}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;