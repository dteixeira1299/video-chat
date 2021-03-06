import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/Landing.page";
import { WaitingPage } from "./pages/Waiting.page";
import { CallPage } from "./pages/Call.page";
import React from "react";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/waiting/:roomId" element={<WaitingPage />} />
      <Route path="/call/:roomId" element={<CallPage />} />
    </Routes>
  );
}

export default App;
