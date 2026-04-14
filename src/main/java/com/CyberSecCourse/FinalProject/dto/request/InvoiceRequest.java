package com.CyberSecCourse.FinalProject.dto.request;

import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceRequest {

    private Integer invoice_id;

    private LocalDate invoice_date;

    private BigDecimal total_amount;

    private String payment_method;

    private String shipping_address;

    private InvoiceStatus invoice_status;

    private String note;

    private Long order_code;

    private String payment_id;

    private Integer customerId;

    private Instant expired_at;

}
