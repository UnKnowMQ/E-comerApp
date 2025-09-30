package com.CyberSecCourse.FinalProject.dto.response;

import com.CyberSecCourse.FinalProject.entity.Brand;
import com.CyberSecCourse.FinalProject.entity.Category;
import com.CyberSecCourse.FinalProject.entity.Discount;
import com.CyberSecCourse.FinalProject.utils.ProductStatus;
import jakarta.persistence.Column;
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
