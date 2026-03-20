package com.cyberseccourse.authservice.service;


import com.cyberseccourse.authservice.dto.request.AuthRequestDTO;
import com.cyberseccourse.authservice.dto.request.RegisterRequestDTO;
import com.cyberseccourse.authservice.dto.response.AuthResponse;
import com.cyberseccourse.authservice.dto.response.IntrospectiveResponse;
import com.cyberseccourse.authservice.entity.Account;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;

import java.text.ParseException;

public interface AuthService {

    AuthResponse isAuthenticated(AuthRequestDTO authRequestDTO);
    String generateToken(Account account);
    IntrospectiveResponse introspect(String token ) throws JOSEException, ParseException;
    String registerAccount(RegisterRequestDTO registerRequestDTO);
    boolean logout(HttpServletRequest request);

}
