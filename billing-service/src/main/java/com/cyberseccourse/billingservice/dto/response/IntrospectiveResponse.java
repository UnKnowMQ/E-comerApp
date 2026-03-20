package com.cyberseccourse.billingservice.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class IntrospectiveResponse {

    private Boolean isValid;
    private String fullName;
    private String userName;
    private Integer customerId;
}
