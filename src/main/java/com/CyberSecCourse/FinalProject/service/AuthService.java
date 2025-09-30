package com.CyberSecCourse.FinalProject.service;


import com.CyberSecCourse.FinalProject.dto.request.AuthRequestDTO;
import com.CyberSecCourse.FinalProject.dto.request.CustomerRequestDTO;
import com.CyberSecCourse.FinalProject.dto.request.IntrospectRequestDTO;
import com.CyberSecCourse.FinalProject.dto.request.RegisterRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.AuthResponse;
import com.CyberSecCourse.FinalProject.dto.response.IntrospectiveResponse;
import com.CyberSecCourse.FinalProject.entity.Account;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.text.ParseException;

public interface AuthService {

    AuthResponse isAuthenticated(AuthRequestDTO authRequestDTO);
    String generateToken(Account account);
    IntrospectiveResponse introspect(String token ) throws JOSEException, ParseException;
    long registerCustomer(RegisterRequestDTO registerRequestDTO);
    boolean logout(HttpServletRequest request);

}
