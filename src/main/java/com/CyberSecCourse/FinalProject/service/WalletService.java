package com.CyberSecCourse.FinalProject.service;

import com.CyberSecCourse.FinalProject.dto.request.WalletRequestDTO;
import com.CyberSecCourse.FinalProject.entity.Wallet;
import com.CyberSecCourse.FinalProject.entity.WalletTransaction;

import java.math.BigDecimal;

public interface WalletService {

    WalletTransaction depositCreating(Long UserId, BigDecimal amount, Long orderCode);
    WalletTransaction depositProcessing(Long UserId, BigDecimal amount,String transactionResult, WalletTransaction transaction);

    Wallet createWallet(WalletRequestDTO walletRequestDTO);
}
