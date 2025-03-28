import { BrowserRouter as Router, Route, Routes, useParams, Navigate } from "react-router-dom";
import GamePage from "./GamePage"; 

const getDaysSinceStart = (startDate) => {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = now - start;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={`/${getDaysSinceStart("2025-03-23")}`} />} />
        <Route path="/:day" element={<GamePage />} />
      </Routes>
    </Router>
  );
}