import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Movies from "./Movies";
import Booking from "./Booking";
import "./App.css";

function App() {
  useEffect(() => {
    // Create shooting stars
    const createShootingStar = () => {
      const star = document.createElement("div");
      star.className = "shooting-star";
      star.style.top = Math.random() * 50 + "%";
      star.style.left = Math.random() * 100 + "%";
      star.style.animationDelay = Math.random() * 3 + "s";
      star.style.animationDuration = Math.random() * 2 + 2 + "s";
      document.querySelector(".App").appendChild(star);

      setTimeout(() => {
        star.remove();
      }, 5000);
    };

    // Create a shooting star every 2 seconds
    const interval = setInterval(createShootingStar, 2000);

    // Create initial stars
    for (let i = 0; i < 3; i++) {
      setTimeout(createShootingStar, i * 700);
    }

    return () => clearInterval(interval);
  }, []);

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
