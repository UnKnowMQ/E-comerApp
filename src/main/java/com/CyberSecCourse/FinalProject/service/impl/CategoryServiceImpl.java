package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.entity.Category;
import com.CyberSecCourse.FinalProject.repository.CategoryRepository;
import com.CyberSecCourse.FinalProject.service.CategoryService;
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
