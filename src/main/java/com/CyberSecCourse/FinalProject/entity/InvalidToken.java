package com.CyberSecCourse.FinalProject.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "invalid_token")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvalidToken {

    @Id
    @Column(name = "token_id",columnDefinition = "varchar(500)")
    private String token_id;

    @Column(name = "expired_at")
    private Instant expired_at;

}
