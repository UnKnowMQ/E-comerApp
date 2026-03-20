package com.cyberseccourse.billingservice.controller;


import com.cyberseccourse.billingservice.service.impl.DiscountServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/discount")
public class DiscountController {

    private final DiscountServiceImpl discountService;
//
//    @GetMapping("/get-discount")
//    public ResponseData<?> login(@RequestParam(defaultValue = "0") int pageNo,
//                                               @Min(10)@RequestParam(defaultValue = "10") int pageSize) {
//        try{
//                return new ResponseData<>(HttpStatus.OK.value(),"User authenticated",discountService.getAllProducts(pageNo,pageSize));
//        }
//        catch (Exception e)
//        {
//            log.error("there is an error : {}",e.getMessage());
//            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
//        }
//    }
}
