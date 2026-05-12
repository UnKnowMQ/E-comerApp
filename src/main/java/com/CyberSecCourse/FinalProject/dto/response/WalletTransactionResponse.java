package com.CyberSecCourse.FinalProject.dto.response;

import com.CyberSecCourse.FinalProject.entity.Wallet;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Builder
@Getter
@Setter
@AllArgsConstructor
public class WalletTransactionResponse {

    private Integer transactionId;

    private BigDecimal amount;

    private String type;

    private String status;

    private LocalDateTime createdAt;

}
