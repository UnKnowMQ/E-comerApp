package com.cyberseccourse.billingservice.dto.request;

import com.cyberseccourse.billingservice.entity.Invoice;
import com.cyberseccourse.billingservice.entity.InvoiceDetailId;
import com.cyberseccourse.billingservice.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceDetailRequest implements Serializable {

    private InvoiceDetailId id;

    private Invoice invoice;

    private Product product;

    private Integer quantity;

    private BigDecimal unitPrice;

    private BigDecimal subTotal;
}
