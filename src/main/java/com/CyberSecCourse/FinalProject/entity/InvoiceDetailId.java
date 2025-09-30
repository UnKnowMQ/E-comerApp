package com.CyberSecCourse.FinalProject.entity;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceDetailId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "invoice_id", nullable = false)
    private Integer invoice_id;

    @Column(name = "product_id" , nullable = false)
    private Integer product_id;

    @Override
    public int hashCode() {
        return Objects.hash(invoice_id,product_id);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        InvoiceDetailId entity = (InvoiceDetailId) o;
        return Objects.equals(this.invoice_id, entity.invoice_id) &&
                Objects.equals(this.product_id, entity.product_id);
    }
}
