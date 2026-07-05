import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import AiInsight from "./pages/Ai_Insight";
import EnergyUsage from "./pages/EnergyUsage";
import ZoneAnalytics from "./pages/ZoneAnalytics";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/energy-usage" element={<EnergyUsage />} />
        <Route path="/zone-analytics" element={<ZoneAnalytics />} />
        <Route path="/ai-insights" element={<AiInsight />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;