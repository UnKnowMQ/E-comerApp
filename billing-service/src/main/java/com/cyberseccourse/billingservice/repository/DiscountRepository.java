package com.cyberseccourse.billingservice.repository;


import com.cyberseccourse.billingservice.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountRepository  extends JpaRepository<Discount, Integer> {


}
