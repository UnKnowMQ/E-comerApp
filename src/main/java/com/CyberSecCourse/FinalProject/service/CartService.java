package com.CyberSecCourse.FinalProject.service;

import com.CyberSecCourse.FinalProject.dto.response.CartItemResponse;
import com.CyberSecCourse.FinalProject.entity.Cart;

import java.util.List;

public interface CartService {

    public boolean createCart(Integer productId, String username);


    CartItemResponse getCartByCustomer(String username);

    Boolean deleteCartByCustomer(String username);
    List<String> getCustomerUsernameHaveCart();

    List<CartItemResponse> getCartItemsByCustomer(String username);

    Boolean RemoveAProductFromCart(String username, Integer productId);


}
