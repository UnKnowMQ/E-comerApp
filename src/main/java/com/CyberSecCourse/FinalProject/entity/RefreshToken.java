package com.CyberSecCourse.FinalProject.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_token")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "token", nullable = false, length = 255)
    private String token;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "expired_at")
    private LocalDateTime expiredAt;

    @Column(name = "revoked")
    private Boolean revoked;
}
