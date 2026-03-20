package com.cyberseccourse.billingservice.dto.response;

import com.cyberseccourse.billingservice.utils.ProductStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Builder
@Getter
@Setter
public class ProductResponse {

    private Integer id;

    private String productId;

    private String productName;

    private String slug;

    private BigDecimal price;

    private Integer quantity;

    private String warranty;

    private ProductStatus status;

    private Instant updated_at;

    private Instant created_at;

    private String brand_name;

    private String category_name;

    private String discount_name;

    private String imageUrl;
}
