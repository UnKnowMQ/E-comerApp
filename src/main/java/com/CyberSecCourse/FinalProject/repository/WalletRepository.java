package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletRepository  extends JpaRepository<Wallet, Integer> {

    @Query("Select w from Wallet w WHERE w.userId = :UserId")
     Wallet findByUserId(Long UserId);


}
