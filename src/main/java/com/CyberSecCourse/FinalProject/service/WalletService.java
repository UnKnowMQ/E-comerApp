package com.CyberSecCourse.FinalProject.service;

import com.CyberSecCourse.FinalProject.dto.request.WalletRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.WalletInformationResponse;
import com.CyberSecCourse.FinalProject.entity.Wallet;
import com.CyberSecCourse.FinalProject.entity.WalletTransaction;

import java.math.BigDecimal;
import java.util.List;

public interface WalletService {

    WalletTransaction depositCreating(Long UserId, BigDecimal amount, Long orderCode);
    WalletTransaction depositProcessing(Long UserId, BigDecimal amount,String transactionResult, WalletTransaction transaction);

    Wallet createWallet(WalletRequestDTO walletRequestDTO);
    List<Wallet> getAllWallets();
    Wallet getWalletById(Integer id);
    Wallet updateWallet(Integer id, Wallet wallet);
    void deleteWallet(Integer id);
    WalletInformationResponse getWalletInformationByUserId(Integer userId);


}
