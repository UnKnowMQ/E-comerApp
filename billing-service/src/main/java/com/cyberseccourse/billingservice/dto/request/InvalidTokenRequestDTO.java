package com.cyberseccourse.billingservice.dto.request;

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
