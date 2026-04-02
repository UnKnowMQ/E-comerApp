package com.cyberseccourse.authservice.service.impl;


import com.cyberseccourse.authservice.dto.request.AuthRequestDTO;
import com.cyberseccourse.authservice.dto.request.RegisterRequestDTO;
import com.cyberseccourse.authservice.dto.response.AuthResponse;
import com.cyberseccourse.authservice.dto.response.IntrospectiveResponse;
import com.cyberseccourse.authservice.entity.Account;
import com.cyberseccourse.authservice.entity.InvalidToken;
import com.cyberseccourse.authservice.entity.RefreshTokens;
import com.cyberseccourse.authservice.repository.AccountRepository;
import com.cyberseccourse.authservice.repository.InvalidTokenRepsitory;
import com.cyberseccourse.authservice.repository.RefreshTokensRepsitory;
import com.cyberseccourse.authservice.service.AuthService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    private  final RefreshTokensRepsitory refreshTokensRepsitory;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @Override
    public AuthResponse isAuthenticated(AuthRequestDTO authRequestDTO) {
        var account = accountRepository.findByUsername(authRequestDTO.getUsername()).orElseThrow();
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
        var token = generateToken(account);
        return AuthResponse.builder()
                .token(token)
                .isAuthenticated(true)
                .build();
    }

    @Override
    public String generateToken(Account account) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        String role;
        if(account.getCustomer().getCustomerId() != null)
            role = "Customer";
        else
            role = account.getManager().getManager_id()!= null ? "Manager" : "Administrator";


        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .claim("scope",role)
                .subject(account.getUsername())
                .claim("username",account.getUsername()
                .claim("roles",account.getRole())
                .issuer(".com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()))
                .build();

        Payload payload = new Payload(claimsSet.toJSONObject());

        JWSObject jwsObject  = new JWSObject(jwsHeader,payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
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
        boolean checkInvalid = (refreshTokensRepsitory.findById(token) == null) ? false : true;
        System.out.println(checkInvalid);
        JWSVerifier verifier  = new MACVerifier(SIGNER_KEY.getBytes());
        Optional<RefreshTokens> itokens =  refreshTokensRepsitory.findById(token);
        RefreshTokens invalidToken = itokens.orElse(null);
        SignedJWT jwt =  SignedJWT.parse(token);
        var verifired = jwt.verify(verifier);

        Date exprirationTime = jwt.getJWTClaimsSet().getExpirationTime();
        boolean checkDate = false;
        if (invalidToken != null) {
            checkDate = invalidToken.getExpired_at().equals(exprirationTime.toInstant());
        }

        checkInvalid = checkDate && checkInvalid;


        return IntrospectiveResponse.builder()
                .isValid(verifired && exprirationTime.after(new Date()) && !checkInvalid)
                .fullName((String) jwt.getJWTClaimsSet().getClaim("fullname"))
                .userName((String) jwt.getJWTClaimsSet().getSubject())
                .customerId( Math.toIntExact((Long) jwt.getJWTClaimsSet().getClaim("customerId")) )
                .build();
    }

    @Override
    public String registerAccount(RegisterRequestDTO registerRequestDTO) {

        Account a = Account.builder()
                .username(registerRequestDTO.getUsername())
                .password(passwordEncoder.encode(registerRequestDTO.getPassword()))
                .build();
        Account checkExists = accountRepository.findByUsername(registerRequestDTO.getUsername()).orElseThrow();
        if(checkExists.getPassword() != null)
        {
            return null;
        }

        return a.getUsername();
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

            refreshTokensRepsitory.save(RefreshTokens.builder()
                    .token(token)
                    .expired_at(jwt.getJWTClaimsSet().getExpirationTime().toInstant())
                    .build());
            return true;
        } catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }
}
