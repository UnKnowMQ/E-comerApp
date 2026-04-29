package com.CyberSecCourse.FinalProject.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvoiceDetailResponse {

    private Integer productId;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
}