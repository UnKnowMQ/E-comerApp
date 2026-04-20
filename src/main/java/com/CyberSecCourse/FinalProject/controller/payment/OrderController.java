package com.CyberSecCourse.FinalProject.controller.payment;


import com.CyberSecCourse.FinalProject.dto.request.InvoiceRequest;
import com.CyberSecCourse.FinalProject.dto.request.ProductRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.CartItemResponse;
import com.CyberSecCourse.FinalProject.dto.response.ResponseData;
import com.CyberSecCourse.FinalProject.entity.WalletTransaction;
import com.CyberSecCourse.FinalProject.repository.WalletTransactionRepository;
import com.CyberSecCourse.FinalProject.service.CartService;
import com.CyberSecCourse.FinalProject.service.impl.CartServiceImpl;
import com.CyberSecCourse.FinalProject.service.impl.CheckoutServiceImpl;
import com.CyberSecCourse.FinalProject.service.impl.WalletServiceImpl;
import com.CyberSecCourse.FinalProject.type.CreatePaymentLinkRequestBody;
import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.docx4j.wml.R;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import vn.payos.PayOS;
import vn.payos.*;
import vn.payos.exception.PayOSException;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.v2.paymentRequests.PaymentLinkItem;
import vn.payos.model.webhooks.Webhook;
import vn.payos.model.webhooks.WebhookData;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;


@Slf4j
@RestController
@RequestMapping("/Order")
@RequiredArgsConstructor
public class OrderController {

    private final PayOS payOS;
    private final CheckoutServiceImpl checkoutService;

    private final CartServiceImpl cartService;

    private final WalletServiceImpl walletService;

    private final WalletTransactionRepository walletTransactionRepository;

    @Value("${payos.client_id}")
    private String clientId;

    @Value("${payos.api-key}")
    private String apiKey;

    @Value("${payos.checksum-key}")
    private String checksumKey;

    @PostMapping("/create")
    public ObjectNode createPaymentLink(@RequestBody CreatePaymentLinkRequestBody requestBody) {
        log.info("key:" + clientId + "apiKey:" + apiKey + "checksumKey:" + checksumKey);
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();

        try {
            String productName = requestBody.getProductName();
//            String username = requestBody.getUsername();
            String description = requestBody.getDescription();
            String returnUrl = requestBody.getReturnUrl();
            String cancelUrl = requestBody.getCancelUrl();
            Long userId  = requestBody.getUserId();
            int price = requestBody.getPrice();
           // var productRequestDTO = requestBody.getProductRequestDTO();

            // Gen order code
            String currentTimeString = String.valueOf(new Date().getTime());
            long orderCode = Long.parseLong(currentTimeString.substring(currentTimeString.length() - 6));
                PaymentLinkItem item = PaymentLinkItem.builder()
                        .name(productName)
                        .price(Long.valueOf(price))
                        .quantity(1)
                        .build();

            CreatePaymentLinkRequest paymentRequest = CreatePaymentLinkRequest.builder()
                    .orderCode(orderCode)
                    .item(item)
                    .amount((long) price)
                    .description(description)
                    .cancelUrl(cancelUrl)
                    .expiredAt(System.currentTimeMillis() / 1000 + 15 * 60)
                    .returnUrl(returnUrl)
                    .build();

//            if (productRequestDTO.getProductName() != null) {
//                // trường hợp 1 item
//                PaymentLinkItem item = PaymentLinkItem.builder()
//                        .name(productRequestDTO.getProductName())
//                        .price(productRequestDTO.getPrice().longValue())
//                        .quantity(1)
//                        .build();
//
//                paymentRequest.setItems(List.of(item));
//            } else {
//                // nhiều item từ cart
//                List<PaymentLinkItem> items = new ArrayList<>();
//                List<CartItemResponse> cartItems = cartService.getCartItemsByCustomer(username);
//                for (CartItemResponse cartItem : cartItems) {
//                    PaymentLinkItem it = PaymentLinkItem.builder()
//                            .name(cartItem.getProductResponse().getProductName())
//                            .price(cartItem.getProductResponse().getPrice().longValue())
//                            .quantity(cartItem.getQuantity())
//                            .build();
//                    items.add(it);
//                }
//                paymentRequest.setItems(items);
//            }

            CreatePaymentLinkResponse data = payOS.paymentRequests().create(paymentRequest);

            // Lưu invoice pending vào DB
//            InvoiceRequest invoiceRequest = requestBody.getInvoiceRequest();
//            invoiceRequest.setInvoice_status(InvoiceStatus.PENDING);
//            invoiceRequest.setOrder_code(orderCode);
//            // expiredAt: SDK v2 có thể không dùng trường expiredAt như cũ, tùy config của bạn
//            invoiceRequest.setExpired_at(Instant.now().plusSeconds(30 * 60));
//
//            checkoutService.checkOut1(invoiceRequest, productRequestDTO);
//
            walletService.depositCreating(userId, BigDecimal.valueOf(price),orderCode);

            response.put("error", 0);
            response.put("message", "success");
            // Chuyển đổi response v2 sang JSON
            response.set("data", objectMapper.valueToTree(data));
            return response;

        } catch (PayOSException e) {
            log.error("PayOS error", e);
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.set("data", null);
            return response;
        } catch (Exception e) {
            log.error("Unexpected error", e);
            response.put("error", -1);
            response.put("message", "fail");
            response.set("data", null);
            return response;
        }
    }


    @PostMapping("/webhook")
    public ObjectNode webhookHandler(@RequestBody Webhook webhookData) {

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode response = mapper.createObjectNode();

        try {
            // 1. Xác thực chữ ký
            var data = payOS.webhooks().verify(webhookData);

            // 2. Lấy dữ liệu giao dịch
            Long orderCode = data.getOrderCode();
            log.info("ORDER_CODE = {}", orderCode);

            Long userId = walletTransactionRepository.getUserIdByOrderCode(orderCode);
            WalletTransaction walletTransaction = walletTransactionRepository.findByOrderCode(orderCode);

            // 3. Cập nhật đơn hàng
            walletService.depositProcessing(userId, BigDecimal.valueOf(data.getAmount()),"PAID",walletTransaction);

            response.put("error", 0);
            response.put("message", "Webhook processed");
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            try {
                var data = payOS.webhooks().verify(webhookData);

                // 2. Lấy dữ liệu giao dịch
                Long orderCode = data.getOrderCode();
                log.info("ORDER_CODE = {}", orderCode);

                Long userId = walletTransactionRepository.getUserIdByOrderCode(orderCode);
                WalletTransaction walletTransaction = walletTransactionRepository.findByOrderCode(orderCode);

                walletService.depositProcessing(userId, BigDecimal.valueOf(data.getAmount()),"FAIL",walletTransaction);
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
            response.put("error", -1);
            response.put("message", e.getMessage());
            return response;
        }
    }








}
