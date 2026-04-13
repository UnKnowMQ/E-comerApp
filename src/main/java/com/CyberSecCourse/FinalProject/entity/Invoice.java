package com.CyberSecCourse.FinalProject.entity;


import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "invoice")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer invoice_id;

    @Column(name = "invoice_date")
    private LocalDate invoice_date;

    @Column(name = "total_amount")
    private BigDecimal total_amount;

    @Column(name = "payment_method")
    private String payment_method; ;

    @Column(name = "shipping_address")
    private String shipping_address;


    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private InvoiceStatus invoice_status;

    @Column(name = "note")
    private String note;

    @Column(name = "order_code")
    private Long order_code;

    @Column(name = "payment_id")
    private String payment_id;

    @Column(name = "exprired_at")
    private Instant exprired_at;


    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "invoice")
    @ToString.Exclude
    private Set<InvoiceDetail> setInvoiceDetail  = new HashSet<>();





}
