package com.cyberseccourse.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "user")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {


    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(name = "firstname")
    private String firstName;

    @Column(name = "lastname")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phone;

    @Column(name = "address" ,nullable = true)
    private String address;

    @Column(name = "status")
    private String status;

    @Column(name = "gender")
    private Boolean gender;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "note")
    private String note;

    @Column(name = "date_of_birth")
    private LocalDate date_of_birth;
}
