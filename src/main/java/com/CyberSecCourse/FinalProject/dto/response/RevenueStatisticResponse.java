package com.CyberSecCourse.FinalProject.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class RevenueStatisticResponse {
    private Integer year;
    private Integer month; // có thể null nếu thống kê theo năm
    private BigDecimal totalRevenue;
    private Long totalCustomers; // 👈 thêm cái này

}