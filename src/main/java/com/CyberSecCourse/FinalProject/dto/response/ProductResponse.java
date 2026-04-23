package com.CyberSecCourse.FinalProject.dto.response;

import com.CyberSecCourse.FinalProject.entity.Brand;
import com.CyberSecCourse.FinalProject.entity.Category;
import com.CyberSecCourse.FinalProject.entity.Discount;
import com.CyberSecCourse.FinalProject.entity.Image;
import com.CyberSecCourse.FinalProject.utils.ProductStatus;
import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Set;

@Builder
@Getter
@Setter
public class ProductResponse {

    private Integer id;

    private String productName;

    private String slug;

    private BigDecimal price;

    private Integer quantity;

    private String warranty;

    private ProductStatus status;

    private Instant updated_at;

    private Instant created_at;

    private String category_name;

    private String description;



    private Set<Image> imageUrl;

}
