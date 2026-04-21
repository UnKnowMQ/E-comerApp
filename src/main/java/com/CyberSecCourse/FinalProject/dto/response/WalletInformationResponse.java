package com.CyberSecCourse.FinalProject.dto.response;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class WalletInformationResponse {

    private Integer walletId;

    private Integer userId;

    private BigDecimal balance;

    private String status;

    private String fullName;

    private String email;

    private String phone;

    private BigDecimal totalSpend;

    private BigDecimal totalDeposit;

}
