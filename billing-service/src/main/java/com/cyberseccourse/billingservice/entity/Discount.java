package com.cyberseccourse.billingservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "discount")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "discount_id")
    private Integer discount_id;

    @Column(name = "discount_name")
    private String discount_name;

    @Column(name = "status")
    private String status;

    @Column(name = "parent_id")
    private Integer discount_value ;

    @Column(name = "limit")
    private Integer limit ;

    @Column(name = "start_date")
    private Instant start_date;

    @Column(name = "end_date")
    private Instant end_date;


    @Column(name = "type")
    private String discount_type;

    @ToString.Exclude
    @OneToMany(mappedBy = "discount")
    @JsonIgnore
    private Set<Product> products = new HashSet<>();



}
