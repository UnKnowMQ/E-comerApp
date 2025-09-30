package com.CyberSecCourse.FinalProject.repository;


import com.CyberSecCourse.FinalProject.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
}
