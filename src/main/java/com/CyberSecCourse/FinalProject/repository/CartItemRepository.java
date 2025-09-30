package com.CyberSecCourse.FinalProject.repository;


import com.CyberSecCourse.FinalProject.entity.Cart;
import com.CyberSecCourse.FinalProject.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository  extends JpaRepository<CartItem, Integer> {

    @Query("Select cI from CartItem cI where cI.cart.cartId = :cartId")
    List<CartItem> findCartItemByCartId(Integer cartId);

    @Query("SELECT cI FROM CartItem cI WHERE cI.cart.cartId = :cartId AND cI.product.id = :productId")
    CartItem findCartItemById(@Param("productId") int productId, @Param("cartId") int cartId);


    @Query("Select cI from CartItem cI inner join Cart c on c.cartId = cI.cart.cartId  where c.customer.customerId = :customerId")
    List<CartItem> findCartItemByCustomerId(Integer customerId);
}
