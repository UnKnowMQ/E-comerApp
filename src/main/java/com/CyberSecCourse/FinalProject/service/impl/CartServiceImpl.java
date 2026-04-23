package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.response.CartItemResponse;
import com.CyberSecCourse.FinalProject.dto.response.ProductResponse;
import com.CyberSecCourse.FinalProject.entity.*;
import com.CyberSecCourse.FinalProject.mapped.ProductMapper;
import com.CyberSecCourse.FinalProject.repository.CartItemRepository;
import com.CyberSecCourse.FinalProject.repository.CartRepository;
import com.CyberSecCourse.FinalProject.repository.ProductRepository;
import com.CyberSecCourse.FinalProject.repository.UserRepository;
import com.CyberSecCourse.FinalProject.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private  final UserRepository customerRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public boolean createCart(Integer productId, String username) {
        User customer = customerRepository.findByUsername(username);

        Product product = productRepository.findById(productId).orElseThrow();

        Cart curCart = cartRepository.findByCustomerId(username);
        if(curCart == null) {
            Cart newCart = Cart.builder()
                    .createdAt(Instant.now())
                    .updateAt(Instant.now())
                    .user(customer)
                    .build();

            cartRepository.save(newCart);

            CartItemId cartItemId = CartItemId.builder()
                    .cart_id(newCart.getCartId())
                    .product_id(productId)
                    .build();

            CartItem cartItem = CartItem.builder()
                    .id(cartItemId)
                    .cart(newCart)
                    .product(product)
                    .price(product.getPrice())
                    .quantity(1)
                    .build();

            newCart.setListItem(Set.of(cartItem));

            cartItemRepository.save(cartItem);
        }
        else{
            CartItemId cartItemId = CartItemId.builder()
                    .cart_id(curCart.getCartId())
                    .product_id(productId)
                    .build();

            CartItem cartItem = CartItem.builder()
                    .id(cartItemId)
                    .cart(curCart)
                    .product(product)
                    .price(product.getPrice())
                    .quantity(1)
                    .build();

            cartItemRepository.save(cartItem);
            curCart.setUpdateAt(Instant.now());

        }
        return true;
    }
    private  final ProductMapper productMapper;

    @Override
    public CartItemResponse getCartByCustomer(String username) {

        Cart cart = cartRepository.findByCustomerId(username);

//        if(cart == null) {
//            return null;
//        }else{
//            for(CartItem cartItem : cart.getListItem()) {}
//            CartItemResponse cartItemResponse = CartItemResponse.builder()
//                    .productResponse(productMapper.toResponse(cart.get))
//                    .
//                    .build();
//        }

        return null;

    }

    @Override
    public Boolean deleteCartByCustomer(String username) {
        Cart cart = cartRepository.findByCustomerId(username);
        List<CartItem> listCartItems = cartItemRepository.findCartItemByCartId(cart.getCartId());
        if(cart.getCartStatus().equals("PROCESS_TO_CHECKOUT"))
        {
            cartItemRepository.deleteAll(listCartItems);
            cartRepository.delete(cart);
            return true;
        }

        else if(Instant.now().toEpochMilli() - cart.getCreatedAt().toEpochMilli() > 7 * 24 * 60 * 60 * 1000)
        {
            cartItemRepository.deleteAll(listCartItems);
            cartRepository.delete(cart);
            return  true;
        }

        return false;
    }

    @Override
    public List<String> getCustomerUsernameHaveCart() {
        return cartRepository.GetAllUsernameCusHaveCart();
    }

    @Override
    public List<CartItemResponse> getCartItemsByCustomer(String username) {

        Cart cart = cartRepository.findByCustomerId(username);
        List<CartItemResponse> listCartItemResponse = new ArrayList<>();
        if(cart != null)
        {
             cart.getListItem().forEach(cartItem ->{
                 ProductResponse productResponse = productMapper.toResponse(cartItem.getProduct());
                 List<String> listImageUrl = productRepository.getImageByProductId(productResponse.getId());
//                 productResponse.setImageUrl(listImageUrl.size() != 0 ? listImageUrl.get(0) : null);
                 listCartItemResponse.add(CartItemResponse.builder()
                                 .productResponse(productResponse)
                                 .price(cartItem.getPrice())
                                 .quantity(cartItem.getQuantity())
                         .build()
                 );
             });
             return listCartItemResponse;
        }

        return null;
    }

    @Override
    public Boolean RemoveAProductFromCart(String username, Integer productId) {
        Cart cart = cartRepository.findByCustomerId(username);
        if(cart == null)
        {
            log.info("null object cart");
            return false;
        }
        CartItem cartItem = cartItemRepository.findCartItemById(productId,cart.getCartId());
        if(cartItem == null)
        {
            log.info("null object cartItem");
            return false;
        }
        cartItemRepository.delete(cartItem);

      return true;
    }


}
