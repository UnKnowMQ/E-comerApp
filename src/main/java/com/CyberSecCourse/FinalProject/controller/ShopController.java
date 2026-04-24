package com.CyberSecCourse.FinalProject.controller;


import com.CyberSecCourse.FinalProject.dto.request.AuthRequestDTO;
import com.CyberSecCourse.FinalProject.dto.request.ShopCreateRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.*;
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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;


@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/shop")
public class ShopController {

    private final ShopServiceImpl shopService;

    @PostMapping("/")
    public ResponseData<?> getProducts(@RequestBody ShopCreateRequestDTO shopCreateRequestDTO
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

}
