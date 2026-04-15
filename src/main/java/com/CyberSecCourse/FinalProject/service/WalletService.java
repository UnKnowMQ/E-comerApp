package com.CyberSecCourse.FinalProject.service;

import com.CyberSecCourse.FinalProject.entity.Wallet;

import java.math.BigDecimal;

public interface WalletService {

    Wallet depositCreating(Long UserId, BigDecimal amount);
}
