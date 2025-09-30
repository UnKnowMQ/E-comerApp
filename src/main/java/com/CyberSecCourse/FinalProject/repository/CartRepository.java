package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.entity.Cart;
import com.CyberSecCourse.FinalProject.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository  extends JpaRepository<Cart, Integer> {

    @Query("Select c from  Cart  c where c.customer.customerAccount.username = :username")
    Cart findByCustomerId(String username);

    @Query("SELECT c.customer.customerAccount.username from Cart c")
    List<String> GetAllUsernameCusHaveCart ();


}
