package com.CyberSecCourse.FinalProject.controller;

import com.CyberSecCourse.FinalProject.dto.response.ResponseData;
import com.CyberSecCourse.FinalProject.dto.response.ResponseError;
import com.CyberSecCourse.FinalProject.entity.Wallet;
import com.CyberSecCourse.FinalProject.entity.WalletTransaction;
import com.CyberSecCourse.FinalProject.service.WalletTransactionService;
import com.CyberSecCourse.FinalProject.service.impl.WalletServiceImpl;
import com.CyberSecCourse.FinalProject.service.impl.WalletTransactionServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/wallet-transaction")
public class WalletTransactionController {

    private final WalletTransactionServiceImpl walletTransactionService;

    @GetMapping
    public ResponseData<?> getAllWalletTransactionById(@RequestParam Integer walletId){
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"Wallet transaction get By wallet!",walletTransactionService.listTransaction(walletId));
        }
        catch (Exception e)
        {
            log.error("there is an error in wallet transaction api: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
}
