package com.cyberseccourse.authservice.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokens {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "token",columnDefinition = "varchar(500)")
    private String token;

    @Column(name = "expired_at")
    private Instant expired_at;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "revoked")
    private Boolean revoked;

}
