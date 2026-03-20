package com.cyberseccourse.billingservice.controller;


import com.cyberseccourse.billingservice.dto.response.ResponseData;
import com.cyberseccourse.billingservice.dto.response.ResponseError;
import com.cyberseccourse.billingservice.service.impl.CategoryServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/category")
public class CategoryController {

    private  final CategoryServiceImpl categoryService;


    @GetMapping("/get-category")
    public ResponseData<?> getBrands() {
        try{

            return new ResponseData<>(HttpStatus.OK.value(),"Brand get",categoryService.getCategory());
        }
        catch (Exception e)
        {
            log.error("there is an error in category api : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

}
