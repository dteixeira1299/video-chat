import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/Landing";
import "./App.css";
import { CallPage } from "./pages/Call";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/call" element={<CallPage />} />
    </Routes>
  );
}

export default App;
