package com.CyberSecCourse.FinalProject.entity;


import com.CyberSecCourse.FinalProject.utils.Gender;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "firstname", nullable = false, length = 40)
    private String firstname;

    @Column(name = "lastname", nullable = false, length = 50)
    private String lastname;

    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "gender", nullable = false)
    private Boolean gender;

    @Column(name = "phone_number", nullable = false, length = 11)
    private String phoneNumber;

    @Column(name = "email", nullable = false, length = 60)
    private String email;

    @Column(name = "address", nullable = false, length = 255)
    private String address;

    @Column(name = "status", nullable = false, length = 10)
    private String status;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "username", nullable = false, length = 255)
    private String username;

    @Column(name = "avatar", length = 255)
    private String avatar;

    @Column(name = "role", length = 10)
    private String role;



}
