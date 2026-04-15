package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.entity.Wallet;
import com.CyberSecCourse.FinalProject.entity.WalletTransaction;
import com.CyberSecCourse.FinalProject.repository.WalletRepository;
import com.CyberSecCourse.FinalProject.repository.WalletTransactionRepository;
import com.CyberSecCourse.FinalProject.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.payos.model.v2.paymentRequests.Transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;

    private final WalletTransactionRepository walletTransactionRepository;


    @Override
    public Wallet depositCreating(Long UserId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <=0 )
        {
            throw new IllegalArgumentException("Amount must greater than 0");
        }
        Wallet wallet = walletRepository.findByUserId(UserId);

        // cập nhật số dư
        wallet.setBalance(wallet.getBalance().add(amount));

        walletRepository.save(wallet);

        // lưu transaction
        WalletTransaction walletTransaction =  WalletTransaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type("DEPOSIT")
                .status("SUCCESS")
                .createdAt(LocalDateTime.now())
                .build();
        walletTransactionRepository.save(walletTransaction);



        return null;
    }
}
