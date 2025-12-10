package com.bookmymovie.backend.controller;

import com.bookmymovie.backend.model.Theater;
import com.bookmymovie.backend.repository.TheaterRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/theaters")
@CrossOrigin(origins = "http://localhost:3000")
public class TheaterController {

    private final TheaterRepository theaterRepository;

    public TheaterController(TheaterRepository theaterRepository) {
        this.theaterRepository = theaterRepository;
    }

    @GetMapping
    public List<Theater> getAllTheaters() {
        return theaterRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Theater> getTheaterById(@PathVariable Integer id) {
        return theaterRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Theater> createTheater(@RequestBody Theater theater) {
        theater.setId(null);
        Theater saved = theaterRepository.save(theater);
        return ResponseEntity.created(URI.create("/api/theaters/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Theater> updateTheater(@PathVariable Integer id, @RequestBody Theater theater) {
        return theaterRepository.findById(id)
                .map(existing -> {
                    existing.setName(theater.getName());
                    existing.setCity(theater.getCity());
                    Theater saved = theaterRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTheater(@PathVariable Integer id) {
        if (!theaterRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        theaterRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
