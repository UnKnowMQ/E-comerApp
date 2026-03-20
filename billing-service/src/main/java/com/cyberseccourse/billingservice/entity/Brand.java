package com.cyberseccourse.billingservice.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "brand")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Brand{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "brand_id")
    private Integer brand_id;

    @Column(name = "brand_name")
    private String brand_name;

    @Column(name = "logo")
    private String brand_logo;

    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private String status;

    @ToString.Exclude
    @OneToMany(mappedBy = "brand")
    @JsonIgnore
    private Set<Product> products  = new HashSet<>();

}
