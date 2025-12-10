import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Movies from "./Movies";
import Booking from "./Booking";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Movies />} />
          <Route path="/booking/:movieId" element={<Booking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
