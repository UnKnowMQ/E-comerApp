package com.CyberSecCourse.FinalProject.controller;

import com.CyberSecCourse.FinalProject.dto.request.*;
import com.CyberSecCourse.FinalProject.dto.response.*;
import com.CyberSecCourse.FinalProject.entity.Account;
import com.CyberSecCourse.FinalProject.entity.RefreshToken;
import com.CyberSecCourse.FinalProject.repository.AccountRepository;
import com.CyberSecCourse.FinalProject.repository.RefreshTokenRepsitory;
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
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/auth")
public class AuthController {

    private final AuthServiceImpl authService;
    private final RefreshTokenRepsitory refreshTokenRepsitory;
    private final AccountRepository accountRepository;

    @PostMapping("/login")
    public ResponseData<AuthResponse> login(@RequestBody AuthRequestDTO authRequestDTO, HttpServletResponse response) {
        try{
            var result = authService.isAuthenticated(authRequestDTO);
            if(result.getIsAuthenticated())
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
    public ResponseData<Long> register(@RequestBody RegisterRequestDTO registerRequestDTO) {
        try{
            System.out.println(registerRequestDTO.getUser().getAddress());;
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

//    @PostMapping("/logout")
//    public ResponseData<Boolean> logout(HttpServletRequest request) {
//        try{
//            boolean result = authService.logout(request);
//            return new ResponseData<>(HttpStatus.OK.value(),"Logout!",result);
//        }
//        catch (Exception e)
//        {
//            log.error("there is an error : {}",e.getMessage());
//            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
//        }

    @PostMapping("/logout")
    public String logout(@RequestBody RefreshRequest request) {

        RefreshToken token = refreshTokenRepsitory
                .findByToken(request.getRefreshToken());

        token.setRevoked(true);
        refreshTokenRepsitory.save(token);

        return "Logged out successfully";
    }

    @PostMapping("/refresh")
    public ResponseData<?> refresh(@RequestBody RefreshRequest request) {

        RefreshToken token = refreshTokenRepsitory
                .findByToken(request.getRefreshToken())
                ;

        if (token.getRevoked() || token.getExpiredAt().isBefore(LocalDateTime.now())) {
           return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Token is expired or revoked");
        }

        Account account = accountRepository.findByUserId(token.getUserId()).orElseThrow();

        String newAccessToken = authService.generateAccessToken(account);

        TokenResponse tokenResponse  = TokenResponse.builder()
                .accessToken(newAccessToken)
                .build();
                    return new ResponseData<>(HttpStatus.OK.value(),"Access token renew!",tokenResponse);

    }


}
