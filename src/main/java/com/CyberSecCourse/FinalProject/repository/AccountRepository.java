package com.CyberSecCourse.FinalProject.repository;


import com.CyberSecCourse.FinalProject.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {


    Optional<Account> findByUsername(String username);

}
