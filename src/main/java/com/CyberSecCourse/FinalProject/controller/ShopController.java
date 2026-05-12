package com.CyberSecCourse.FinalProject.controller;


import com.CyberSecCourse.FinalProject.dto.request.AuthRequestDTO;
import com.CyberSecCourse.FinalProject.dto.request.ProductShopRequestDTO;
import com.CyberSecCourse.FinalProject.dto.request.ShopCreateRequestDTO;
import com.CyberSecCourse.FinalProject.dto.request.UpdateProductRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.*;
import com.CyberSecCourse.FinalProject.repository.ShopRepository;
import com.CyberSecCourse.FinalProject.service.ProductService;
import com.CyberSecCourse.FinalProject.service.impl.ProductServiceImpl;
import com.CyberSecCourse.FinalProject.service.impl.ShopServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.Map;


@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/shop")
public class ShopController {

    private final ShopServiceImpl shopService;

    private final ShopRepository shopRepository;

    private final ProductServiceImpl   productService;

    @PostMapping("/")
    public ResponseData<?> createShop(@RequestBody ShopCreateRequestDTO shopCreateRequestDTO
                                      ) {
        try{

            return new ResponseData<>(HttpStatus.OK.value(),"Shop created",shopService.CreateShop(shopCreateRequestDTO));
        }
        catch (Exception e)
        {
            log.error("there is an error in shop service: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @GetMapping("/list")
    public ResponseData<?> getListShop(){
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"Shop list get",shopService.getAllShops());
        }
        catch (Exception e)
        {
            log.error("there is an error in shop service: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @GetMapping("/list/not-verified")
    public ResponseData<?> getListPendingShop(){
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"Shop pending list get",shopRepository.findShopVerifiedRequest());
        }
        catch (Exception e)
        {
            log.error("there is an error in shop service: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    // APPROVE
    @PutMapping("/approve/{shopId}")
    public ResponseEntity<?> approveShop(@PathVariable Integer shopId) {
        shopService.approveShop(shopId);
        return ResponseEntity.ok("Shop approved successfully");
    }

    // REJECT
    @PutMapping("/reject/{shopId}")
    public ResponseEntity<?> rejectShop(@PathVariable Integer shopId) {
        shopService.rejectShop(shopId);
        return ResponseEntity.ok("Shop rejected successfully");
    }
    @PostMapping("/product")
    public ResponseData<?> addProduct(@RequestBody ProductShopRequestDTO productShopRequestDTO) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"Add a product to shop",shopService.AddProductToShop(productShopRequestDTO));
        }
        catch (Exception e)
        {
            log.error("there is an error in shop service: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @PostMapping("/user/{userId}")
    public ResponseData<?> getShopByUserId(@RequestParam Integer userId) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"Get Shop By User Id",shopRepository.findShopByUserId(userId));
        }
        catch (Exception e)
        {
            log.error("there is an error in shop service: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @GetMapping("/productId/{productId}")
    public ResponseData<?> getShopByProduct(@RequestParam Integer productId) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"Get Shop By Product Id",shopRepository.findShopByProduct(productId));
        }
        catch (Exception e)
        {
            log.error("there is an error in shop service: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @PutMapping("/product/{id}")
    public ProductResponse updateProduct(
            @PathVariable Integer id,
            @RequestBody UpdateProductRequestDTO dto
    ){
        return productService.updateProduct(id, dto);
    }
    @GetMapping("/check-shop")
    public Map<String, Boolean> checkUserHasShop(
            @RequestParam Integer userId
    ){
        boolean hasShop = shopRepository.findShopByUserId(userId) != null;

        return Map.of(
                "hasShop", hasShop
        );
    }
}
