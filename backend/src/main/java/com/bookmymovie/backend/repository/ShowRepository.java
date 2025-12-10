package com.bookmymovie.backend.repository;

import com.bookmymovie.backend.model.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShowRepository extends JpaRepository<Show, Integer> {

    List<Show> findByMovieId(Integer movieId);

    List<Show> findByTheaterId(Integer theaterId);
}
