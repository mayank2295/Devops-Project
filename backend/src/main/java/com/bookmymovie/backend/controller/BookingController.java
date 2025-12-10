package com.bookmymovie.backend.controller;

import com.bookmymovie.backend.model.Booking;
import com.bookmymovie.backend.model.User;
import com.bookmymovie.backend.model.Show;
import com.bookmymovie.backend.model.Seat;
import com.bookmymovie.backend.repository.BookingRepository;
import com.bookmymovie.backend.repository.UserRepository;
import com.bookmymovie.backend.repository.ShowRepository;
import com.bookmymovie.backend.repository.SeatRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;

    public BookingController(BookingRepository bookingRepository,
                           UserRepository userRepository,
                           ShowRepository showRepository,
                           SeatRepository seatRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Integer id) {
        return bookingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest bookingRequest) {
        try {
            // Get or create user
            User user = userRepository.findByEmail(bookingRequest.getUser().getEmail())
                    .orElseGet(() -> {
                        User newUser = User.builder()
                                .name(bookingRequest.getUser().getName())
                                .email(bookingRequest.getUser().getEmail())
                                .phone(bookingRequest.getUser().getPhone())
                                .build();
                        return userRepository.save(newUser);
                    });

            Show show = showRepository.findById(bookingRequest.getShow().getId())
                    .orElseThrow(() -> new RuntimeException("Show not found: " + bookingRequest.getShow().getId()));

            // Mark seats as booked and collect seat IDs
            List<Integer> seatIds = bookingRequest.getSeatIds();
            StringBuilder seatNumbers = new StringBuilder();
            
            for (Integer seatId : seatIds) {
                Seat seat = seatRepository.findById(seatId)
                        .orElseThrow(() -> new RuntimeException("Seat not found: " + seatId));
                
                if (Boolean.TRUE.equals(seat.getBooked())) {
                    throw new RuntimeException("Seat " + seat.getSeatNumber() + " is already booked");
                }
                
                seat.setBooked(true);
                seatRepository.save(seat);
                
                if (seatNumbers.length() > 0) {
                    seatNumbers.append(", ");
                }
                seatNumbers.append(seat.getSeatNumber());
            }

            // Update show's available seats
            show.setAvailableSeats(show.getAvailableSeats() - seatIds.size());
            showRepository.save(show);

            // Create booking
            Booking booking = Booking.builder()
                    .user(user)
                    .show(show)
                    .seatsBooked(seatNumbers.toString())
                    .totalPrice(BigDecimal.valueOf(bookingRequest.getTotalPrice()))
                    .build();

            Booking saved = bookingRepository.save(booking);
            return ResponseEntity.created(URI.create("/api/bookings/" + saved.getId())).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Inner class for request body
    @lombok.Data
    public static class BookingRequest {
        private UserInfo user;
        private ShowInfo show;
        private List<Integer> seatIds;
        private int seatsBooked;
        private double totalPrice;

        @lombok.Data
        public static class UserInfo {
            private String name;
            private String email;
            private String phone;
        }

        @lombok.Data
        public static class ShowInfo {
            private Integer id;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Integer id) {
        if (!bookingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bookingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

