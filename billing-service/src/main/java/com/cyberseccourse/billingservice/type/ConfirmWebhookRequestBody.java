package com.cyberseccourse.billingservice.type;


import lombok.*;

@Getter
@Setter
public class ConfirmWebhookRequestBody {
    private String webhookUrl;

    public ConfirmWebhookRequestBody(String webhookUrl) {
        this.webhookUrl = webhookUrl;
    }
}