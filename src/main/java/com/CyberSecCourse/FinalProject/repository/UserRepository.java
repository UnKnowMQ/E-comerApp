package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {

    @Query("Select c from Customer  c where c.customerAccount.username = :username")
    User findByUsername(String username);
}
