package com.cyberseccourse.billingservice.entity;

import jakarta.persistence.Column;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

public class ProductSpecificationId implements Serializable {
        private static final long serialVersionUID = 1L;

        @Column(name = "productid", nullable = false)
        private Integer productId;

        @Column(name = "specificationspec_id" , nullable = false)
        private Integer specificationId;


        @Override
        public int hashCode() {
            return Objects.hash(productId,specificationId);
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
            ProductSpecificationId entity = (ProductSpecificationId) o;
            return Objects.equals(this.productId, entity.productId) &&
                    Objects.equals(this.specificationId, entity.specificationId);
        }
}
