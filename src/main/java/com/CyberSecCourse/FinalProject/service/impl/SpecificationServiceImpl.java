package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.response.SpecificationResponse;
import com.CyberSecCourse.FinalProject.repository.SpecificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpecificationServiceImpl {

    private final SpecificationRepository specificationRepository;

    public List<SpecificationResponse> getSpecsByProduct(int productId){
        List<SpecificationResponse> result = specificationRepository.getSpecsByProductId(productId).stream().map(spec ->
            SpecificationResponse.builder()
                    .name(spec.getName()).value(spec.getValue()).build()

        ).toList();
        return result;

    }

}
