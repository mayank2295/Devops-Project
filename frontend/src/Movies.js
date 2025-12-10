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

  if (loading) return <div className="loading">Loading movies...</div>;

  return (
    <div className="movies-container">
      <div className="header">
        <h1>🎬 Book Your Movie Tickets</h1>
        <p className="subtitle">
          Select your favorite movie and book instantly!
        </p>
      </div>

      <div className="city-filter">
        <label>📍 Select City:</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="movies-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="movie-poster">
              <div className="genre-badge">{movie.genre}</div>
            </div>
            <div className="movie-info">
              <h2>{movie.title}</h2>
              <div className="movie-details">
                <span className="detail-item">🎭 {movie.genre}</span>
                <span className="detail-item">🗣️ {movie.language}</span>
                <span className="detail-item">⏱️ {movie.duration} min</span>
              </div>
              <button
                className="book-btn"
                onClick={() =>
                  (window.location.href = `/booking/${movie.id}?city=${selectedCity}`)
                }
              >
                Book Tickets →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Movies;
