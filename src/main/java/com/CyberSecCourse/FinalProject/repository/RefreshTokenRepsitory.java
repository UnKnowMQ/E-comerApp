package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface RefreshTokenRepsitory extends JpaRepository<RefreshToken, String> {

    @Query("Select rf FROM RefreshToken rf WHERE rf.token = :token")
    RefreshToken findByToken(String token);

}
