package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.dto.response.WalletInformationResponse;
import com.CyberSecCourse.FinalProject.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletRepository  extends JpaRepository<Wallet, Integer> {

    @Query("Select w from Wallet w WHERE w.userId = :UserId")
     Wallet findByUserId(Long UserId);

    @Query("""
    SELECT new com.CyberSecCourse.FinalProject.dto.response.WalletInformationResponse(
        w.walletId,
        w.userId,
        w.balance,
        w.status,
        u.firstname,
        u.email,
        u.phoneNumber,
        COALESCE(SUM(CASE WHEN wt.type = 'SPEND' THEN wt.amount ELSE NULL END), 0.0),
        COALESCE(SUM(CASE WHEN wt.type = 'DEPOSIT' THEN wt.amount ELSE NULL END),0.0)
    )
    FROM Wallet w
    LEFT JOIN WalletTransaction wt ON wt.wallet.walletId = w.walletId
    LEFT JOIN User u ON u.userId = w.userId
    WHERE w.userId = :userId
    GROUP BY w.walletId, w.userId, w.balance, w.status, u.firstname, u.email, u.phoneNumber
""")
    WalletInformationResponse findWalletInformationByUserId(@Param("userId") Integer userId);



}
