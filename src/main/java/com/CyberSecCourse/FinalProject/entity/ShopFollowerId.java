package com.CyberSecCourse.FinalProject.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;


@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ShopFollowerId {

    @Column(name = "shopsshop_id")
    private Integer shopId;

    @Column(name = "useruser_id")
    private Integer userId;
}
