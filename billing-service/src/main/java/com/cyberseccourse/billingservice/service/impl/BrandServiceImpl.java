package com.cyberseccourse.billingservice.service.impl;


import com.cyberseccourse.billingservice.entity.Brand;
import com.cyberseccourse.billingservice.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BrandServiceImpl {
    private final BrandRepository brandRepository;

    public List<Brand> findAll() {

        return brandRepository.findAll();
    }

}
