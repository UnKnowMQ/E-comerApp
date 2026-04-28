package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.request.InvoiceDetailRequest;
import com.CyberSecCourse.FinalProject.dto.request.InvoiceRequest;
import com.CyberSecCourse.FinalProject.dto.request.ProductRequestDTO;
import com.CyberSecCourse.FinalProject.entity.*;
import com.CyberSecCourse.FinalProject.repository.*;
import com.CyberSecCourse.FinalProject.service.CheckoutService;
import com.CyberSecCourse.FinalProject.service.InvoiceRedisService;
import com.CyberSecCourse.FinalProject.service.InvoiceService;
import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;


@Service
@RequiredArgsConstructor
@Slf4j
public class CheckoutServiceImpl implements CheckoutService {

    private final InvoiceRepository invoiceRepository;

    private final InvoiceDetailRepository invoiceDetailRepository;

    private final ProductRepository productRepository;

    private final UserRepository customerRepository;

    private final CartItemRepository cartItemRepository;

    private  final  CartRepository cartRepository;

    private final InvoiceServiceImpl invoiceServiceImpl;

    private final MailServiceImpl mailService;

    private final InvoiceRedisService invoiceRedisService;

//
//    @Value("${filePath}")
//    private String filePath;

    @Override
    public void checkOut1(InvoiceRequest invoiceRequest, ProductRequestDTO productRequestDTO) {

        Optional<User> c = customerRepository.findById(invoiceRequest.getCustomerId());

    //to Invoice
        Invoice invoice  =  Invoice.builder()
                .invoice_date(invoiceRequest.getInvoice_date())
                .invoice_status(invoiceRequest.getInvoice_status())
                .note(invoiceRequest.getNote())
                .user(c.orElseThrow())
                .order_code(invoiceRequest.getOrder_code())
                .total_amount(invoiceRequest.getTotal_amount())
                .exprired_at(invoiceRequest.getExpired_at())
                .shipping_address(invoiceRequest.getShipping_address())
                .payment_method(invoiceRequest.getPayment_method())
                .payment_id(invoiceRequest.getPayment_id())
                .build();

        invoiceRepository.save(invoice);
        // from cartItem to InvoiceDetail
        if(productRequestDTO.getProductName() == null)
        {
            List<CartItem> cartItems =  cartItemRepository.findCartItemByCustomerId(c.get().getUserId());
            cartItems.forEach(cartItem -> {
                cartItemToInvoiceDetail(cartItem, invoice);
            });

            cartRepository.findByCustomerId(c.get().getUsername()).setCartStatus("PROCESSTOCHECKOUT");


        }
        else{
            InvoiceDetailId invoiceDetailId = InvoiceDetailId.builder()
                    .product_id(productRequestDTO.getId())
                    .invoice_id(invoice.getInvoice_id())
                    .build();
            Product product = productRepository.findById(productRequestDTO.getId()).orElseThrow();

            InvoiceDetail invoiceDetail = InvoiceDetail.builder()
                    .invoice(invoice)
                    .unitPrice(productRequestDTO.getPrice())
                    .product(product)
                    .quantity(1)
                    .id(invoiceDetailId)
                    .build();

            invoiceDetailRepository.save(invoiceDetail);
        }

        log.info("Invoice saved!");
    }

    @Override
    public boolean checkOut2(String status , Long orderCode  ) throws  Exception {

        Invoice checkOutInvoice = invoiceRepository.findInvoiceByOrderCode(orderCode).orElseThrow();
        invoiceServiceImpl.createInvoice(checkOutInvoice);
        if (checkOutInvoice == null)
            return false;

        if("success".equalsIgnoreCase(status))
        {
            checkOutInvoice.setInvoice_status(InvoiceStatus.SHIPPING);
            cartItemRepository.deleteAll(cartItemRepository.findCartItemByCustomerId(checkOutInvoice.getUser().getUserId()));
            Cart c =  cartRepository.findByCustomerId((checkOutInvoice.getUser().getUsername()));
            if(c != null)
                cartRepository.delete(c);
            invoiceServiceImpl.createInvoice(checkOutInvoice);
            mailService.sendMailWithAttachment(checkOutInvoice.getUser().getEmail(),"Hoá đơn của bạn","Xin chào, vui lòng xem hóa đơn trong file đính kèm.","/app/output/Hoadon.pdf");
        }
        else {
            checkOutInvoice.setInvoice_status(InvoiceStatus.CANCELLED);
        }
        invoiceRepository.save(checkOutInvoice);
        return true;
    }
    public InvoiceDetail cartItemToInvoiceDetail(CartItem cartItem, Invoice invoice) {

        InvoiceDetailId invoiceDetailId = InvoiceDetailId.builder()
                .invoice_id(invoice.getInvoice_id())
                .product_id(cartItem.getProduct().getId())
                .build();

        InvoiceDetail invoiceDetail = InvoiceDetail.builder()
                .id(invoiceDetailId)
                .invoice(invoice)
                .product(cartItem.getProduct())
                .quantity(cartItem.getQuantity())
                .unitPrice(cartItem.getPrice())
                .build();

       invoiceDetailRepository.save(invoiceDetail);

        return  invoiceDetail;
    }
    @Transactional
    public Invoice checkout(InvoiceRequest request, ProductRequestDTO productDTO) {

        User user = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Invoice invoice = buildInvoice(request, user);
        invoiceRepository.save(invoice);

        if (isBuyNow(productDTO)) {
            handleBuyNow(invoice, productDTO);
        } else {
            handleCartCheckout(invoice, user);
        }
        invoiceRedisService.scheduleCancelAfter15Min(Long.valueOf(invoice.getInvoice_id()));
        return invoice;
    }
    private boolean isBuyNow(ProductRequestDTO dto) {
        return dto != null && dto.getId() != null;
    }
    private Invoice buildInvoice(InvoiceRequest req, User user) {
        return Invoice.builder()
                .invoice_date(req.getInvoice_date())
                .invoice_status(InvoiceStatus.valueOf("PENDING"))
                .note(req.getNote())
                .user(user)
                .order_code(req.getOrder_code())
                .total_amount(req.getTotal_amount())
                .exprired_at(req.getExpired_at())
                .shipping_address(req.getShipping_address())
                .payment_method(req.getPayment_method())
                .payment_id(req.getPayment_id())
                .build();
    }
    private void handleCartCheckout(Invoice invoice, User user) {

        List<CartItem> cartItems = cartItemRepository.findCartItemByCustomerId(user.getUserId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        List<InvoiceDetail> details = cartItems.stream()
                .map(ci -> mapToDetail(ci, invoice))
                .toList();

        invoiceDetailRepository.saveAll(details);

        // clear cart
        cartItemRepository.deleteAll(cartItems);

        Cart cart = cartRepository.findByCustomerId(user.getUsername());
        if (cart != null) {
            cart.setCartStatus("CHECKED_OUT");
            cartRepository.save(cart);
        }

    }
    private void handleBuyNow(Invoice invoice, ProductRequestDTO dto) {

        Product product = productRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        InvoiceDetail detail = InvoiceDetail.builder()
                .id(new InvoiceDetailId(invoice.getInvoice_id(), product.getId()))
                .invoice(invoice)
                .product(product)
                .quantity(1)
                .unitPrice(dto.getPrice())
                .build();

        invoiceDetailRepository.save(detail);
    }
    private InvoiceDetail mapToDetail(CartItem ci, Invoice invoice) {
        return InvoiceDetail.builder()
                .id(new InvoiceDetailId(invoice.getInvoice_id(), ci.getProduct().getId()))
                .invoice(invoice)
                .product(ci.getProduct())
                .quantity(ci.getQuantity())
                .unitPrice(ci.getPrice())
                .build();
    }
    @Transactional
    public void confirmPayment(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(Math.toIntExact(invoiceId))
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        invoice.setInvoice_status(InvoiceStatus.SHIPPING);
        invoiceRepository.save(invoice);

        // ✅ Xóa key Redis để không bị auto-cancel
        invoiceRedisService.cancelSchedule(invoiceId);
    }


}
