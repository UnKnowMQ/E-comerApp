package com.cyberseccourse.billingservice.service.impl;


import com.cyberseccourse.billingservice.repository.DiscountRepository;
import com.cyberseccourse.billingservice.service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DiscountServiceImpl implements DiscountService {


    private final DiscountRepository discountRepository;

}
