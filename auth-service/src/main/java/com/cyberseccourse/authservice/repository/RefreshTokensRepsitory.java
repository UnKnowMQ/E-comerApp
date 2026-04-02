package com.cyberseccourse.authservice.repository;

import com.cyberseccourse.authservice.entity.RefreshTokens;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RefreshTokensRepsitory extends JpaRepository<RefreshTokens, String> {


}
