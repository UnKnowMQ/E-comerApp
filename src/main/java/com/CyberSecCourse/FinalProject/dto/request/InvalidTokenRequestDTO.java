package com.CyberSecCourse.FinalProject.dto.request;

import com.CyberSecCourse.FinalProject.entity.Account;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;


@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InvalidTokenRequestDTO  implements Serializable {
    private String token_id;

    private Instant expired_at;
}
