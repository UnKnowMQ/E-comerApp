package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.request.*;
import com.CyberSecCourse.FinalProject.dto.response.AuthResponse;
import com.CyberSecCourse.FinalProject.dto.response.IntrospectiveResponse;
import com.CyberSecCourse.FinalProject.entity.Account;
import com.CyberSecCourse.FinalProject.entity.Customer;
import com.CyberSecCourse.FinalProject.entity.InvalidToken;
import com.CyberSecCourse.FinalProject.repository.AccountRepository;
import com.CyberSecCourse.FinalProject.repository.CustomerRepository;
import com.CyberSecCourse.FinalProject.repository.InvalidTokenRepsitory;
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

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl  implements AuthService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerRepository customerRepository;

    private  final InvalidTokenRepsitory invalidTokenRepsitory;
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
        JWSHeader  jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        String role;
        if(account.getCustomer().getCustomerId() != null)
            role = "Customer";
        else
            role = account.getManager().getManager_id()!= null ? "Manager" : "Administrator";


        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .claim("scope",role)
                .subject(account.getUsername())
                .claim("fullname",account.getCustomer().getFirstName() + " "+ account.getCustomer().getLastName())
                .claim("customerId",account.getCustomer().getCustomerId())
                .issuer("HlpcStore.com")
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
        boolean checkInvalid = (invalidTokenRepsitory.findById(token) == null) ? false : true;
        System.out.println(checkInvalid);
        JWSVerifier verifier  = new MACVerifier(SIGNER_KEY.getBytes());
        Optional<InvalidToken> itokens =  invalidTokenRepsitory.findById(token);
        InvalidToken invalidToken = itokens.orElse(null);
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
    public long registerCustomer(RegisterRequestDTO registerRequestDTO) {

        Account a = Account.builder()
                .username(registerRequestDTO.getUsername())
                .password(passwordEncoder.encode(registerRequestDTO.getPassword()))
                .build();
        log.info(registerRequestDTO.getPassword());
        Customer c = Customer.builder()
                .email(registerRequestDTO.getEmail())
                .phone(registerRequestDTO.getPhone())
                .createdAt(new Date().toInstant())
                .date_of_birth(registerRequestDTO.getDate_of_birth())
                .firstName(registerRequestDTO.getFirstName())
                .lastName(registerRequestDTO.getLastName())
                .gender(registerRequestDTO.getGender())
                .customerAccount(a)
                .build();

        a.setCustomer(c);

        Customer customer = customerRepository.save(c);


        return c.getCustomerId();
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
//            var signToken = verifyToken(request.getToken(), true);
//            //Lấy body
//            String jit = signToken.getJWTClaimsSet().getJWTID();
//
//            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

//            log.info("DATETIME: {}", expiryTime.toInstant());

            invalidTokenRepsitory.save(InvalidToken.builder()
                    .token_id(token)
                    .expired_at(jwt.getJWTClaimsSet().getExpirationTime().toInstant())
                    .build());
            return true;
        } catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }
}
