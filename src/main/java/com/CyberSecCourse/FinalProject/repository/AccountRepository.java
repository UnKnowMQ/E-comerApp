package com.CyberSecCourse.FinalProject.repository;


import com.CyberSecCourse.FinalProject.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {

    @Query("Select  a FROM Account a WHERE a.userId = (Select u.userId from User u WHERE u.username = :username)")
    Optional<Account> findByUsername(String username);


    @Query("Select a FROM Account a WHERE a.email = :email")
    Optional<Account> findByEmail(String email);

}
