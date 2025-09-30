package com.CyberSecCourse.FinalProject.type;


import com.CyberSecCourse.FinalProject.dto.request.InvoiceDetailRequest;
import com.CyberSecCourse.FinalProject.dto.request.InvoiceRequest;
import com.CyberSecCourse.FinalProject.dto.request.ProductRequestDTO;
import lombok.AllArgsConstructor;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class CreatePaymentLinkRequestBody {
    private String productName;
    private String username;
    private String description;
    private String returnUrl;
    private int price;
    private String cancelUrl;
    private InvoiceRequest invoiceRequest;
    private ProductRequestDTO productRequestDTO;
}