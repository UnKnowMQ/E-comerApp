package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.entity.Category;
import com.CyberSecCourse.FinalProject.entity.CitizenIdentification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CitizenIdentificationRepository extends JpaRepository<CitizenIdentification, Integer> {

    Optional<CitizenIdentification> findByUser_UserId(Integer userId);


}
