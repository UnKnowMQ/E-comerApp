package com.CyberSecCourse.FinalProject.controller;

import com.CyberSecCourse.FinalProject.dto.response.CartItemResponse;
import com.CyberSecCourse.FinalProject.dto.response.IntrospectiveResponse;
import com.CyberSecCourse.FinalProject.dto.response.ResponseData;
import com.CyberSecCourse.FinalProject.dto.response.ResponseError;
import com.CyberSecCourse.FinalProject.entity.Cart;
import com.CyberSecCourse.FinalProject.service.impl.CartServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/cart")
public class CartController {

    private final CartServiceImpl cartService;


    @PostMapping("/create-cart")
    public ResponseData<?> createCart(@RequestParam String customerId,
        @RequestParam Integer productId)
    {
        try{
            boolean result = cartService.createCart(productId,customerId);
            if(result)
                return new ResponseData<>(HttpStatus.OK.value(),"create cart ok",result);
            else
                return new ResponseError(HttpStatus.BAD_REQUEST.value(), "create cart fail");
        }
        catch (Exception e)
        {
            log.error("there is an error of cart api: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }


    }

    @GetMapping("/get-cart-by-customer-id")
    public ResponseData<?>getCartByCustomerId(@RequestParam String customerId)
    {
        try{
            List<CartItemResponse> result = cartService.getCartItemsByCustomer(customerId);
            if(result != null)
                return new ResponseData<>(HttpStatus.OK.value(),"get cart ok",result);
            else
                return new ResponseError(HttpStatus.BAD_REQUEST.value(), "get cart fail");
        }
        catch (Exception e)
        {
            log.error("there is an error of cart api: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }


    }
    @DeleteMapping("/delete-cartItem-from-cart")
    public ResponseData<?>deleteCartItem(@RequestParam String customerId,
                                         @RequestParam Integer productId)
    {
        try{

                return new ResponseData<>(HttpStatus.NO_CONTENT.value(),"delete cartItem ok",cartService.RemoveAProductFromCart(customerId,productId));

        }
        catch (Exception e)
        {
            log.error("there is an error of cart api: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }


    }





}
