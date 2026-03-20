package com.cyberseccourse.billingservice.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum InvoiceStatus {
    @JsonProperty("pending")
    PENDING,
    @JsonProperty("cancelled")
    CANCELLED,
    @JsonProperty("shipping")
    SHIPPING,
    @JsonProperty("delivered")
    DELIVERED,
    @JsonProperty("refunded")
    REFUNDED;

}
