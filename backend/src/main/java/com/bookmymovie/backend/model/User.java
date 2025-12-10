package com.bookmymovie.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer id;

    @Column(name = "name", length = 30)
    private String name;

    @Column(name = "email", length = 30)
    private String email;

    @Column(name = "phone", length = 30)
    private String phone;
}
