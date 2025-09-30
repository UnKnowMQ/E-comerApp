package com.CyberSecCourse.FinalProject.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class CartItemResponse {

    private ProductResponse productResponse;

    private int quantity;

    private BigDecimal price;



}
