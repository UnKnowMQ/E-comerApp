package com.CyberSecCourse.FinalProject.entity;


import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "cart_id", nullable = false)
    private Integer cart_id;

    @Column(name = "product_id" , nullable = false)
    private Integer product_id;

    @Override
    public int hashCode() {
        return Objects.hash(cart_id,product_id);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        CartItemId entity = (CartItemId) o;
        return Objects.equals(this.cart_id, entity.cart_id) &&
                Objects.equals(this.product_id, entity.product_id);
    }
}
