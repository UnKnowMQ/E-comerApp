package com.CyberSecCourse.FinalProject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "shops")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shop_id")
    private Integer shopId;

    @Column(name = "shop_name", nullable = false, length = 255)
    private String shopName;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "logo", length = 255)
    private String logo;

    @Column(name = "banner", length = 255)
    private String banner;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "total_products")
    private Long totalProducts;

    @Column(name = "total_followers")
    private Long totalFollowers;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status")
    private String shopStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @Column(name = "business_type", length = 255)
    private String businessType;

    @Column(name = "business_verification", nullable = false, length = 255)
    private String businessVerification;

    @Column(name = "shop_address", nullable = false, length = 500)
    private String shopAddress;


    @OneToMany(mappedBy = "currentShop")
    @ToString.Exclude
    @JsonIgnore
    private Set<Product> listProduct;
}