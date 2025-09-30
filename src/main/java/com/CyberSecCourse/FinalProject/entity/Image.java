package com.CyberSecCourse.FinalProject.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "image")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Integer imageId;

    @Column(name = "image_name")
    private String imageName;

    @Column(name = "url")
    private String imageUrl;

    @JoinColumn(name = "productid")
    @ManyToOne(fetch = FetchType.EAGER)
    private Product product;

}
