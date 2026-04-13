package com.CyberSecCourse.FinalProject.entity;


import com.CyberSecCourse.FinalProject.utils.ProductStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "product")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "product_id", nullable = false, unique = true, length = 255)
    private String productId;

    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "slug", nullable = false, length = 255)
    private String slug;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "specs", nullable = false, columnDefinition = "TEXT")
    private String specs;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "warranty", nullable = false, length = 255)
    private String warranty;

    // Note: typo "satus" preserved from original schema
    @Column(name = "satus", nullable = false, length = 50)
    private String status;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "updated_at", nullable = false)
    private LocalDate updatedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;

    @Column(name = "sale_volume")
    private Integer saleVolume;

    @OneToMany(mappedBy = "product")
    @ToString.Exclude
    @JsonIgnore
    private Set<Image> images;

}
