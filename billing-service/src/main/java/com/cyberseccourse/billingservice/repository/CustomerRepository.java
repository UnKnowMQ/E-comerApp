package com.cyberseccourse.billingservice.repository;

import com.cyberseccourse.billingservice.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Integer> {

    @Query("Select c from Customer  c where c.customerAccount.username = :username")
    Customer findByUsername(String username);
}
