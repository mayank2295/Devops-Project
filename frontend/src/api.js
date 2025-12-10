import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const getMovies = () => axios.get(`${API_BASE_URL}/movies`);
export const getTheaters = () => axios.get(`${API_BASE_URL}/theaters`);
export const getShows = () => axios.get(`${API_BASE_URL}/shows`);
export const getShowsByMovie = (movieId) =>
  axios.get(`${API_BASE_URL}/shows?movieId=${movieId}`);
export const getShowsByTheater = (theaterId) =>
  axios.get(`${API_BASE_URL}/shows?theaterId=${theaterId}`);
export const getSeatsByShow = (showId) =>
  axios.get(`${API_BASE_URL}/shows/${showId}/seats`);
export const createBooking = (bookingData) =>
  axios.post(`${API_BASE_URL}/bookings`, bookingData);
