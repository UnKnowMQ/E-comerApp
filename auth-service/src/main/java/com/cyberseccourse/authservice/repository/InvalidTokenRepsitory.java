package com.cyberseccourse.authservice.repository;

import com.cyberseccourse.authservice.entity.InvalidToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface InvalidTokenRepsitory extends JpaRepository<InvalidToken, String> {


}
