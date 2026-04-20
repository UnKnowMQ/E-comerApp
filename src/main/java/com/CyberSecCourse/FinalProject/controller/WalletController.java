package com.CyberSecCourse.FinalProject.controller;

import com.CyberSecCourse.FinalProject.entity.Wallet;
import com.CyberSecCourse.FinalProject.service.impl.WalletServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/wallet")
public class WalletController {

    private  final WalletServiceImpl walletService;

    // Get all
    @GetMapping
    public List<Wallet> getAllWallets(){
        return walletService.getAllWallets();
    }

    // Get by id
    @GetMapping("/{id}")
    public Wallet getWalletById(@PathVariable Integer id){
        return walletService.getWalletById(id);
    }
    @GetMapping("/user/{userId}")
    public Wallet getWalletByUserId(@PathVariable Long userId){
        return walletService.getWalletByUserId(userId);
    }

    // Update
    @PutMapping("/{id}")
    public Wallet updateWallet(@PathVariable Integer id,
                               @RequestBody Wallet wallet){
        return walletService.updateWallet(id, wallet);
    }

    // Delete
    @DeleteMapping("/{id}")
    public void deleteWallet(@PathVariable Integer id){
        walletService.deleteWallet(id);
    }


}
