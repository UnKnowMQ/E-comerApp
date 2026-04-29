package com.CyberSecCourse.FinalProject.dto.request;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CheckoutRequest {
    InvoiceRequest invoiceRequest;
    ProductRequestDTO productRequest;

}
