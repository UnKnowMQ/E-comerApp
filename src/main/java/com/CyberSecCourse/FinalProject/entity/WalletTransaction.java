package com.CyberSecCourse.FinalProject.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

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
    private Integer amount;

    // Note: schema uses INT for type, consider using an Enum or String in practice
    @Column(name = "type")
    private Integer type;

    @Column(name = "status", length = 255)
    private String status;

    @Column(name = "created_at")
    private LocalDate createdAt;
}
