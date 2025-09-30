package com.CyberSecCourse.FinalProject.service;

import com.CyberSecCourse.FinalProject.dto.request.InvoiceDetailRequest;
import com.CyberSecCourse.FinalProject.dto.request.InvoiceRequest;
import com.CyberSecCourse.FinalProject.dto.request.ProductRequestDTO;
import com.CyberSecCourse.FinalProject.entity.Invoice;
import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;

import java.util.Set;

public interface CheckoutService {

    void checkOut1(InvoiceRequest invoiceRequest, ProductRequestDTO productRequestDTO);

    boolean checkOut2(String status, Long orderCode);




}
