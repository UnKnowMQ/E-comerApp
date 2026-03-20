package com.cyberseccourse.userservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    @Value("${jwt.signerKey}")
    protected String SECRET_KEY;

    @Value("${frontend.url}")
    protected String FRONTEND_URL;


    public static final  String[] PUBLIC_ENDPOINTS = {"/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**", "/swagger-ui.html", "/webjars/**"};
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws  Exception{

        httpSecurity
                .authorizeHttpRequests(request -> request.requestMatchers(PUBLIC_ENDPOINTS).permitAll()
//                        .requestMatchers(HttpMethod.GET,"user/**")
//                        .hasAuthority("SCOPE_ADMIN")
                                .anyRequest().authenticated()
                )
        .cors(Customizer.withDefaults())
        .csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();

    }

}
