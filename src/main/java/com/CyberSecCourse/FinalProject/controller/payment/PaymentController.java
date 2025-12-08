package com.CyberSecCourse.FinalProject.controller.payment;



import com.CyberSecCourse.FinalProject.service.impl.CheckoutServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.payos.PayOS;
import vn.payos.model.webhooks.Webhook;
import vn.payos.model.webhooks.WebhookData;

import java.util.Map;


@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/payment")
public class PaymentController {

    private final PayOS payOS;
    private final CheckoutServiceImpl checkoutService;

    @PostMapping(path = "/payos_transfer_handler")
    public ObjectNode payosTransferHandler(@RequestBody ObjectNode body)
            throws JsonProcessingException, IllegalArgumentException {

        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();

        try {
            Webhook webhookBody = objectMapper.treeToValue(body, Webhook.class);

            // 1. Xác thực webhook
            WebhookData verifiedData = payOS.webhooks().verify(webhookBody);


           //  2. Lấy payload map an toàn
            String invoiceStatus = verifiedData.getDesc() != null ? verifiedData.getDesc() : "UNKNOWN";
            Long orderCode = verifiedData.getOrderCode() != null  ? verifiedData.getOrderCode(): null;

            log.info("WebhookData: " + verifiedData);
            log.info("Webhook: " + webhookBody);
//
//            // 3. Cập nhật DB
            if (orderCode != null) {
                checkoutService.checkOut2(invoiceStatus, orderCode);
            }

            // 4. Trả response
            response.put("error", 0);
            response.put("message", "Webhook delivered");
            response.set("data", null);
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.set("data", null);
            return response;
        }
    }



}
