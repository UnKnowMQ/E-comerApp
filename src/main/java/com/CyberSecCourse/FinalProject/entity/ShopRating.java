package com.CyberSecCourse.FinalProject.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_ratings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "comment", length = 500)
    private String comment;

    @Column(name = "invoice_id", nullable = false)
    private Integer invoiceId;
}
