package com.CyberSecCourse.FinalProject.controller;

import com.CyberSecCourse.FinalProject.dto.response.CategoryPieResponse;
import com.CyberSecCourse.FinalProject.dto.response.RevenueStatisticResponse;
import com.CyberSecCourse.FinalProject.dto.response.TopProductRevenueResponse;
import com.CyberSecCourse.FinalProject.repository.InvoiceRepository;
import com.CyberSecCourse.FinalProject.service.impl.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/revenue")
@RequiredArgsConstructor
public class RevenueController {

    private final RevenueService revenueService;

    // theo tháng trong năm
    @GetMapping("/month")
    public List<RevenueStatisticResponse> getRevenueByMonth(
            @RequestParam int year,
            @RequestParam int shopId

    ){
        return revenueService.getRevenueByMonth(year,shopId);
    }

    // theo năm
    @GetMapping("/year")
    public List<RevenueStatisticResponse> getRevenueByYear( @RequestParam int shopId){
        return revenueService.getRevenueByYear(shopId);
    }

    @GetMapping("/top-products")
    public List<TopProductRevenueResponse> getTopProducts(
            @RequestParam int shopId,
            @RequestParam(defaultValue = "5") int limit
    ){
        return revenueService.getTopProducts(shopId, limit);
    }

    @GetMapping("/category-pie")
    public List<CategoryPieResponse> getCategoryPie(
            @RequestParam int shopId
    ){
        return revenueService.getCategoryPie(shopId);
    }
}