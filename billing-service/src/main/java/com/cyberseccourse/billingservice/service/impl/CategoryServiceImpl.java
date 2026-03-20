package com.cyberseccourse.billingservice.service.impl;


import com.cyberseccourse.billingservice.entity.Category;
import com.cyberseccourse.billingservice.repository.CategoryRepository;
import com.cyberseccourse.billingservice.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;


    @Override
    public List<Category> getCategory() {
        return categoryRepository.findAll();
    }
}
