package com.CyberSecCourse.FinalProject.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class ProductTopResponse {

    private Integer id;

    private BigDecimal price;

    private Long quantity;

    private String name;
}
