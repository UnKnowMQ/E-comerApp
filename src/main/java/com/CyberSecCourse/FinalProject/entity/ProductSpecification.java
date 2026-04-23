package com.CyberSecCourse.FinalProject.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product_specification")
public class ProductSpecification {

    @EmbeddedId
    private ProductSpecificationId productSpecificationId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "spec_id")
    @MapsId("specificationId")
    private Specification specification;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id")
    @MapsId("productId")
    private Product product;

    @Column(name = "value", nullable = false)
    private String value;
}
