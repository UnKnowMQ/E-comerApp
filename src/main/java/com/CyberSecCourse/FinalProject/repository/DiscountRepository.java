package com.CyberSecCourse.FinalProject.repository;


import com.CyberSecCourse.FinalProject.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountRepository  extends JpaRepository<Discount, Integer> {


}
