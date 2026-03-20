package com.cyberseccourse.billingservice.service;

import com.cyberseccourse.billingservice.dto.response.CartItemResponse;

import java.util.List;

public interface CartService {

    public boolean createCart(Integer productId, String username);


    CartItemResponse getCartByCustomer(String username);

    Boolean deleteCartByCustomer(String username);
    List<String> getCustomerUsernameHaveCart();

    List<CartItemResponse> getCartItemsByCustomer(String username);

    Boolean RemoveAProductFromCart(String username, Integer productId);


}
