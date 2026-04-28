package com.CyberSecCourse.FinalProject.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class IntrospectiveResponse {

    private Boolean isValid;
    private String email;
    private String userName;
    private Integer customerId;
    private String role;
    private String phone;
}
