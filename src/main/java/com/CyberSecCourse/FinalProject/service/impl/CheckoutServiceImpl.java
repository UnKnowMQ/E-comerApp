package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.request.InvoiceRequest;
import com.CyberSecCourse.FinalProject.dto.request.ProductRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.InvoiceDetailResponse;
import com.CyberSecCourse.FinalProject.dto.response.InvoiceResponse;
import com.CyberSecCourse.FinalProject.entity.*;
import com.CyberSecCourse.FinalProject.repository.*;
import com.CyberSecCourse.FinalProject.service.CheckoutService;
import com.CyberSecCourse.FinalProject.service.InvoiceRedisService;
import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    private final WalletRepository walletRepository;

    private final WalletTransactionRepository walletTransactionRepository;

    private final ShopRepository shopRepository;

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
            checkOutInvoice.setInvoice_status(InvoiceStatus.DELIVERY);
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
    public InvoiceResponse checkout(InvoiceRequest request, ProductRequestDTO productDTO) {

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
        return mapToResponse(invoice);
    }
    private boolean isBuyNow(ProductRequestDTO dto) {
        return dto != null && dto.getId() != null;
    }
    private Invoice buildInvoice(InvoiceRequest req, User user) {
        Shop shop = shopRepository.getReferenceById(req.getShopId());
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
                .shop(shop)
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

        invoice.setInvoice_status(InvoiceStatus.WFAD);
        invoiceRepository.save(invoice);

        Set<InvoiceDetail> setInvoiceDetail = invoice.getSetInvoiceDetail();
        log.info(setInvoiceDetail.toString());
        setInvoiceDetail.forEach((invoiceDetail -> {
            Product s = invoiceDetail.getProduct();
            s.setQuantity(s.getQuantity() - invoiceDetail.getQuantity());
            s.setSaleVolume(s.getSaleVolume() + invoiceDetail.getQuantity());
            productRepository.save(s);
        }));
        int userid = invoiceRepository.UserIdByInvoice(Math.toIntExact(invoiceId));
        Wallet walletBuy = walletRepository.findByUserId((long) userid);
        walletBuy.setBalance(walletBuy.getBalance().subtract(invoice.getTotal_amount()));
        System.out.println(invoice.getShop().getUserId());
        Wallet walletSell = walletRepository.findByUserId(Long.valueOf(invoice.getShop().getUserId()));
        walletSell.setBalance(walletSell.getBalance().add(invoice.getTotal_amount()));
        walletRepository.save(walletBuy);
        walletRepository.save(walletSell);

        WalletTransaction walletTransactionBuy = WalletTransaction.builder()
                .wallet(walletBuy)
                .amount(invoice.getTotal_amount())
                .createdAt(LocalDateTime.now())
                .type("BUY")
                .status("SUCCESS")
                .orderCode(invoice.getOrder_code())
                .build();
        WalletTransaction walletTransactionSell = WalletTransaction.builder()
                .wallet(walletSell)
                .amount(invoice.getTotal_amount())
                .createdAt(LocalDateTime.now())
                .type("SELL")
                .status("SUCCESS")
                .orderCode(invoice.getOrder_code())
                .build();
        walletTransactionRepository.save(walletTransactionSell);
        walletTransactionRepository.save(walletTransactionBuy);

        // ✅ Xóa key Redis để không bị auto-cancel
        invoiceRedisService.cancelSchedule(invoiceId);
    }

    @Transactional
    public InvoiceStatus handlePayment(Long invoiceId) {
        if(invoiceRepository.findById(Math.toIntExact(invoiceId)).isEmpty())
        {
            throw new RuntimeException("Invoice not found");
        }
        Invoice invoice = invoiceRepository.getReferenceById(Math.toIntExact(invoiceId));

        if(walletRepository.findByUserId(Long.valueOf(invoice.getUser().getUserId())).getBalance().compareTo(invoice.getTotal_amount()) <0  ){
            throw new RuntimeException("Not enough balance");
        }
        if(invoiceRepository.findById(Math.toIntExact(invoiceId)).get().getInvoice_status() != InvoiceStatus.PENDING){
            throw new RuntimeException("Invoice had been proccessed!");
        }
        confirmPayment(invoiceId);
        return invoice.getInvoice_status();
    }
    public InvoiceResponse mapToResponse(Invoice invoice) {

        return InvoiceResponse.builder()
                .invoiceId(invoice.getInvoice_id())
                .invoiceDate(invoice.getInvoice_date())
                .totalAmount(invoice.getTotal_amount())
                .paymentMethod(invoice.getPayment_method())
                .shippingAddress(invoice.getShipping_address())
                .status(invoice.getInvoice_status())
                .note(invoice.getNote())
                .orderCode(invoice.getOrder_code())
                .paymentId(invoice.getPayment_id())
                .expiredAt(invoice.getExprired_at())

                // user
                .userId(invoice.getUser().getUserId())
                .username(invoice.getUser().getUsername())

                // shop
                .shopId(invoice.getShop().getShopId())
                .shopName(invoice.getShop().getShopName())
                .details(invoiceDetailRepository.findByInvoiceId(invoice.getInvoice_id()).stream().map(d->
                         InvoiceDetailResponse.builder()
                                        .productId(d.getProduct().getId())
                                        .productName(d.getProduct().getProductName())
                                        .quantity(d.getQuantity())
                                        .unitPrice(d.getUnitPrice())
                                        .build()  ).toList())
                // details
//                .details(
//                        invoice.getSetInvoiceDetail().stream()
//                                .map(d -> InvoiceDetailResponse.builder()
//                                        .productId(d.getProduct().getId())
//                                        .productName(d.getProduct().getProductName())
//                                        .quantity(d.getQuantity())
//                                        .unitPrice(d.getUnitPrice())
//                                        .build())
//                                .toList()
//                )
                .build();
    }

}
