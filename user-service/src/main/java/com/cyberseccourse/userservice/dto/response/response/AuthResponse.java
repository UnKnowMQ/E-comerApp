package com.cyberseccourse.userservice.dto.response.response;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {


    private String token;
    private Boolean isAuthenticated;



}
