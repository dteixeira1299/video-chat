import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/Landing.page";
import { CallPage } from "./pages/Call.page";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/call" element={<CallPage />} />
    </Routes>
  );
}

export default App;
