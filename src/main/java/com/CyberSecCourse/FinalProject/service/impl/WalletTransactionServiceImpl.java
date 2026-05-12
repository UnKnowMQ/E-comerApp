package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.response.WalletTransactionResponse;
import com.CyberSecCourse.FinalProject.entity.WalletTransaction;
import com.CyberSecCourse.FinalProject.repository.WalletRepository;
import com.CyberSecCourse.FinalProject.repository.WalletTransactionRepository;
import com.CyberSecCourse.FinalProject.service.WalletTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class WalletTransactionServiceImpl  implements WalletTransactionService {

    private final WalletTransactionRepository walletTransactionRepository;

    public List<WalletTransactionResponse> listTransaction(Integer walletId){
        List<WalletTransactionResponse> walletTransactionList = walletTransactionRepository.findAllByInvoiceId(walletId);
        if(walletTransactionList.isEmpty()){
            throw new RuntimeException("List is empty");
        }

        return walletTransactionList;
    }

}
