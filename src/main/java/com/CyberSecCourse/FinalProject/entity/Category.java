package com.CyberSecCourse.FinalProject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "category")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer category_id;

    @Column(name = "category_name")
    private String category_name;

    @Column(name = "slug")
    private String slug;

    @Column(name = "status")
    private String status;

    @Column(name = "category_img", nullable = true)
    private String categoryImg;

    @Column(name = "parent_id")
    private Integer parentId;

    @ToString.Exclude
    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private Set<Product> products = new HashSet<>();


}
