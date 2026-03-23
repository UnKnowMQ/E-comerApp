package com.cyberseccourse.userservice.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ProductStatus {
    @JsonProperty("active")
    ACTIVE,
    @JsonProperty("inactive")
    INACTIVE,
    @JsonProperty("out_of_stock")
    OUT_OF_STOCK,
    @JsonProperty("draft")
    DRAFT;
}
