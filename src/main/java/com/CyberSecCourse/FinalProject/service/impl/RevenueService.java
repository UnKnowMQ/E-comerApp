package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.response.CategoryPieResponse;
import com.CyberSecCourse.FinalProject.dto.response.RevenueStatisticResponse;
import com.CyberSecCourse.FinalProject.dto.response.TopProductRevenueResponse;
import com.CyberSecCourse.FinalProject.repository.InvoiceRepository;
import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RevenueService {

    private final InvoiceRepository invoiceRepository;

    public List<RevenueStatisticResponse> getRevenueByMonth(int year, int shopId) {
        return invoiceRepository.getRevenueByMonth(year,shopId);
    }

    public List<RevenueStatisticResponse> getRevenueByYear(int shopId) {
        return invoiceRepository.getRevenueByYear(shopId);
    }


    public List<TopProductRevenueResponse> getTopProducts(
            int shopId, int limit
    ){
        LocalDate start = LocalDate.now().withDayOfYear(1);
        LocalDate end = LocalDate.now().withMonth(12).withDayOfMonth(31);

        return invoiceRepository.getTopProductRevenue(
                shopId,
                InvoiceStatus.DONE,
                start,
                end,
                PageRequest.of(0, limit)
        );
    }
    public List<CategoryPieResponse> getCategoryPie(int shopId) {
        LocalDate start = LocalDate.now().withDayOfYear(1);
        LocalDate end = LocalDate.now().withMonth(12).withDayOfMonth(31);

        return invoiceRepository.getCategoryPie(
                shopId,
                InvoiceStatus.DONE,
                start,
                end
        );
    }
}