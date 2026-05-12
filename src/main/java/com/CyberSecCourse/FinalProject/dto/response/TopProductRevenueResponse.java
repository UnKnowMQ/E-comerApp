package com.CyberSecCourse.FinalProject.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TopProductRevenueResponse {
    private Integer productId;
    private String productName;
    private Long totalQuantity;
    private BigDecimal totalRevenue;
}