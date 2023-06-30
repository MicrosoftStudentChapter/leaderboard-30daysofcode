import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DisqualifiedPage from "./disqBoard/disqboard";
import Home from "./Home/home";
import LeaderboardPage from "./leaderboard/leaderboard";
export default function App() {
  return(
  <Router>
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/leaderboard" element={<LeaderboardPage />} />
    <Route path="/disqualified" element={<DisqualifiedPage />} />
    </Routes>
  </Router>
  );
}



