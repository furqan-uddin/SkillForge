import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CareerForm from "./pages/CareerForm";
import AIRoadmap from "./pages/AIRoadmap";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/career-form" element={<CareerForm />} />
        <Route path="/ai-roadmap" element={<AIRoadmap />} />
      </Routes>
    </Router>
  );
}

export default App;
