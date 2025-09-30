package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.entity.InvalidToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface InvalidTokenRepsitory extends JpaRepository<InvalidToken, String> {


}
