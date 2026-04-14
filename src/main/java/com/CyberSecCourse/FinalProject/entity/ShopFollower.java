package com.CyberSecCourse.FinalProject.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "shops_followers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopFollower {


    @EmbeddedId
    private ShopFollowerId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("shopId")
    @JoinColumn(name = "shopsshop_id")
    private Shop shop;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "useruser_id")
    private User user;
}
