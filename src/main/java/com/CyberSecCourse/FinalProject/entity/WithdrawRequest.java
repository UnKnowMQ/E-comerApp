package com.CyberSecCourse.FinalProject.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
@Entity
@Table(name = "widthdraw_request")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Integer requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @Column(name = "amount", precision = 15, scale = 3)
    private BigDecimal amount;

    @Column(name = "bank_account", length = 255)
    private String bankAccount;

    @Column(name = "status", length = 255)
    private String status;
}
