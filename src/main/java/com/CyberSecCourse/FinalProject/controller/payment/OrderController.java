package com.CyberSecCourse.FinalProject.controller.payment;


import com.CyberSecCourse.FinalProject.dto.request.InvoiceRequest;
import com.CyberSecCourse.FinalProject.dto.request.ProductRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.CartItemResponse;
import com.CyberSecCourse.FinalProject.service.CartService;
import com.CyberSecCourse.FinalProject.service.impl.CartServiceImpl;
import com.CyberSecCourse.FinalProject.service.impl.CheckoutServiceImpl;
import com.CyberSecCourse.FinalProject.type.CreatePaymentLinkRequestBody;
import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.*;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.ItemData;
import vn.payos.type.PaymentData;
import vn.payos.type.PaymentLinkData;

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

    @PostMapping(path = "/create")
    public ObjectNode createPaymentLink(@RequestBody CreatePaymentLinkRequestBody RequestBody ) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        try {
            final String productName = RequestBody.getProductName();
            final String username = RequestBody.getUsername();
            final String description = RequestBody.getDescription();
            final String returnUrl = RequestBody.getReturnUrl();
            final String cancelUrl = RequestBody.getCancelUrl();
            final int price = RequestBody.getPrice();
            final ProductRequestDTO productRequestDTO = RequestBody.getProductRequestDTO();

            // Gen order code
            String currentTimeString = String.valueOf(String.valueOf(new Date().getTime()));
            long orderCode = Long.parseLong(currentTimeString.substring(currentTimeString.length() - 6));

            if(productRequestDTO.getProductName() != null) {
                ItemData item = ItemData.builder().name(productRequestDTO.getProductName()).price(productRequestDTO.getPrice().intValue()).quantity(1).build();
                PaymentData paymentData = PaymentData.builder().orderCode(orderCode).description(description).amount(price)
                        .item(item).returnUrl(returnUrl).cancelUrl(cancelUrl).expiredAt(System.currentTimeMillis()/1000 + 30*60).build();
                CheckoutResponseData data = payOS.createPaymentLink(paymentData);
                //lưu pending status invoice vào db
                InvoiceRequest invoiceRequest = RequestBody.getInvoiceRequest();
                invoiceRequest.setInvoice_status(InvoiceStatus.PENDING);
                invoiceRequest.setOrder_code(orderCode);
                invoiceRequest.setExpired_at(new Date(paymentData.getExpiredAt()).toInstant());

                log.info(invoiceRequest.toString());

                checkoutService.checkOut1(invoiceRequest,productRequestDTO);

                response.put("error", 0);
                response.put("message", "success");
                response.set("data", objectMapper.valueToTree(data));
                return response;
            }
            else{
                List<CartItemResponse> cartItemResponses = cartService.getCartItemsByCustomer(username);
                List<ItemData> items = new ArrayList<>();
                cartItemResponses.forEach(cartItem ->{
                    items.add(ItemData.builder()
                                    .name(cartItem.getProductResponse().getProductName())
                                    .price(cartItem.getProductResponse().getPrice().intValue())
                                    .quantity(cartItem.getQuantity())
                            .build());
                });
                PaymentData paymentData = PaymentData.builder().orderCode(orderCode).description(description).amount(price)
                        .items(items).returnUrl(returnUrl).cancelUrl(cancelUrl).expiredAt(System.currentTimeMillis()/1000 + 30*60).build();

                CheckoutResponseData data = payOS.createPaymentLink(paymentData);
                //lưu pending status invoice vào db
                InvoiceRequest invoiceRequest = RequestBody.getInvoiceRequest();
                invoiceRequest.setInvoice_status(InvoiceStatus.PENDING);
                invoiceRequest.setOrder_code(orderCode);
                invoiceRequest.setExpired_at(new Date(paymentData.getExpiredAt()).toInstant());
                log.info(invoiceRequest.toString());
                checkoutService.checkOut1(invoiceRequest,productRequestDTO);
                response.put("error", 0);
                response.put("message", "success");
                response.set("data", objectMapper.valueToTree(data));
                return response;
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", "fail");
            response.set("data", null);
            return response;

        }
    }

    @GetMapping(path = "/{orderId}")
    public ObjectNode getOrderById(@PathVariable("orderId") long orderId) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();

        try {
            PaymentLinkData order = payOS.getPaymentLinkInformation(orderId);

            response.set("data", objectMapper.valueToTree(order));
            response.put("error", 0);
            response.put("message", "ok");
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.set("data", null);
            return response;
        }

    }

    @PutMapping(path = "/{orderId}")
    public ObjectNode cancelOrder(@PathVariable("orderId") int orderId) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        try {
            PaymentLinkData order = payOS.cancelPaymentLink(orderId, null);
            response.set("data", objectMapper.valueToTree(order));
            response.put("error", 0);
            response.put("message", "ok");
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.set("data", null);
            return response;
        }
    }

    @PostMapping(path = "/confirm-webhook")
    public ObjectNode confirmWebhook(@RequestBody Map<String, String> requestBody) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        try {
            String str = payOS.confirmWebhook(requestBody.get("webhookUrl"));
            response.set("data", objectMapper.valueToTree(str));
            response.put("error", 0);
            response.put("message", "ok");
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
