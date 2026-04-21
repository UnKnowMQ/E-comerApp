package com.CyberSecCourse.FinalProject.controller.payment;



import com.CyberSecCourse.FinalProject.entity.WalletTransaction;
import com.CyberSecCourse.FinalProject.repository.WalletTransactionRepository;
import com.CyberSecCourse.FinalProject.service.impl.CheckoutServiceImpl;
import com.CyberSecCourse.FinalProject.service.impl.WalletServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.payos.PayOS;
import vn.payos.model.webhooks.Webhook;
import vn.payos.model.webhooks.WebhookData;

import java.math.BigDecimal;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/payment")
public class PaymentController {

    private final PayOS payOS;

    private final WalletServiceImpl walletService;

    private final WalletTransactionRepository walletTransactionRepository;

    @PostMapping("/payos_transfer_handler")
    public ResponseEntity<?> payosTransferHandler(@RequestBody ObjectNode body) {

        log.info("Webhook running!!!");
        try {

            ObjectMapper mapper = new ObjectMapper();
            Webhook webhook = mapper.treeToValue(body, Webhook.class);

            WebhookData data = payOS.webhooks().verify(webhook);

            if (data == null) {
                return ResponseEntity.ok("OK");
            }

            Long orderCode = data.getOrderCode();
            Long amount = data.getAmount();

            if (orderCode == null) {
                return ResponseEntity.ok("OK");
            }

            WalletTransaction tx = walletTransactionRepository.findByOrderCode(orderCode);

            if (tx == null) {
                return ResponseEntity.ok("OK");
            }

            Long userId = Long.valueOf(tx.getWallet().getUserId());
            log.info(data.getDesc());
            if ("success".equals(data.getDesc())) {
                walletService.depositProcessing(userId, BigDecimal.valueOf(amount), "PAID", tx);
            } else {
                walletService.depositProcessing(userId, BigDecimal.valueOf(amount), "FAIL", tx);
            }

        } catch (Exception e) {
            log.error("Webhook error", e);
        }

        return ResponseEntity.ok("OK");
    }



}
