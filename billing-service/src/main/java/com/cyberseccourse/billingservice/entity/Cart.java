package com.cyberseccourse.billingservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.Set;

@Entity
@Table(name = "cart")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cart {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Integer cartId;

    @Column(name = "updated_at")
    private Instant updateAt;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "status")
    private String cartStatus;

    @ManyToOne
    @JoinColumn(name = "c_id")
    @JsonIgnore
    private Customer customer;

    @OneToMany(mappedBy = "cart")
    @ToString.Exclude
    private Set<CartItem> listItem;

}
