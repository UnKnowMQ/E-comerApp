package com.CyberSecCourse.FinalProject.dto.response;

import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvoiceResponse {

    private Integer invoiceId;
    private LocalDate invoiceDate;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String shippingAddress;
    private InvoiceStatus status;
    private String note;
    private Long orderCode;
    private String paymentId;
    private Instant expiredAt;

    // flatten từ entity (tránh trả object)
    private Integer userId;
    private String username;

    private Integer shopId;
    private String shopName;

    private List<InvoiceDetailResponse> details;
}