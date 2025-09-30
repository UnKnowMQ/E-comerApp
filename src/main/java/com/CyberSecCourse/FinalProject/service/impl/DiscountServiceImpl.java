package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.response.PageResponse;
import com.CyberSecCourse.FinalProject.dto.response.ProductResponse;
import com.CyberSecCourse.FinalProject.entity.Discount;
import com.CyberSecCourse.FinalProject.entity.Product;
import com.CyberSecCourse.FinalProject.repository.DiscountRepository;
import com.CyberSecCourse.FinalProject.repository.ProductRepository;
import com.CyberSecCourse.FinalProject.service.DiscountService;
import com.CyberSecCourse.FinalProject.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DiscountServiceImpl implements DiscountService {


    private final DiscountRepository discountRepository;

}
