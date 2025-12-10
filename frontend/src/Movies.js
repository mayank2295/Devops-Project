import React, { useEffect, useState } from "react";
import { getMovies, getTheaters, getShows } from "./api";
import "./Movies.css";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    Promise.all([getMovies(), getTheaters(), getShows()])
      .then(([moviesRes, theatersRes, showsRes]) => {
        setAllMovies(moviesRes.data);
        setMovies(moviesRes.data);
        setTheaters(theatersRes.data);
        setShows(showsRes.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedCity === "All") {
      setMovies(allMovies);
    } else {
      // Filter movies that have shows in the selected city
      const moviesInCity = shows
        .filter((show) => show.theater.city === selectedCity)
        .map((show) => show.movie.id);
      const uniqueMovieIds = [...new Set(moviesInCity)];
      const filteredMovies = allMovies.filter((movie) =>
        uniqueMovieIds.includes(movie.id)
      );
      setMovies(filteredMovies);
    }
  }, [selectedCity, allMovies, shows]);

  const cities = ["All", ...new Set(theaters.map((t) => t.city))];

  // Toast notification function
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
  };

  // Generate movie poster URL (using TMDB-style images)
  const getMoviePoster = (title, genre) => {
    // Map of movie titles to real poster images
    const posterMap = {
      Chhava: "https://image.tmdb.org/t/p/w500/kKgQzkUCnQmeTPkyIwHly2t6ZFI.jpg",
      "Pushpa 2":
        "https://image.tmdb.org/t/p/w500/8rfWZ8b9KOhAFD5xJPUBr1FgfQX.jpg",
      Mufasa: "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
      "Sonic 3":
        "https://image.tmdb.org/t/p/w500/yRaP8PNM6c9pghN0NEdTnCMWq5z.jpg",
      "Moana 2":
        "https://image.tmdb.org/t/p/w500/4YZpsylmjHbqeWzjKpUEF8gcLNW.jpg",
      Wicked: "https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg",
      "Gladiator II":
        "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
      default:
        "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    };
    return posterMap[title] || posterMap["default"];
  };

  // Generate random rating for movies (4-5 stars)
  const getMovieRating = (movieId) => {
    const ratings = [4.2, 4.5, 4.7, 4.8, 4.3, 4.6, 4.9];
    return ratings[movieId % ratings.length];
  };

  if (loading) {
    return (
      <div className={`movies-container ${darkMode ? "dark-mode" : ""}`}>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          <span className="dark-mode-toggle-icon">
            {darkMode ? "☀️" : "🌙"}
          </span>
          {darkMode ? "Light" : "Dark"} Mode
        </button>
        <div className="loading-skeleton">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton-header"></div>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-button"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`movies-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span className="toast-icon">
              {toast.type === "success" && "✅"}
              {toast.type === "error" && "❌"}
              {toast.type === "info" && "ℹ️"}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-close"
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Dark Mode Toggle */}
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        <span className="dark-mode-toggle-icon">{darkMode ? "☀️" : "🌙"}</span>
        {darkMode ? "Light" : "Dark"} Mode
      </button>

      <div className="header">
        <h1 className="header-title">Book Your Movie Tickets</h1>
        <p className="subtitle">
          Select your favorite movie and book instantly!
        </p>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{movies.length}</span>
            <span className="stat-label">Movies</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{theaters.length}</span>
            <span className="stat-label">Theaters</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{shows.length}</span>
            <span className="stat-label">Shows</span>
          </div>
        </div>
      </div>

      <div className="city-filter">
        <div className="filter-content">
          <label>Select City:</label>
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              showToast(
                `Showing movies in ${e.target.value === "All" ? "all cities" : e.target.value}`,
                "info"
              );
            }}
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="no-movies">
          <h2>No Movies Available</h2>
          <p>Check back later for new releases!</p>
        </div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie, index) => {
            const rating = getMovieRating(movie.id);
            return (
              <div
                key={movie.id}
                className="movie-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="movie-poster-wrapper">
                  <img
                    src={getMoviePoster(movie.title, movie.genre)}
                    alt={movie.title}
                    className="movie-poster-image"
                    loading="lazy"
                  />
                  <div className="movie-poster-overlay">
                    <button
                      className="quick-view-btn"
                      onClick={() =>
                        showToast(`${movie.title} - ${movie.genre}`, "info")
                      }
                    >
                      Quick View
                    </button>
                  </div>
                  <div className="genre-badge">{movie.genre}</div>
                  <div className="rating-badge">
                    <span className="star">★</span>
                    <span className="rating-value">{rating}</span>
                  </div>
                </div>
                <div className="movie-info">
                  <h2 className="movie-title">{movie.title}</h2>
                  <div className="movie-meta">
                    <span className="meta-item">{movie.language}</span>
                    <span className="meta-item">{movie.duration} min</span>
                  </div>
                  <div className="movie-stats">
                    <div className="stat">
                      <span className="stat-text">{movie.genre}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-text">
                        {shows.filter((s) => s.movie.id === movie.id).length}{" "}
                        Shows
                      </span>
                    </div>
                  </div>
                  <button
                    className="book-btn"
                    onClick={() => {
                      showToast(
                        `Redirecting to book ${movie.title}...`,
                        "success"
                      );
                      setTimeout(() => {
                        window.location.href = `/booking/${movie.id}?city=${selectedCity}`;
                      }, 500);
                    }}
                  >
                    <span className="btn-text">Book Tickets</span>
                    <span className="btn-icon">→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Movies;
