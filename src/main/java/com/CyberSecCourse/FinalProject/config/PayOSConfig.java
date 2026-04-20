package com.CyberSecCourse.FinalProject.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vn.payos.PayOS;

@Configuration
public class PayOSConfig {

    @Value("${payos.client_id}")
    private String clientId;

    @Value("${payos.api-key}")
    private String apiKey;

    @Value("${payos.checksum-key}")
    private String checksumKey;
    @Bean
    public PayOS payOS() {
        System.out.println("PayOS clientId: " + clientId);
        System.out.println("PayOS apiKey: " + apiKey);
        System.out.println("PayOS checksumKey: " + checksumKey);
        return new PayOS(
                clientId,
                apiKey,
                checksumKey
        );
    }
}
