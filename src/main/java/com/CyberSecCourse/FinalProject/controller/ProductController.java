package com.CyberSecCourse.FinalProject.controller;


import com.CyberSecCourse.FinalProject.dto.request.AuthRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.*;
import com.CyberSecCourse.FinalProject.service.ProductService;
import com.CyberSecCourse.FinalProject.service.impl.ProductServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;


@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/product")
public class ProductController {

    private final ProductServiceImpl productService;

    @GetMapping("/get-product")
    public ResponseData<?> getProducts(@RequestParam(defaultValue = "0") int pageNo,
                                               @Min(10)@RequestParam(defaultValue = "10") int pageSize) {
        try{
                
                return new ResponseData<>(HttpStatus.OK.value(),"User authenticated",productService.getAllProducts(pageNo,pageSize));
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

    @GetMapping("/get-products-multiple-searching-col")
    public ResponseData<?> getProductMultipleSearchCol( @RequestParam(defaultValue = "0") int pageNo,
                                                        @Min(10)@RequestParam(defaultValue = "10") int pageSize,
                                                        @RequestParam(required = false) String sortBy,
                                                        @RequestParam(required = false) String brandName,
                                                        @RequestParam(required = false) String categoryName,
                                                        @RequestParam(required = false) String... search) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"User found!",productService.getProductsWithMultipleSearchingColumns(pageNo,pageSize,sortBy,brandName,categoryName,search));
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

    @GetMapping("/get-product-by-id")
    public ResponseData<?> getProductMultipleSearchCol( @RequestParam int productId
                                                     ) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"Product found!",productService.getProductById(productId));
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

    @GetMapping("/get-image-by-id")
    public ResponseData<?> getImages( @RequestParam int productId) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"Image found!",productService.getUrlImageByProductId(productId));
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @GetMapping("/get-top-product")
    public ResponseData<?> getTopProduct( ) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"Product found!",productService.getTopProduct());
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
}
