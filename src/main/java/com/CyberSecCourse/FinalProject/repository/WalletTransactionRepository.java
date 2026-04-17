package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.entity.Wallet;
import com.CyberSecCourse.FinalProject.entity.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletTransactionRepository  extends JpaRepository<WalletTransaction, Integer> {

    @Query("Select u.userId from User u, WalletTransaction wt WHERE u.userId =  wt.wallet.userId AND wt.orderCode = :orderCode")
    Long  getUserIdByOrderCode(Long orderCode);

    WalletTransaction findByOrderCode(Long userId);

}
