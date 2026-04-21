package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.request.WalletRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.WalletInformationResponse;
import com.CyberSecCourse.FinalProject.entity.Wallet;
import com.CyberSecCourse.FinalProject.entity.WalletTransaction;
import com.CyberSecCourse.FinalProject.repository.WalletRepository;
import com.CyberSecCourse.FinalProject.repository.WalletTransactionRepository;
import com.CyberSecCourse.FinalProject.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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

        if (wallet == null) {
            throw new RuntimeException("Wallet not found for userId: " + UserId);
        }
        if(transactionResult.equals("PAID"))
        {
            transaction.setStatus("SUCCESS");
            walletTransactionRepository.save(transaction);
            wallet.setBalance(wallet.getBalance().add(transaction.getAmount()));
            return transaction;
        }

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

    // Get all
    public List<Wallet> getAllWallets(){
        return walletRepository.findAll();
    }

    // Get by id
    public Wallet getWalletById(Integer id){
        return walletRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
    }
    // Get by id
    public Wallet getWalletByUserId(Long id){
        return walletRepository.findByUserId(id);
    }

    // Update
    public Wallet updateWallet(Integer id, Wallet wallet){
        Wallet existingWallet = getWalletById(id);

        existingWallet.setUserId(wallet.getUserId());
        existingWallet.setBalance(wallet.getBalance());
        existingWallet.setStatus(wallet.getStatus());

        return walletRepository.save(existingWallet);
    }

    // Delete
    public void deleteWallet(Integer id){
        walletRepository.deleteById(id);
    }
    @Override
    public WalletInformationResponse getWalletInformationByUserId(Integer userId) {
        return walletRepository.findWalletInformationByUserId(userId);
    }

}
