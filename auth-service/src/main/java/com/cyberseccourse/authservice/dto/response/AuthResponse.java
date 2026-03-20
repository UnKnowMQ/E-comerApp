package com.cyberseccourse.authservice.dto.response;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {


    private String token;
    private Boolean isAuthenticated;



}
