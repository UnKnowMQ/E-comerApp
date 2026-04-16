package com.CyberSecCourse.FinalProject.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallet_transaction")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Integer transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @Column(name = "amount")
    private BigDecimal amount;

    // Note: schema uses INT for type, consider using an Enum or String in practice
    @Column(name = "type")
    private String type;

    @Column(name = "status", length = 255)
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "order_code")
    private Long orderCode;
}
