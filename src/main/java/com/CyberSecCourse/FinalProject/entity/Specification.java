package com.CyberSecCourse.FinalProject.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "specification")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Specification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spec_id")
    private Integer spec_id;

    @Column(name = "name")
    private String name;

    @Column(name = "unit")
    private String unit;

}
