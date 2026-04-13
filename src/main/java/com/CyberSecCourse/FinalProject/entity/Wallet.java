package com.CyberSecCourse.FinalProject.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wallets")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wallet_id")
    private Integer walletId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "balance")
    private Integer balance;

    @Column(name = "status", length = 255)
    private String status;
}
