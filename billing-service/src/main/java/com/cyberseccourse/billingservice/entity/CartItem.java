package com.cyberseccourse.billingservice.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "cart_item")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

        @EmbeddedId
        @JsonIgnore
        private CartItemId id;

        @ManyToOne(fetch = FetchType.LAZY,optional = false)
        @JoinColumn(name = "cart_id")
        @MapsId("cart_id")
        @JsonIgnore
        private Cart cart;

        @ManyToOne(fetch = FetchType.LAZY,optional = false)
        @JoinColumn(name = "product_id")
        @MapsId("product_id")
        private Product product;

        @Column(name = "quantity")
        private Integer quantity;

        @Column(name = "price")
        private BigDecimal price;
}
