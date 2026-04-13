package com.CyberSecCourse.FinalProject.controller;

import com.CyberSecCourse.FinalProject.dto.request.AuthRequestDTO;
import com.CyberSecCourse.FinalProject.dto.request.CustomerRequestDTO;
import com.CyberSecCourse.FinalProject.dto.request.IntrospectRequestDTO;
import com.CyberSecCourse.FinalProject.dto.request.RegisterRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.AuthResponse;
import com.CyberSecCourse.FinalProject.dto.response.IntrospectiveResponse;
import com.CyberSecCourse.FinalProject.dto.response.ResponseData;
import com.CyberSecCourse.FinalProject.dto.response.ResponseError;
import com.CyberSecCourse.FinalProject.service.AuthService;
import com.CyberSecCourse.FinalProject.service.impl.AuthServiceImpl;
import com.CyberSecCourse.FinalProject.utils.HttpStatusCustom;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseData<AuthResponse> login(@RequestBody AuthRequestDTO authRequestDTO, HttpServletResponse response) {
        try{
            var result = authService.isAuthenticated(authRequestDTO);
            if(result.getIsAuthenticated() == true)
            {

                return new ResponseData<>(HttpStatus.OK.value(),"User authenticated",result);
            }
            else
                return new ResponseError(HttpStatus.BAD_REQUEST.value(), "wrong username or password");
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

    @PostMapping("/introspect")
    public ResponseData<IntrospectiveResponse> isValid(@RequestHeader("Authorization") String authHeader)
    {
        String token = authHeader.replace("Bearer ", "");
        try{
            var result = authService.introspect(token);
            if(result.getIsValid())
                return new ResponseData<>(HttpStatus.OK.value(),"Token valid",result);
            else
                return new ResponseError(HttpStatus.BAD_REQUEST.value(), "Token Invalid");
        }
        catch (Exception e)
        {
            log.error("there is an error of introspect: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }


    }

    @PostMapping("/register")
    public ResponseData<Long> login(@RequestBody RegisterRequestDTO registerRequestDTO) {
        try{
            System.out.println(registerRequestDTO.getPassword());;
            Long result = authService.registerCustomer(registerRequestDTO);
            if(result == -1)
            {
                return new ResponseError(HttpStatusCustom.USERNAME_EXISTS.value(), HttpStatusCustom.USERNAME_EXISTS.reason());
            }
            return new ResponseData<>(HttpStatus.OK.value(),"Customer Register Done!",result);
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseData<Boolean> logout(HttpServletRequest request) {
        try{
            boolean result = authService.logout(request);
            return new ResponseData<>(HttpStatus.OK.value(),"Logout!",result);
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }



}
