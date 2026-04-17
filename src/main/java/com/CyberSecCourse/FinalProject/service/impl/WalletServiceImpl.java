package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.request.WalletRequestDTO;
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
    public WalletTransaction depositCreating(Long UserId, BigDecimal amount, Long orderCode) {
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
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .orderCode(orderCode)
                .build();
        walletTransactionRepository.save(walletTransaction);

        return walletTransaction;
    }

    @Override
    public WalletTransaction depositProcessing(Long UserId, BigDecimal amount, String transactionResult, WalletTransaction transaction) {

        Wallet wallet = walletRepository.findByUserId(UserId);

        if(transactionResult.equals("PAID"))
        {
            transaction.setStatus("SUCCESS");
            walletTransactionRepository.save(transaction);
            return transaction;
        }
        // rollback
        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);

        transaction.setStatus(transactionResult);
        walletTransactionRepository.save(transaction);
        return transaction;
    }

    @Override
    public Wallet createWallet(WalletRequestDTO walletRequestDTO) {
        if(walletRepository.findByUserId(walletRequestDTO.getUserId()) != null)
        {
            throw new RuntimeException("Wallet is presented");
        }
        else{
            Wallet wallet = Wallet.builder()
                    .userId(walletRequestDTO.getUserId().intValue()).balance(walletRequestDTO.getBalance()).status(walletRequestDTO.getStatus()).build()
                    ;
            walletRepository.save(wallet);
            return wallet;
        }
    }

}
