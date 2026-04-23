package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.request.*;
import com.CyberSecCourse.FinalProject.dto.response.AuthResponse;
import com.CyberSecCourse.FinalProject.dto.response.IntrospectiveResponse;
import com.CyberSecCourse.FinalProject.entity.Account;
import com.CyberSecCourse.FinalProject.entity.RefreshToken;
import com.CyberSecCourse.FinalProject.entity.User;
import com.CyberSecCourse.FinalProject.repository.AccountRepository;
import com.CyberSecCourse.FinalProject.repository.RefreshTokenRepsitory;
import com.CyberSecCourse.FinalProject.repository.UserRepository;
import com.CyberSecCourse.FinalProject.service.AuthService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl  implements AuthService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository customerRepository;

    private final RefreshTokenRepsitory refreshTokenRepsitory;
    
    private final WalletServiceImpl walletService;
    private final UserRepository userRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @Override
    public AuthResponse isAuthenticated(AuthRequestDTO authRequestDTO) {
        log.info(authRequestDTO.getEmail());
        var account = accountRepository.findByEmail(authRequestDTO.getEmail()).orElseThrow();
        log.info("email:" + authRequestDTO.getEmail());
        log.info("account:" + account.getUserId());

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean isAuth = passwordEncoder.matches(authRequestDTO.getPassword(), account.getPassword());
        if(!isAuth)
        {
            log.error("unauthenticated !");
            return AuthResponse.builder()
                    .token(null)
                    .isAuthenticated(false)
                    .build();
        }
        var token = generateRefreshToken(account);
        return AuthResponse.builder()
                .token(token)
                .isAuthenticated(true)
                .build();
    }

    @Override
    public String generateToken(Account account) {
        JWSHeader  jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        String role ;
        User user = customerRepository.getReferenceById(account.getUserId());
       role  = user.getRole();


        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .claim("scope",role)
                .subject(account.getEmail())
                .claim("email",account.getEmail())
                .claim("userId",account.getUserId())
                .issuer("Eshop.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()))
                .build();

        Payload payload = new Payload(claimsSet.toJSONObject());

        JWSObject jwsObject  = new JWSObject(jwsHeader,payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            refreshTokenRepsitory.save(RefreshToken
                    .builder()
                    .token(jwsObject.serialize()).userId(account.getUserId()).expiredAt(LocalDateTime.now().plusDays(7)).revoked(false)
                    .build());
            return jwsObject.serialize();
        }catch (Exception e)
        {
            log.error("Cannot create token error: {}",e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public IntrospectiveResponse introspect(String token) throws JOSEException, ParseException {

        if(token == null)
            return IntrospectiveResponse.builder().isValid(false).build();

        boolean checkInvalid = (refreshTokenRepsitory.findByToken(token) == null) ? false : true;
        System.out.println(checkInvalid);
        JWSVerifier verifier  = new MACVerifier(SIGNER_KEY.getBytes());
        Optional<RefreshToken> itokens = Optional.ofNullable(refreshTokenRepsitory.findByToken(token));
        RefreshToken invalidToken = itokens.orElse(null);
        SignedJWT jwt =  SignedJWT.parse(token);
        var verifired = jwt.verify(verifier);

        Date exprirationTime = jwt.getJWTClaimsSet().getExpirationTime();
        boolean checkDate = false;
        if (invalidToken != null) {
            checkDate = invalidToken.getExpiredAt().equals(exprirationTime.toInstant());
        }

        checkInvalid = checkDate && checkInvalid;


        return IntrospectiveResponse.builder()
                .isValid(verifired && exprirationTime.after(new Date()) && !checkInvalid)
                .fullName((String) jwt.getJWTClaimsSet().getClaim("email"))
                .customerId(Integer.parseInt(jwt.getJWTClaimsSet().getClaim("userId").toString()))
                .build();
    }

    @Override
    public long registerCustomer(RegisterRequestDTO registerRequestDTO) {

        if(accountRepository.findByEmail(registerRequestDTO.getEmail()).isPresent())
        {
            throw new RuntimeException("Email is used!");
        }
        if(accountRepository.findByUsername(registerRequestDTO.getUsername()).isPresent())
        {
            throw new RuntimeException("Username is used!");

        }

        Account a = Account.builder()
                .email(registerRequestDTO.getEmail())
                .password(passwordEncoder.encode(registerRequestDTO.getPassword()))
                .status("Active")
                .build();

        User c = User.builder()
                .email(registerRequestDTO.getEmail())
                .phoneNumber(registerRequestDTO.getPhone())
                .createdAt(LocalDate.now())
                .dateOfBirth(registerRequestDTO.getDate_of_birth())
                .firstname(registerRequestDTO.getFirstName())
                .lastname(registerRequestDTO.getLastName())
                .gender(registerRequestDTO.getGender())
                .role("Customer")
                .address(registerRequestDTO.getUser().getAddress()).status("Active").note(null).username(registerRequestDTO.getUsername()).avatar(null)
                .build();
        a.setUserId(c.getUserId());

        User customer = customerRepository.save(c);

        walletService.createWallet(WalletRequestDTO.builder()
                        .userId(Long.valueOf(c.getUserId())).balance(BigDecimal.valueOf(0)).status("ACTIVE").build()
                );
        a.setUserId(customer.getUserId());
        accountRepository.save(a);
        
        return customer.getUserId();
    }

    @Override
    public boolean logout(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization");
            System.out.println(token);
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            SignedJWT jwt = SignedJWT.parse(token);

            refreshTokenRepsitory.save(RefreshToken.builder()
                    .token(token)
                    .expiredAt(LocalDateTime.ofInstant(jwt.getJWTClaimsSet().getExpirationTime().toInstant(), ZoneId.systemDefault()))
                    .build());
            return true;
        } catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }
    public String generateAccessToken(Account account) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        User user = customerRepository.getReferenceById(account.getUserId());
        String role = user.getRole();

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(account.getEmail())
                .issuer("Eshop.com")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(15, ChronoUnit.MINUTES))) // ngắn hạn
                .claim("scope", role)
                .claim("userId", account.getUserId())
                .claim("email", account.getEmail())
                .jwtID(UUID.randomUUID().toString()) // rất nên có
                .build();

        JWSObject jwsObject = new JWSObject(jwsHeader, new Payload(claimsSet.toJSONObject()));

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize(); // ❗ KHÔNG lưu DB
        } catch (Exception e) {
            log.error("Cannot create access token: {}", e.getMessage());
            throw new RuntimeException(e);
        }
    }
    public String generateRefreshToken(Account account) {
        String refreshToken = UUID.randomUUID().toString();

        refreshTokenRepsitory.save(
                RefreshToken.builder()
                        .token(refreshToken)
                        .userId(account.getUserId())
                        .expiredAt(LocalDateTime.now().plusDays(7))
                        .revoked(false)
                        .build()
        );

        return refreshToken;
    }

}
