package com.CyberSecCourse.FinalProject.dto.request;

import com.CyberSecCourse.FinalProject.entity.Invoice;
import com.CyberSecCourse.FinalProject.entity.InvoiceDetailId;
import com.CyberSecCourse.FinalProject.entity.Product;
import jakarta.persistence.*;
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
