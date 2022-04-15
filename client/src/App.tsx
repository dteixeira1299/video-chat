import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/Landing.page";
import { CallPage } from "./pages/Call.page";
import React from "react";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/waiting/:code" element={<CallPage />} />
    </Routes>
  );
}

export default App;
