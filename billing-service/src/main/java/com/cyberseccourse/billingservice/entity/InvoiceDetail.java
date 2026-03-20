package com.cyberseccourse.billingservice.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "invoice_detail")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDetail {

    @EmbeddedId
    private InvoiceDetailId id;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "invoice_id")
    @MapsId("invoice_id")
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "product_id")
    @MapsId("product_id")
    private Product product;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "unit_price")
    private BigDecimal unitPrice;

    @Column(name = "subtotal")
    private BigDecimal subTotal;




}
