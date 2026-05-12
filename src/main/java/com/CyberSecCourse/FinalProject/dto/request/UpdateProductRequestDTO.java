package com.CyberSecCourse.FinalProject.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class UpdateProductRequestDTO {

    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private String warranty;
    private String description;
    private Integer categoryId;

    private List<String> imageUrl;
    private List<SpecificationRequest> specifications;
}