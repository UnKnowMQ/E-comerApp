package com.cyberseccourse.billingservice.dto.request;


import com.cyberseccourse.billingservice.utils.InvoiceStatus;
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
