package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.request.InvoiceDetailRequest;
import com.CyberSecCourse.FinalProject.dto.request.InvoiceRequest;
import com.CyberSecCourse.FinalProject.dto.request.ProductRequestDTO;
import com.CyberSecCourse.FinalProject.entity.*;
import com.CyberSecCourse.FinalProject.repository.*;
import com.CyberSecCourse.FinalProject.service.CheckoutService;
import com.CyberSecCourse.FinalProject.service.InvoiceService;
import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
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

    private final CustomerRepository customerRepository;

    private final CartItemRepository cartItemRepository;

    private  final  CartRepository cartRepository;

    private final InvoiceServiceImpl invoiceServiceImpl;

    private final MailServiceImpl mailService;
//
//    @Value("${filePath}")
//    private String filePath;

    @Override
    public void checkOut1(InvoiceRequest invoiceRequest, ProductRequestDTO productRequestDTO) {

        Optional<Customer> c = customerRepository.findById(invoiceRequest.getCustomerId());

    //to Invoice
        Invoice invoice  =  Invoice.builder()
                .invoice_date(invoiceRequest.getInvoice_date())
                .invoice_status(invoiceRequest.getInvoice_status())
                .note(invoiceRequest.getNote())
                .customer(c.orElseThrow())
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
            List<CartItem> cartItems =  cartItemRepository.findCartItemByCustomerId(c.get().getCustomerId());
            cartItems.forEach(cartItem -> {
                cartItemToInvoiceDetail(cartItem, invoice);
            });

            cartRepository.findByCustomerId(c.get().getCustomerAccount().getUsername()).setCartStatus("PROCESSTOCHECKOUT");


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
                    .subTotal(productRequestDTO.getPrice())
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
            cartItemRepository.deleteAll(cartItemRepository.findCartItemByCustomerId(checkOutInvoice.getCustomer().getCustomerId()));
            Cart c =  cartRepository.findByCustomerId((checkOutInvoice.getCustomer().getCustomerAccount().getUsername()));
            if(c != null)
                cartRepository.delete(c);
            invoiceServiceImpl.createInvoice(checkOutInvoice);
            mailService.sendMailWithAttachment(checkOutInvoice.getCustomer().getEmail(),"Hoá đơn của bạn","Xin chào, vui lòng xem hóa đơn trong file đính kèm.","/app/output/Hoadon.pdf");
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
                .subTotal( cartItem.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                .unitPrice(cartItem.getPrice())
                .build();

       invoiceDetailRepository.save(invoiceDetail);

        return  invoiceDetail;
    }

}
