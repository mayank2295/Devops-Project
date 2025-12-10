import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  getMovies,
  getShowsByMovie,
  getSeatsByShow,
  createBooking,
} from "./api";
import "./Booking.css";

function Booking() {
  const { movieId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedCity = searchParams.get("city") || "All";

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState(1); // 1: shows, 2: details, 3: seats, 4: payment
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showUpiScanner, setShowUpiScanner] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([getMovies(), getShowsByMovie(movieId)])
      .then(([moviesRes, showsRes]) => {
        const selectedMovie = moviesRes.data.find(
          (m) => m.id === parseInt(movieId)
        );
        setMovie(selectedMovie);
        console.log("All shows:", showsRes.data);
        console.log("Selected city:", selectedCity);
        setShows(showsRes.data);

        if (selectedCity !== "All") {
          const filtered = showsRes.data.filter(
            (show) => show.theater.city === selectedCity
          );
          console.log("Filtered shows:", filtered);
          setFilteredShows(filtered);
        } else {
          setFilteredShows(showsRes.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [movieId, selectedCity]);

  const handleShowSelect = (show) => {
    setSelectedShow(show);
    setStep(2);
  };

  const handleDetailsSubmit = () => {
    if (!userName || !userEmail || !userPhone) {
      alert("Please fill in all your details");
      return;
    }
    getSeatsByShow(selectedShow.id)
      .then((response) => {
        setSeats(response.data);
        setStep(3);
      })
      .catch((error) => console.error("Error fetching seats:", error));
  };

  const toggleSeat = (seat) => {
    if (seat.booked) return;

    if (selectedSeats.find((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const proceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    setStep(4);
  };

  const handlePayment = (paymentMethod) => {
    if (paymentMethod === "UPI") {
      setShowUpiScanner(true);
    } else {
      // For other methods, complete booking directly
      completeBooking();
    }
  };

  const completeBooking = () => {
    const bookingData = {
      user: {
        name: userName,
        email: userEmail,
        phone: userPhone,
      },
      show: { id: selectedShow.id },
      seatIds: selectedSeats.map((seat) => seat.id),
      seatsBooked: selectedSeats.length,
      totalPrice: selectedSeats.length * 200,
    };

    createBooking(bookingData)
      .then(() => {
        setBookingSuccess(true);
        setTimeout(() => (window.location.href = "/"), 4000);
      })
      .catch((error) => {
        console.error("Error creating booking:", error);
        alert("Booking failed. Please try again.");
      });
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (bookingSuccess) {
    return (
      <div className="success-container">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>Booking Confirmed!</h2>
          <p className="success-detail">Movie: {movie.title}</p>
          <p className="success-detail">
            Theater: {selectedShow.theater.name}, {selectedShow.theater.city}
          </p>
          <p className="success-detail">Show Time: {selectedShow.timing}</p>
          <p className="success-detail">
            Seats: {selectedSeats.map((s) => s.seatNumber).join(", ")}
          </p>
          <p className="success-detail">
            Total Paid: ₹{selectedSeats.length * 200}
          </p>
          <p className="redirect-msg">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
          1. Select Show
        </div>
        <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
          2. Enter Details
        </div>
        <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
          3. Select Seats
        </div>
        <div className={`progress-step ${step >= 4 ? "active" : ""}`}>
          4. Payment
        </div>
      </div>

      <button className="back-btn" onClick={() => (window.location.href = "/")}>
        ← Back to Movies
      </button>

      {movie && (
        <div className="movie-header">
          <h1>🎬 {movie.title}</h1>
          <p>
            {movie.genre} | {movie.language} | {movie.duration} mins
          </p>
        </div>
      )}

      {step === 1 && (
        <div className="shows-section">
          <h2>📍 Select Show Time & Theater</h2>
          {filteredShows.length === 0 ? (
            <p className="no-shows">No shows available for this city</p>
          ) : (
            <div className="shows-grid">
              {filteredShows.map((show) => (
                <div
                  key={show.id}
                  className="show-card"
                  onClick={() => handleShowSelect(show)}
                >
                  <div className="theater-name">🎭 {show.theater.name}</div>
                  <div className="city-name">📍 {show.theater.city}</div>
                  <div className="timing">🕐 {show.timing}</div>
                  <div className="seats-info">
                    💺 {show.availableSeats} seats available
                  </div>
                  <button className="select-show-btn">Select →</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="details-section">
          <h2>👤 Enter Your Details</h2>
          <div className="details-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
              />
            </div>
            <div className="selected-show-info">
              <h3>Selected Show:</h3>
              <p>
                🎭 {selectedShow.theater.name}, {selectedShow.theater.city}
              </p>
              <p>🕐 {selectedShow.timing}</p>
            </div>
            <button className="next-btn" onClick={handleDetailsSubmit}>
              Next: Select Seats →
            </button>
            <button className="back-step-btn" onClick={() => setStep(1)}>
              ← Back
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="seats-section">
          <h2>💺 Select Your Seats</h2>
          <div className="screen">SCREEN THIS WAY</div>
          <div className="seats-grid">
            {seats.map((seat) => (
              <div
                key={seat.id}
                className={`seat ${seat.booked ? "booked" : ""} ${selectedSeats.find((s) => s.id === seat.id) ? "selected" : ""}`}
                onClick={() => toggleSeat(seat)}
              >
                {seat.seatNumber}
              </div>
            ))}
          </div>
          <div className="legend">
            <span>
              <div className="legend-box available"></div> Available
            </span>
            <span>
              <div className="legend-box selected"></div> Selected
            </span>
            <span>
              <div className="legend-box booked"></div> Booked
            </span>
          </div>
          {selectedSeats.length > 0 && (
            <div className="seat-summary">
              <p>
                Selected Seats:{" "}
                {selectedSeats.map((s) => s.seatNumber).join(", ")}
              </p>
              <p>Total: ₹{selectedSeats.length * 200}</p>
              <button className="next-btn" onClick={proceedToPayment}>
                Proceed to Payment →
              </button>
            </div>
          )}
          <button className="back-step-btn" onClick={() => setStep(2)}>
            ← Back
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="payment-section">
          {!showUpiScanner ? (
            <>
              <h2>💳 Complete Payment</h2>
              <div className="payment-summary">
                <h3>Booking Summary</h3>
                <div className="summary-item">
                  <span>Movie:</span>
                  <span>{movie.title}</span>
                </div>
                <div className="summary-item">
                  <span>Theater:</span>
                  <span>
                    {selectedShow.theater.name}, {selectedShow.theater.city}
                  </span>
                </div>
                <div className="summary-item">
                  <span>Show Time:</span>
                  <span>{selectedShow.timing}</span>
                </div>
                <div className="summary-item">
                  <span>Seats:</span>
                  <span>
                    {selectedSeats.map((s) => s.seatNumber).join(", ")}
                  </span>
                </div>
                <div className="summary-item total">
                  <span>Total Amount:</span>
                  <span>₹{selectedSeats.length * 200}</span>
                </div>
              </div>

              <div className="payment-methods">
                <h3>Select Payment Method</h3>
                <button
                  className="payment-btn upi"
                  onClick={() => handlePayment("UPI")}
                >
                  📱 Pay with UPI
                </button>
                <button
                  className="payment-btn card"
                  onClick={() => handlePayment("Card")}
                >
                  💳 Credit/Debit Card
                </button>
                <button
                  className="payment-btn wallet"
                  onClick={() => handlePayment("Wallet")}
                >
                  👛 Wallet
                </button>
                <button
                  className="payment-btn netbanking"
                  onClick={() => handlePayment("Net Banking")}
                >
                  🏦 Net Banking
                </button>
              </div>
              <button className="back-step-btn" onClick={() => setStep(3)}>
                ← Back
              </button>
            </>
          ) : (
            <div className="upi-scanner-container">
              <h2>📱 Scan QR Code to Pay</h2>
              <div className="qr-code-box">
                <div className="qr-code-placeholder">
                  <div className="qr-corner top-left"></div>
                  <div className="qr-corner top-right"></div>
                  <div className="qr-corner bottom-left"></div>
                  <div className="qr-corner bottom-right"></div>
                  <div className="qr-pattern">
                    <div className="qr-dot"></div>
                    <div className="qr-dot"></div>
                    <div className="qr-dot"></div>
                    <div className="qr-dot"></div>
                    <div className="qr-dot"></div>
                    <div className="qr-dot"></div>
                    <div className="qr-dot"></div>
                    <div className="qr-dot"></div>
                    <div className="qr-dot"></div>
                  </div>
                </div>
                <p className="upi-instruction">
                  Scan this QR code with any UPI app
                </p>
                <p className="amount-display">₹{selectedSeats.length * 200}</p>
              </div>
              <div className="upi-apps">
                <p>Pay using:</p>
                <div className="app-icons">
                  <span>Google Pay</span>
                  <span>PhonePe</span>
                  <span>Paytm</span>
                  <span>BHIM</span>
                </div>
              </div>
              <button className="done-btn" onClick={completeBooking}>
                ✓ Done - Complete Booking
              </button>
              <button
                className="back-step-btn"
                onClick={() => setShowUpiScanner(false)}
              >
                ← Back to Payment Options
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Booking;
