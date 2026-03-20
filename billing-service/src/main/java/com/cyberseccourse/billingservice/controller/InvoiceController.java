package com.cyberseccourse.billingservice.controller;


import com.cyberseccourse.billingservice.dto.response.ResponseData;
import com.cyberseccourse.billingservice.dto.response.ResponseError;
import com.cyberseccourse.billingservice.service.impl.CheckoutServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/invoice")
public class InvoiceController {

    private final CheckoutServiceImpl checkoutService;

    @PutMapping("/set-checkout-result")
    public ResponseData<?> getProductMultipleSearchCol(@RequestParam String status,
                                                       @RequestParam Long orderCode
    ) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"Edit Invoice Status!",checkoutService.checkOut2(status,orderCode));
        }
        catch (Exception e)
        {
            log.error("there is an error in invoice api: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

}
