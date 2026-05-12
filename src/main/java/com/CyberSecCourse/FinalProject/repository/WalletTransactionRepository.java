package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.dto.response.WalletTransactionResponse;
import com.CyberSecCourse.FinalProject.entity.Wallet;
import com.CyberSecCourse.FinalProject.entity.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletTransactionRepository  extends JpaRepository<WalletTransaction, Integer> {

    @Query("Select u.userId from User u, WalletTransaction wt WHERE u.userId =  wt.wallet.userId AND wt.orderCode = :orderCode")
    Long  getUserIdByOrderCode(Long orderCode);

    WalletTransaction findByOrderCode(Long userId);

    @Query("Select new com.CyberSecCourse.FinalProject.dto.response.WalletTransactionResponse(wt.transactionId, wt.amount,wt.type,wt.status,wt.createdAt) from WalletTransaction  wt  where wt.wallet.walletId = :walletId order by wt.createdAt desc")
    List<WalletTransactionResponse> findAllByInvoiceId(Integer walletId);

}
