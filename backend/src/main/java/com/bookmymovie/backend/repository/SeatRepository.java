package com.bookmymovie.backend.repository;

import com.bookmymovie.backend.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Integer> {
    
    List<Seat> findByShowId(Integer showId);
}
