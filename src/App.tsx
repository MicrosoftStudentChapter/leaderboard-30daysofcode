
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home/home";
import LeaderboardPage from "./leaderboard/leaderboard";
export default function App() {
  return(
  <Router>
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/leaderboard" element={<LeaderboardPage />} />
    </Routes>
  </Router>
  );
}



