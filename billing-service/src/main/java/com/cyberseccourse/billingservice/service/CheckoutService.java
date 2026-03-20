package com.cyberseccourse.billingservice.service;


import com.cyberseccourse.billingservice.dto.request.InvoiceRequest;
import com.cyberseccourse.billingservice.dto.request.ProductRequestDTO;

public interface CheckoutService {

    void checkOut1(InvoiceRequest invoiceRequest, ProductRequestDTO productRequestDTO);

    boolean checkOut2(String status, Long orderCode) throws  Exception;




}
