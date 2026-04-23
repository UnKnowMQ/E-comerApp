package com.CyberSecCourse.FinalProject.dto.request;

import com.CyberSecCourse.FinalProject.entity.Brand;
import com.CyberSecCourse.FinalProject.entity.Category;
import com.CyberSecCourse.FinalProject.entity.Image;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductShopRequestDTO {

    private String productName;

    private Category category;

    private BigDecimal price;

    private Integer quantity;

    private String warranty;

    private String status;

    private String description;

    private Set<Image> images;

    private Integer shopId;

}
