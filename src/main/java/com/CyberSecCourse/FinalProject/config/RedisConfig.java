package com.CyberSecCourse.FinalProject.config;

import com.CyberSecCourse.FinalProject.service.InvoiceExpiredListener;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;

import java.util.Queue;

@Configuration
public class RedisConfig {

    // Bật keyspace notification để lắng nghe key expired
    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory factory,
            InvoiceExpiredListener listener) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(factory);

        // Lắng nghe channel expired của database 0
        container.addMessageListener(listener,
                new PatternTopic("__keyevent@0__:expired"));

        return container;
    }

    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory factory) {
        return new StringRedisTemplate(factory);
    }
}