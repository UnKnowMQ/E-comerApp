package com.CyberSecCourse.FinalProject.controller;

import com.CyberSecCourse.FinalProject.dto.request.InvoiceRequest;
import com.CyberSecCourse.FinalProject.dto.request.ProductRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.ResponseData;
import com.CyberSecCourse.FinalProject.dto.response.ResponseError;
import com.CyberSecCourse.FinalProject.service.impl.CheckoutServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/checkout")
public class CheckoutController {


    private final CheckoutServiceImpl checkoutService;

    @PostMapping("")
    public ResponseData<?> createCheckoutAction(@RequestBody ProductRequestDTO productRequestDTO,@RequestBody InvoiceRequest invoiceRequest
    ) {
        try{

            return new ResponseData<>(HttpStatus.OK.value(),"Check out !",checkoutService.checkout(invoiceRequest,productRequestDTO));
        }
        catch (Exception e)
        {
            log.error("there is an error in checkout service: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
}
