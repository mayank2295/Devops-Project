package com.bookmymovie.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "movies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_id")
    private Integer id;

    @Column(name = "title", length = 30)
    private String title;

    @Column(name = "genre", length = 30)
    private String genre;

    @Column(name = "lang", length = 30)
    private String language;

    @Column(name = "duration")
    private Integer duration;
}

