package com.bookmymovie.backend.controller;

import com.bookmymovie.backend.model.Show;
import com.bookmymovie.backend.model.Seat;
import com.bookmymovie.backend.model.Movie;
import com.bookmymovie.backend.model.Theater;
import com.bookmymovie.backend.repository.ShowRepository;
import com.bookmymovie.backend.repository.SeatRepository;
import com.bookmymovie.backend.repository.MovieRepository;
import com.bookmymovie.backend.repository.TheaterRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/shows")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowController {

    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;

    public ShowController(ShowRepository showRepository, 
                         SeatRepository seatRepository,
                         MovieRepository movieRepository,
                         TheaterRepository theaterRepository) {
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
        this.movieRepository = movieRepository;
        this.theaterRepository = theaterRepository;
    }

    @GetMapping
    public List<Show> getShows(@RequestParam(required = false) Integer movieId,
                               @RequestParam(required = false) Integer theaterId) {
        if (movieId != null) {
            return showRepository.findByMovieId(movieId);
        } else if (theaterId != null) {
            return showRepository.findByTheaterId(theaterId);
        }
        return showRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Show> getShowById(@PathVariable Integer id) {
        return showRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createShow(@RequestParam Integer movieId,
                                        @RequestParam Integer theaterId,
                                        @RequestParam String timing,
                                        @RequestParam Integer availableSeats) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found: " + movieId));
        Theater theater = theaterRepository.findById(theaterId)
                .orElseThrow(() -> new RuntimeException("Theater not found: " + theaterId));

        Show show = Show.builder()
                .movie(movie)
                .theater(theater)
                .timing(timing)
                .availableSeats(availableSeats)
                .build();

        Show saved = showRepository.save(show);
        return ResponseEntity.created(URI.create("/api/shows/" + saved.getId())).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShow(@PathVariable Integer id) {
        if (!showRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        showRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{showId}/seats")
    public List<Seat> getSeatsByShow(@PathVariable Integer showId) {
        return seatRepository.findByShowId(showId);
    }
}

