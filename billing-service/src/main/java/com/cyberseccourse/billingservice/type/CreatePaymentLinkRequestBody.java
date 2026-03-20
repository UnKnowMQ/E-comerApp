package com.cyberseccourse.billingservice.type;


import com.cyberseccourse.billingservice.dto.request.InvoiceRequest;
import com.cyberseccourse.billingservice.dto.request.ProductRequestDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

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