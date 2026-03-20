package com.cyberseccourse.billingservice.service;


import com.cyberseccourse.billingservice.dto.request.AuthRequestDTO;
import com.cyberseccourse.billingservice.dto.request.RegisterRequestDTO;
import com.cyberseccourse.billingservice.dto.response.AuthResponse;
import com.cyberseccourse.billingservice.dto.response.IntrospectiveResponse;
import com.cyberseccourse.billingservice.entity.Account;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;

import java.text.ParseException;

public interface AuthService {

    AuthResponse isAuthenticated(AuthRequestDTO authRequestDTO);
    String generateToken(Account account);
    IntrospectiveResponse introspect(String token ) throws JOSEException, ParseException;
    long registerCustomer(RegisterRequestDTO registerRequestDTO);
    boolean logout(HttpServletRequest request);

}
