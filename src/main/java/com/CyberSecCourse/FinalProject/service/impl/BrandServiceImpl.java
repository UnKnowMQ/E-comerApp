package com.CyberSecCourse.FinalProject.service.impl;


import com.CyberSecCourse.FinalProject.entity.Brand;
import com.CyberSecCourse.FinalProject.repository.BrandRepository;
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
