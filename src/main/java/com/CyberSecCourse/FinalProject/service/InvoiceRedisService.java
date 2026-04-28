package com.CyberSecCourse.FinalProject.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceRedisService {

    private final StringRedisTemplate redisTemplate;

    private static final String PREFIX = "invoice:pending:";
    private static final long CANCEL_AFTER_MINUTES = 15;

    public void scheduleCancelAfter15Min(Long invoiceId) {
        String key = PREFIX + invoiceId;
        // Set key với TTL 15 phút, sau khi expired sẽ trigger listener
        redisTemplate.opsForValue().set(key, String.valueOf(invoiceId),
                CANCEL_AFTER_MINUTES, TimeUnit.MINUTES);

        log.info("Scheduled cancel for invoice {} after {} minutes", invoiceId, CANCEL_AFTER_MINUTES);
    }

    public void cancelSchedule(Long invoiceId) {
        // Gọi khi user đã thanh toán thành công → xóa key để không bị cancel
        redisTemplate.delete(PREFIX + invoiceId);
        log.info("Cancelled schedule for invoice {}", invoiceId);
    }
}