package com.CyberSecCourse.FinalProject.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryPieResponse {
    private String categoryName;
    private BigDecimal totalRevenue;
}