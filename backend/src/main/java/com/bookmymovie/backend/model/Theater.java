package com.bookmymovie.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "theaters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Theater {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "theater_id")
    private Integer id;

    @Column(name = "name", length = 30)
    private String name;

    @Column(name = "city", length = 30)
    private String city;
}
