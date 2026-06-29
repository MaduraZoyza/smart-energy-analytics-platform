import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import AiInsight from "./pages/Ai_Insight";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai-insights" element={<AiInsight />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
