package com.cyberseccourse.billingservice.repository;

import com.cyberseccourse.billingservice.entity.InvalidToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface InvalidTokenRepsitory extends JpaRepository<InvalidToken, String> {


}
